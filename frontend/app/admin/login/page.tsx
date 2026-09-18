import { redirect } from "next/navigation";

/** Old public login path — hide it. Use /admin/login/<secret> instead. */
export default function OldAdminLoginPage() {
  redirect("/");
}
