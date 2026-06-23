"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading("Creating your account...");
    
    try {
      const res = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        image: data.photo,
        role: data.email === "shimul811898@gmail.com" ? "admin" : data.role,
        callbackURL: "/dashboard",
      });

      if (res?.error) {
        toast.error("Registration failed.", { id: toastId });
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
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    toast.dismiss(toastId);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12 relative overflow-hidden">
     
      <div className="absolute top-20 left-20 w-72 h-72 bg-teal-500/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-cyan-500/20 blur-[120px] rounded-full" />

      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black text-white">
              Doc<span className="text-teal-400">Appoint</span>
            </h1>
            <p className="text-slate-300 mt-2">Create your healthcare account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
         
            <div>
              <label className="text-sm text-slate-300 ml-1">Full Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                placeholder="Enter your full name"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-teal-400 transition"
              />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>}
            </div>

          
            <div>
              <label className="text-sm text-slate-300 block mb-2 ml-1">Register As</label>
              <div className="grid grid-cols-2 gap-4">
                {["patient", "doctor"].map((role) => (
                  <label key={role} className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-white/10 bg-white/5 text-white cursor-pointer hover:border-teal-400 transition select-none">
                    <input
                      type="radio"
                      value={role}
                      defaultChecked={role === "patient"}
                      {...register("role")}
                      className="accent-teal-500 w-4 h-4 cursor-pointer"
                    />
                    <span className="font-medium capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>

        
            <div>
              <label className="text-sm text-slate-300 ml-1">Email Address</label>
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Enter your email"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-teal-400 transition"
              />
              {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
            </div>

       
            <div>
              <label className="text-sm text-slate-300 ml-1">Photo URL</label>
              <input
                {...register("photo", { required: "Photo URL is required" })}
                type="text"
                placeholder="Enter image URL"
                className="w-full mt-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-teal-400 transition"
              />
              {errors.photo && <p className="text-xs text-red-400 mt-1">{errors.photo.message}</p>}
            </div>

           
            <div>
              <label className="text-sm text-slate-300 ml-1">Password</label>
              <div className="relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" }
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  className="w-full mt-2 px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white outline-none focus:border-teal-400 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-[57%] -translate-y-1/2 text-slate-400 hover:text-white transition"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 rounded-xl bg-teal-500 text-white font-bold hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-slate-400 text-xs">OR</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button 
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl bg-white text-slate-800 font-semibold hover:bg-slate-50 transition"
          >
            <FaGoogle className="text-red-500" />
            Continue with Google
          </button>

          <p className="text-center text-slate-300 mt-6 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-400 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}