"use client";

import { motion } from "framer-motion";
import { AuthCard } from "./auth-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { RegisterFormData, registerValidationSchema } from "@/zod/auth.validation";
import { registerAction } from "@/app/(auth)/register/_action";
import { useForm } from "@tanstack/react-form";
import { Eye, EyeOff, Loader2,Lock,Mail, User } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: RegisterFormData) => registerAction(payload),
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const result = (await mutateAsync(value)) as any;

        if (!result.success) {
          toast.error(result.message || "Registration failed");
          return;
        }

        toast.success(result.message || "Account created successfully!");
        // Successfully registered and auto-logged in!
        router.push("/dashboard");
      } catch (error: any) {
        toast.error(`Registration failed: ${error.message}`);
      }
    },
  });

  return (
<AuthCard title="Create an account" type="register">
  <motion.form
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2, duration: 0.4 }}
    className="space-y-6"
    method="POST"
    action="#"
    noValidate
    onSubmit={(e) => {
      e.preventDefault();
      e.stopPropagation();
      form.handleSubmit();
    }}
  >
    {/* kanban-style accent dots */}
    <div className="flex justify-center gap-2 mb-2">
      <span className="h-2 w-2 rounded-full bg-rose-400" />
      <span className="h-2 w-2 rounded-full bg-amber-400" />
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
      <span className="h-2 w-2 rounded-full bg-sky-400" />
    </div>

    <form.Field
      name="name"
      validators={{
        onSubmit: ({ value }) => {
          const res = registerValidationSchema.shape.name.safeParse(value);
          return res.success ? undefined : res.error.issues[0].message;
        },
      }}
    >
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor="name" className="text-slate-700 font-medium">
            Username
          </Label>
          <div className="relative">
            <User
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"
            />
            <Input
              id="name"
              type="text"
              placeholder="Choose a username"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className={`pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/60 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 ${
                field.state.meta.errors.length
                  ? "border-rose-400 focus-visible:ring-rose-400"
                  : ""
              }`}
            />
          </div>
          {field.state.meta.errors.length > 0 && (
            <p className="text-xs text-rose-500 mt-1">{field.state.meta.errors[0]}</p>
          )}
        </div>
      )}
    </form.Field>

    <form.Field
      name="email"
      validators={{
        onSubmit: ({ value }) => {
          const res = registerValidationSchema.shape.email.safeParse(value);
          return res.success ? undefined : res.error.issues[0].message;
        },
      }}
    >
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700 font-medium">
            Email
          </Label>
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"
            />
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className={`pl-10 h-12 rounded-xl border-slate-200 bg-slate-50/60 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 ${
                field.state.meta.errors.length
                  ? "border-rose-400 focus-visible:ring-rose-400"
                  : ""
              }`}
            />
          </div>
          {field.state.meta.errors.length > 0 && (
            <p className="text-xs text-rose-500 mt-1">{field.state.meta.errors[0]}</p>
          )}
        </div>
      )}
    </form.Field>

    <form.Field
      name="password"
      validators={{
        onSubmit: ({ value }) => {
          const res = registerValidationSchema.shape.password.safeParse(value);
          return res.success ? undefined : res.error.issues[0].message;
        },
      }}
    >
      {(field) => (
        <div className="space-y-2">
          <Label htmlFor="password" className="text-slate-700 font-medium">
            Password
          </Label>
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none"
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              className={`pl-10 pr-10 h-12 rounded-xl border-slate-200 bg-slate-50/60 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:border-indigo-400 ${
                field.state.meta.errors.length
                  ? "border-rose-400 focus-visible:ring-rose-400"
                  : ""
              }`}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {field.state.meta.errors.length > 0 && (
            <p className="text-xs text-rose-500 mt-1">{field.state.meta.errors[0]}</p>
          )}
        </div>
      )}
    </form.Field>

    <Button
      type="submit"
      disabled={isPending}
      className="w-full h-12 mt-4 rounded-xl text-white font-medium shadow-md shadow-indigo-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed "
    >
      {isPending ? (
        <span className="flex items-center gap-2">
          <Loader2 className="animate-spin" size={18} /> Creating account...
        </span>
      ) : (
        "Create account"
      )}
    </Button>
  </motion.form>
</AuthCard>
  );
}
