
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EditLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const isAuthenticated = await getSession();

    if (!isAuthenticated) {
        redirect("/");
    }

    return <div>{children}</div>;
}
