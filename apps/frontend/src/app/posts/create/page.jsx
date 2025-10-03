import { redirect } from "next/navigation";
import { getUser } from "@/app/lib/dal/user";
import CreatePostForm from "./_components/CreatePostForm";

export const dynamic = "force-dynamic";

export default async function CreatePostPage() {
    const user = await getUser();

    if (!user) {
        redirect("/login");
    }

    return <CreatePostForm user={user} />;
}
