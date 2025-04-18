import { supabase } from "@/lib/supabase";

export async function findUser(session: any) {
    if (!session?.user?.email) return null;

    const { data, error } = await supabase
        .from("users")
        .select()
        .eq("email", session.user.email)
        .single();

    return data;
}
