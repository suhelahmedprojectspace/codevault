"use client";
import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import toast from "react-hot-toast";
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      setMessage("Password or Confirm Password is missig");
      return;
    }
    if (!token) {
      setMessage("Invalid or missing token");
      return;
    }
    if (password !== confirm) {
      setMessage("Password doesn't match.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Password reset successful! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };
  const handleClose = (e: React.MouseEvent) => {
    setMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-[500px]   mx-auto  border shadow p-6 rounded h-full ">
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className=" text-sm mb-1 font-semibold">Reset Your Password</h1>
            <input
              type="password"
              name="password"
              placeholder="Enter your new passsword"
              className="w-full border px-3 py-2 rounded"
              onChange={(e) => {
                setPassword(e.target.value);
                setMessage("");
              }}
            />
          </div>
          <div>
            <h1 className="text-sm font-semibold mb-1">
              Confirm Your Password
            </h1>
            <input
              type="password"
              name="password"
              placeholder="Enter your new passsword"
              className="w-full rounded "
              onChange={(e) => {
                setConfirm(e.target.value);
                setMessage("");
              }}
            />
          </div>

          <div className="mt-2 w-full flex justify-center">
            <Button
              variant="default"
              className="w-[200px] p-4"
              onClick={handleReset}
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
