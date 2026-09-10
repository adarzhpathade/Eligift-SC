"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export type MobileAuthResult = {
  error?: string;
  success?: boolean;
  step: "PHONE" | "OTP";
  phone?: string;
};

export async function mobileAuthAction(
  prevState: MobileAuthResult,
  formData: FormData
): Promise<MobileAuthResult> {
  const step = formData.get("step") as string;
  const phone = formData.get("phone") as string;
  
  // STEP 1: SEND OTP
  if (step === "PHONE") {
    if (!phone || phone.length < 10) {
      return { step: "PHONE", error: "Please enter a valid 10-digit mobile number." };
    }
    
    // In a real app, we would call supabase.auth.signInWithOtp({ phone }) here.
    // For the hackathon/demo, we bypass sending an actual SMS.
    
    return { step: "OTP", phone, success: true };
  }
  
  // STEP 2: VERIFY OTP
  if (step === "OTP") {
    const otp = formData.get("otp") as string;
    
    if (!otp || otp.length < 6) {
      return { step: "OTP", phone, error: "Please enter the 6-digit OTP." };
    }
    
    // DEMO BYPASS: Accept 123456 as the universal OTP
    if (otp === "123456") {
      const cookieStore = await cookies();
      cookieStore.set("dev_mock_auth", phone, { path: "/" });
      redirect("/onboarding");
    }

    // Real Supabase verification (fallback if needed later)
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms'
    });
    
    if (error) {
      return { step: "OTP", phone, error: "Invalid OTP or OTP expired." };
    }
    redirect("/onboarding");
    
    return { step: "OTP", phone, error: "Invalid OTP." };
  }

  // Fallback
  return { step: "PHONE" };
}

export async function signOutAction() {
  const cookieStore = await cookies();
  if (cookieStore.get("dev_mock_auth")) {
    cookieStore.delete("dev_mock_auth");
  }
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
