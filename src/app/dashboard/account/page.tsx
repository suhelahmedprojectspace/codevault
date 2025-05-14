"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Pencil,
  Save,
  Upload,
  Lock,
  User,
  Mail,
  Trash2,
} from "lucide-react";
import axios from "@/lib/axios";
import React, { useEffect, useState } from "react";
import DeleteCard from "@/components/DeleteCard";
import { useRouter } from "next/navigation";
interface UserData {
  username: string;
  email: string;
  image: string;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const AccountPage = () => {
  //   const { toast } = useToast();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
    image: "",
  });
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isLoading, setIsLoading] = useState({
    profile: false,
    password: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/account");
        console.log(response.data.user);
        setUserData(response.data.user);
      } catch (error) {
        toast.error("Failed to fetch user data");
        // toast({
        //   title: 'Error',
        //   description: 'Failed to fetch user data',
        //   variant: 'destructive',
        // });
      }
    };
    fetchData();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async () => {
    setIsLoading({ ...isLoading, profile: true });
    try {
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("email", userData.email);

      if (previewImage) {
        const fileInput = document.getElementById(
          "image-upload",
        ) as HTMLInputElement;
        if (fileInput?.files?.[0]) {
          formData.append("image", fileInput.files[0]);
        }
      }

      const response = await axios.patch("/account", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUserData(response.data.user);
      setPreviewImage(null);
      setIsEditing(false);
      //   toast({
      //     title: 'Success',
      //     description: 'Profile updated successfully',
      //   });
    } catch (error) {
      //   toast({
      //     title: 'Error',
      //     description: 'Failed to update profile',
      //     variant: 'destructive',
      //   });
    } finally {
      setIsLoading({ ...isLoading, profile: false });
    }
  };

  const handlePasswordUpdate = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New password do not match");
      return;
    }

    setIsLoading({ ...isLoading, password: true });
    try {
      await axios.patch("/account", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsPasswordEditing(false);
      toast.success("Password updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update password");
    } finally {
      setIsLoading({ ...isLoading, password: false });
    }
  };
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    setDialogOpen(true);
    try {
      await axios.delete(`/account`);
      toast.success("Account Deleted Successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };
  return (
    <div className=" container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Account Settings</h1>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your profile details and avatar
            </CardDescription>
            <Separator />
          </CardHeader>

          <CardContent>
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative group">
                <Avatar className="h-32 w-32 border-2 border-primary/20">
                  {previewImage ? (
                    <AvatarImage
                      src={previewImage}
                      alt="Preview"
                      className="object-cover"
                    />
                  ) : (
                    <AvatarImage
                      src={userData.image}
                      alt={userData.username}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="text-4xl font-semibold text-zinc-900">
                    {userData.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label
                    htmlFor="image-upload"
                    className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-all shadow-lg"
                  >
                    <Upload className="h-5 w-5" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={userData.username}
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={userData.email}
                    onChange={(e) =>
                      setUserData({ ...userData, email: e.target.value })
                    }
                    disabled={!isEditing}
                    className="bg-background"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setPreviewImage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleProfileUpdate}
                  disabled={isLoading.profile}
                  className="gap-2"
                >
                  {isLoading.profile ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <Button onClick={() => setIsEditing(true)} className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  className="gap-2"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Profile
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              <span>Password Settings</span>
            </CardTitle>
            <CardDescription>Change your password securely</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isPasswordEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="bg-background pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          current: !showPassword.current,
                        })
                      }
                    >
                      {showPassword.current ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="bg-background pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          new: !showPassword.new,
                        })
                      }
                    >
                      {showPassword.new ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="bg-background pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowPassword({
                          ...showPassword,
                          confirm: !showPassword.confirm,
                        })
                      }
                    >
                      {showPassword.confirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Last changed: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordEditing(true)}
                >
                  Change Password
                </Button>
              </div>
            )}
          </CardContent>
          {isPasswordEditing && (
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsPasswordEditing(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePasswordUpdate}
                disabled={isLoading.password}
                className="gap-2"
              >
                {isLoading.password ? (
                  "Updating..."
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Update Password
                  </>
                )}
              </Button>
            </CardFooter>
          )}
        </Card>
        <DeleteCard
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={() => handleDelete}
          message="We’ll be sad to see you go 😢. Deleting your account is permanent. Would you like to take a break instead?"
        />
      </div>
    </div>
  );
};

export default AccountPage;
