"use server";

import { revalidatePath } from "next/cache";

export async function revalidateBoardsPage() {
  // This clears the Next.js Server Cache for the boards page!
  revalidatePath("/dashboard/boards");
}
