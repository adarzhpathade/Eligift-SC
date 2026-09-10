import { redirect } from "next/navigation";

export default function RegisterPage() {
  // Mobile OTP is a unified auth flow (login/register are the same).
  redirect("/login");
}
