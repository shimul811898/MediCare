"use client";

import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(false);
    const toastId = toast.loading("Creating your account...");
    try {
      setLoading(true);
      const res = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.photo,
        callbackURL: "/dashboard",
      });

      if (res?.error) {
        toast.error(res.error.message || "Registration failed.", { id: toastId });
      } else {
        toast.success("Account created successfully!", { id: toastId });
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast.error(error.message || "An unexpected error occurred.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const toastId = toast.loading("Connecting with Google...");
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      toast.dismiss(toastId);
    } catch (error) {
      toast.error(error.message || "Failed to log in with Google", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full"></div>

      <div className="relative z-10 w-full max-w-md my-auto">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white">
              Doc<span className="text-teal-400">Appoint</span>
            </h1>
            <p className="text-slate-300 mt-2">Create your healthcare account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="text-sm text-slate-300">Full Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Enter your full name"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-teal-400"
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-300">Email Address</label>
              <input
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                    message: "Invalid email address"
                  }
                })}
                type="email"
                placeholder="Enter your email"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-teal-400"
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-300">Photo URL</label>
              <input
                {...register("photo", { required: "Photo URL is required" })}
                type="text"
                placeholder="Type your photo URL"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-teal-400"
              />
              {errors.photo && <p className="text-sm text-red-500 mt-1">{errors.photo.message}</p>}
            </div>

            <div>
              <label className="text-sm text-slate-300">Password</label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" }
                })}
                type="password"
                placeholder="Create password"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-teal-400"
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-slate-400 text-sm">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-slate-800 font-semibold hover:bg-slate-100 transition cursor-pointer"
          >
            <FaGoogle className="text-red-500" />
            Continue with Google
          </button>

          <p className="text-center text-slate-300 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-teal-400 font-semibold hover:text-teal-300 transition"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}