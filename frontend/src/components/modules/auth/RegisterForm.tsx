/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
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
      setServerError(null);
      try {
        const result = (await mutateAsync(value)) as any;

        if (!result.success) {
          setServerError(result.message || "Registration failed");
          return;
        }

        // Successfully registered and auto-logged in!
        router.push("/");
      } catch (error: any) {
        setServerError(`Registration failed: ${error.message}`);
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
        {serverError && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-100">
            {serverError}
          </div>
        )}

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
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                type="text"
                placeholder="Choose a username"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={field.state.meta.errors.length ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-500 mt-1">{field.state.meta.errors[0]}</p>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                className={field.state.meta.errors.length ? "border-red-500 focus-visible:ring-red-500" : ""}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-500 mt-1">{field.state.meta.errors[0]}</p>
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
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className={`pr-10 ${field.state.meta.errors.length ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {field.state.meta.errors.length > 0 && (
                <p className="text-xs text-red-500 mt-1">{field.state.meta.errors[0]}</p>
              )}
            </div>
          )}
        </form.Field>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full h-12 mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
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
