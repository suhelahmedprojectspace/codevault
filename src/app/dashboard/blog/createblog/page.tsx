"use client";
import * as React from "react";
import { useState, useRef } from "react";
import { createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import css from "highlight.js/lib/languages/css";
import xml from "highlight.js/lib/languages/xml";
import javascript from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Visibility, visibilityOptions } from "@/constants/visibility";
import axios from "@/lib/axios";
import { EditorContent } from "@tiptap/react";
import toast from "react-hot-toast";
import { Toggle } from "@/components/ui/toggle";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Image,
  Code,
  Quote,
  Link,
  Undo,
  Redo,
  CodeSquareIcon,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import { useEditor, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

const lowlight = createLowlight();
lowlight.register("html", xml);
lowlight.register("css", css);
lowlight.register("js", javascript);
lowlight.register("typescript", ts);
lowlight.register("python", python);

const Page = () => {
  const [visibility, setVisibility] = useState<Visibility>("public");
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension,
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: "javascript",
        HTMLAttributes: {
          class: "code-block",
        },
      }),
      LinkExtension.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Write your story here...",
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "focus:outline-none min-h-[300px]",
      },
    },
    onUpdate: ({ editor }) => {
      // Content updates are handled automatically
    },
  });

  const handleImageUpload = async (file: File) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.url && editor) {
        editor.chain().focus().setImage({ src: response.data.url }).run();
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !editor?.getText()) {
      toast.error("Title and content are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post("/blog", {
        title,
        content: editor?.getHTML(),
        visibilty: visibility,
      });
      if (res.status === 201) {
        toast.success("Blog published successfully");
        setTitle("");
        editor?.commands.clearContent();
      }
    } catch (error) {
      toast.error("Failed to publish blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!editor) {
    return <div className="p-4">Loading editor...</div>;
  }

  return (
    <div className="flex justify-center items-start p-4 md:p-6">
      <Card className="w-full max-w-4xl">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="text-2xl">Create Blog Post</CardTitle>
            <CardDescription>
              Craft your story with our rich text editor
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Your compelling headline..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg font-medium"
              />
            </div>

            <div className="flex flex-wrap gap-1 p-2 border rounded-lg bg-muted">
              <Toggle
                size="sm"
                pressed={editor.isActive("bold")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
              >
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("italic")}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
              >
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("bulletList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
              >
                <List className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("orderedList")}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
              >
                <ListOrdered className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("codeBlock")}
                onPressedChange={() =>
                  editor.chain().focus().toggleCodeBlock().run()
                }
              >
                <CodeSquareIcon className="h-4 w-4" />
              </Toggle>
              <Toggle
                size="sm"
                pressed={editor.isActive("blockquote")}
                onPressedChange={() =>
                  editor.chain().focus().toggleBlockquote().run()
                }
              >
                <Quote className="h-4 w-4" />
              </Toggle>
              <button
                type="button"
                onClick={() => {
                  const url = window.prompt("Enter the URL");
                  if (url) {
                    editor.chain().focus().toggleLink({ href: url }).run();
                  }
                }}
                className="inline-flex items-center justify-center rounded-md p-2 text-sm hover:bg-accent"
              >
                <Link className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center rounded-md p-2 text-sm hover:bg-accent"
              >
                <Image className="h-4 w-4" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) =>
                    e.target.files?.[0] && handleImageUpload(e.target.files[0])
                  }
                  className="hidden"
                  accept="image/*"
                />
              </button>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="inline-flex items-center justify-center rounded-md p-2 text-sm hover:bg-accent disabled:opacity-50"
              >
                <Undo className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="inline-flex items-center justify-center rounded-md p-2 text-sm hover:bg-accent disabled:opacity-50"
              >
                <Redo className="h-4 w-4" />
              </button>
              {/* <button
  type="button"
  onClick={() => editor.chain().focus().toggleCodeBlock().run()}
  className={`inline-flex items-center justify-center rounded-md p-2 text-sm hover:bg-accent ${
    editor.isActive('codeBlock') ? 'bg-accent text-accent-foreground' : ''
  }`}
>
  <CodeSquareIcon className="h-4 w-4" />
</button> */}
            </div>
            {editor && (
              <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                <div className="flex gap-1 p-1 bg-white border rounded-lg shadow-lg">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={`p-1 rounded ${editor.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  >
                    <Bold className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={`p-1 rounded ${editor.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  >
                    <Italic className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleLink({ href: "" }).run()
                    }
                    className={`p-1 rounded ${editor.isActive("link") ? "bg-gray-200" : "hover:bg-gray-100"}`}
                  >
                    <Link className="h-4 w-4" />
                  </button>
                </div>
              </BubbleMenu>
            )}

            <div className="w-full border rounded-lg p-4 min-h-[300px] focus:outline-none">
              <EditorContent
                editor={editor}
                className="w-full [&_.ProseMirror]:w-full [&_.ProseMirror]:max-w-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Visibility</Label>
              <RadioGroup
                className="flex flex-col lg:flex-row md:flex-row gap-4"
                value={visibility}
                onValueChange={(val: Visibility) => setVisibility(val)}
              >
                {visibilityOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label
                      htmlFor={option.value}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <option.logo className="w-4 h-4" />
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setTitle("");
                editor.commands.clearContent();
              }}
            >
              Discard
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !title || !editor.getText()}
            >
              {isSubmitting ? "Publishing..." : "Publish Blog"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Page;
