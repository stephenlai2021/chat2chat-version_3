/* next */
import { redirect } from "next/navigation";

/* supabase */
import getUserSession from "@/lib/supabase/getUserSession";
import createSupabaseServerClient from "@/lib/supabase/server";

/* components */
import Main from "@/temp/(dashbboard)/Main";

export default async function DashoardPage() {
  const {
    data: { session },
  } = await getUserSession();

  if (!session) redirect("/login");
  console.log('user credential: | dashboard server: ', session.user)
  const userCred = session.user

  return <Main userCred={userCred} />;
}
