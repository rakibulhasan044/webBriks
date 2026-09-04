"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function GetStartedButton() {
  const router = useRouter();

  return (
    <Button
      size="lg"
      onClick={() => router.push("/login")}
      className="group rounded-full px-8 py-6 text-lg font-medium transition-all hover:scale-105 hover:shadow-lg"
    >
      Start Organizing Now
      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
    </Button>
  );
}
