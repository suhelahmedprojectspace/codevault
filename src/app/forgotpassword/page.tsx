"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import axios from "@/lib/axios";
import toast from "react-hot-toast";

const ForgotPasswordPage = () => {
  const searchParams = useSearchParams();
  const defaultEmail = searchParams.get("email") || "";
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    setLoading(true);

    try {
      const res = await axios.post("/forgotpassword", {
        email: email,
      });
      const data = await res.data;

      if (res.status == 201) {
        toast.success(data.message || "Password reset email sent!");
      } else {
        toast.error(data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error("Failed to send reset link. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 md:p-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            Forgot Password?
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Enter your email and we’ll send you a reset link.
          </p>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="username@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
