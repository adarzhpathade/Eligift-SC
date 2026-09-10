"use server";

import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth-cache";
import { db } from "@/db";
import { savedSchemes, schemes } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserAttributes, computeMatchScore } from "@/services/recommendation";

export async function getSavedSchemes() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    const saved = await db
      .select({
        scheme: schemes,
      })
      .from(savedSchemes)
      .innerJoin(schemes, eq(savedSchemes.schemeId, schemes.id))
      .where(eq(savedSchemes.userId, user.id));

    const userAttrs = await getUserAttributes(user.id);

    const data = saved.map(({ scheme }) => ({
      ...scheme,
      matchPercentage: userAttrs ? computeMatchScore(scheme, userAttrs) : undefined,
    }));

    return { success: true, data };
  } catch (error) {
    console.error("Error fetching saved schemes:", error);
    return { success: false, error: "Failed to fetch saved schemes" };
  }
}

export async function getSavedSchemeIds() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return { success: true, data: [] };
    }

    const saved = await db
      .select({ schemeId: savedSchemes.schemeId })
      .from(savedSchemes)
      .where(eq(savedSchemes.userId, user.id));

    return { success: true, data: saved.map((s) => s.schemeId) };
  } catch (error) {
    console.error("Error fetching saved scheme IDs:", error);
    return { success: false, error: "Failed to fetch saved scheme IDs" };
  }
}

export async function toggleSaveScheme(schemeId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Check if already saved
    const existing = await db
      .select()
      .from(savedSchemes)
      .where(and(eq(savedSchemes.userId, user.id), eq(savedSchemes.schemeId, schemeId)))
      .limit(1);

    if (existing.length > 0) {
      // Unsave
      await db
        .delete(savedSchemes)
        .where(and(eq(savedSchemes.userId, user.id), eq(savedSchemes.schemeId, schemeId)));
    } else {
      // Save
      await db.insert(savedSchemes).values({
        userId: user.id,
        schemeId: schemeId,
      });
    }

    revalidatePath('/dashboard');
    revalidatePath('/schemes');
    
    return { success: true, isSaved: existing.length === 0 };
  } catch (error) {
    console.error("Error toggling saved scheme:", error);
    return { success: false, error: "Failed to toggle saved scheme" };
  }
}
