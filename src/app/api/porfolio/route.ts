import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, unlink } from "fs/promises";
import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const PortfolioSchema = z.object({
  title: z.string().min(1),
  summary: z.string(),
  name: z.string().min(2),
  education: z.string().optional(),
  location: z.string().optional(),
  yearofexperience: z.string().optional(),
  passionate: z.string().optional(),
 // achievements: z.string().optional(),
  //availability: z.string().optional(),
  techstack: z.array(z.any()).optional(),
  experiences: z.array(z.any()).optional(),
  projects: z.array(z.any()).optional(),
  certifications: z.array(z.any()).optional(),
  links: z
    .array(
      z.object({
        platform: z.string(),
        url: z.string().url(),
      }),
    )
    .optional(),
});

const MAX_FILE_SIZE = 5 * 1024 * 1025; //5MD
const ALLOWED_MINI_TYPES = ["image/jpeg", "image/png", "image/webp"];
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads");

//helper
async function handleFileUpload(file: File | null, oldPath?: string) {
  if (!file) return undefined;

  if (!ALLOWED_MINI_TYPES.includes(file.type)) {
    throw new Error("Invalid file type");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large");
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const extension = path.extname(file.name);
  const filename = `${uuid()}${extension}`;
  const absoluteUploadPath = path.join(UPLOAD_DIR, filename);

  //file upload check
  if (!fs.existsSync(UPLOAD_DIR)) {
    await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
  }
  await writeFile(absoluteUploadPath, buffer);

  if (oldPath) {
    const oldAbsolutePath = path.join(process.cwd(), "public", oldPath);
    //old file delete kar raha hai
    if (fs.existsSync(oldAbsolutePath)) {
      await unlink(oldAbsolutePath).catch(console.error);
    }
  }
  return `/uploads/${filename}`;
}
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // const user = await prisma.user.findUnique({
    //   where: { id: session.user.id },
    // });

    // if (!user) {
    //   return NextResponse.json({ message: "User not found" }, { status: 403 });
    // }

    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { userid: session.user.id },
    });

    if (existingPortfolio) {
      return NextResponse.json(
        { message: "Portfolio already exists" },
        { status: 409 },
      );
    }

    const formData = await req.formData();
    console.log(formData);
    const file = formData.get("profile") as File | null;
    let profilePath = await handleFileUpload(file);
    if (!profilePath) {
      return NextResponse.json(
        { message: "Profile image is required" },
        { status: 400 },
      );
    }
    const portfolioData = {
      title: formData.get("title"),
      summary: formData.get("summary"),
      name: formData.get("name"),
      education: formData.get("education"),
      passionate: formData.get("passionate"),
      location: formData.get("location"),
      yearofexperience: formData.get("yearofexperience"),
      experiences: JSON.parse((formData.get("experiences") as string) || "[]"),
      projects: JSON.parse((formData.get("projects") as string) || "[]"),
      techstack: JSON.parse((formData.get("techstack") as string) || "[]"),
      certifications: JSON.parse(
        (formData.get("certifications") as string) || "[]",
      ),
      achievements: formData.get("achievements"),
      availability: formData.get("availability"),
      links: JSON.parse((formData.get("links") as string) || "[]"),
    };

    const validation = PortfolioSchema.safeParse(portfolioData);
    if (!validation.success) {
      return NextResponse.json(
        { errors: validation.error.flatten() },
        { status: 400 },
      );
    }
    const portfolio = await prisma.portfolio.create({
      data: {
        ...validation.data,
        profile: profilePath,
        userid: session.user.id,
        links: {
          create: validation.data.links?.map((link) => ({
            platform: link.platform,
            url: link.url,
          })),
        },
      },
      include: { links: true },
    });

    return NextResponse.json(
      { message: "Porfolio Created Successfuly", portfolio },
      { status: 200 },
    );
  } catch (error) {
    console.error("Portfolio creation error:", error);
    return NextResponse.json(
      { message: "Server error", error },
      { status: 500 },
    );
  }
}


export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const portfolio = await prisma.portfolio.findUnique({
      where: {
        userid: session.user.id,
      },
      include: {
        links: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!portfolio) {
      return NextResponse.json(
        { message: "Portfolio not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Successfully fetched", portfolio },
      { status: 200 },
    );
  } catch (error) {
    console.error("Portfolio fetch error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { userid: session.user.id },
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        { message: "No portfolio found to update" },
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("profile") as File | null;

    const profilePath = file
      ? await handleFileUpload(file, existingPortfolio.profile || undefined)
      : undefined;

    //partial makes all all properties optional:
    const updateData: any = {};

    if (formData.has("title"))
      updateData.title = formData.get("title") as string;
    if (formData.has("summary"))
      updateData.summary = formData.get("summary") as string;
    if (formData.has("name")) updateData.name = formData.get("name") as string;
    if (formData.has("education"))
      updateData.education = formData.get("education") as string;
    if (formData.has("passionate"))
      updateData.passionate = formData.get("passionate") as string;
    if (formData.has("location"))
      updateData.location = formData.get("location") as string;
    if (formData.has("yearofexperience"))
      updateData.yearofexperience = formData.get("yearofexperience") as string;
    if (formData.has("achievements"))
      updateData.achievements = formData.get("achievements") as string;
    if (formData.has("availability"))
      updateData.availability = formData.get("availability") as string;
    if (formData.has("experiences"))
      updateData.experiences = JSON.parse(
        (formData.get("experiences") as string) || "[]",
      );
    if (formData.has("projects"))
      updateData.projects = JSON.parse(
        (formData.get("projects") as string) || "[]",
      );
    if (formData.has("techstack"))
      updateData.techstack = JSON.parse(
        (formData.get("techstack") as string) || "[]",
      );
    if (formData.has("certifications"))
      updateData.certifications = JSON.parse(
        (formData.get("certifications") as string) || "[]",
      );
    if (profilePath) updateData.profile = profilePath;

    //  const validation=PortfolioSchema.partial().safeParse(updateData);
    //  if(!validation.success){
    //   return NextResponse.json(
    //     { errors: validation.error.flatten() },
    //     { status: 400 }
    //   );
    //  }
    //  let linksUpdate={};
    if (formData.has("links")) {
      const links = JSON.parse((formData.get("links") as string) || "[]");
      //.shape.links gives you just the links part:
      const linksValidation = PortfolioSchema.shape.links.safeParse(links);

      if (!linksValidation.success) {
        return NextResponse.json(
          { errors: linksValidation.error.flatten() },
          { status: 400 },
        );
      }

      await prisma.socialLink.deleteMany({
        where: { portfolioId: existingPortfolio.id },
      });

      updateData.links = {
        create:
          linksValidation.data?.map((link) => ({
            platform: link.platform,
            url: link.url,
          })) || [],
      };
    }
    const updatedPortfolio = await prisma.portfolio.update({
      where: { userid: session.user.id },
      data: updateData,
      include: { links: true },
    });
    return NextResponse.json(
      { message: "Portfolio updated", portfolio: updatedPortfolio },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update portfolio error:", error);
    return NextResponse.json(
      { message: "Internal Server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { userid: session.user.id },
    });
    if (!existingPortfolio) {
      return NextResponse.json(
        { message: "No profile to delete" },
        { status: 404 },
      );
    }

    if (existingPortfolio.profile) {
      const imagePath = path.join(
        process.cwd(),
        "public",
        existingPortfolio.profile,
      );
      try {
        fs.unlinkSync(imagePath);
      } catch (error) {
        console.error("Could able to deleted the image", error);
      }
    }
    await prisma.socialLink.deleteMany({
      where: { portfolioId: existingPortfolio.id },
    });
    const deleteProfile = await prisma.portfolio.delete({
      where: { userid: session.user.id },
    });

    return NextResponse.json(
      { message: "Portfolio deleted successfully", portfolio: deleteProfile },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
