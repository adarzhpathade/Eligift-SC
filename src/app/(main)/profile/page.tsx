import React from 'react';
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProfileForm from "@/components/profile/ProfileForm";

export const metadata = {
  title: 'Profile Management | Eligify',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const existingProfile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, user.id));

  const profileData = existingProfile.length > 0 ? existingProfile[0] : {};

  return (
    <div className="py-12 max-w-4xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-[32px] font-bold text-[var(--color-eg-text-primary)] mb-2">Profile Management</h1>
        <p className="text-base text-[var(--color-eg-text-secondary)]">
          Update your civic profile to ensure you receive the most accurate scheme recommendations.
        </p>
      </div>

      <ProfileForm initialData={profileData} />
    </div>
  );
}
