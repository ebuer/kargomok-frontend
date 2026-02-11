import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { serverApi, UnauthorizedError } from "@/lib/api";
import type { MeResponse } from "@/lib/types/auth";
import { DashboardClient } from "@/components/DashboardClient";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    let serverUser = null;
    let serverError = null;

    try {
        // Server-side fetch example using serverApi
        const response = await serverApi<MeResponse>("/auth/me");
        if (response.success) {
            serverUser = response.data.user;
        }
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            redirect("/login");
        }
        serverError = "Kullanıcı bilgileri alınamadı";
    }

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <Link
                        href="/api/auth/signout"
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        tabIndex={0}
                        aria-label="Çıkış yap"
                    >
                        Çıkış Yap
                    </Link>
                </div>

                {/* Server Component Section */}
                <section className="mb-8 p-4 border border-gray-200 rounded">
                    <h2 className="text-lg font-semibold mb-4">
                        Server Component (SSR) - serverApi ile
                    </h2>

                    {serverError && (
                        <p className="text-red-600">{serverError}</p>
                    )}

                    {serverUser && (
                        <div className="space-y-2 text-sm">
                            <p>
                                <span className="font-medium">ID:</span> {serverUser.id}
                            </p>
                            <p>
                                <span className="font-medium">İsim:</span> {serverUser.name}
                            </p>
                            <p>
                                <span className="font-medium">Email:</span> {serverUser.email}
                            </p>
                            <p>
                                <span className="font-medium">Tip:</span> {serverUser.type}
                            </p>
                            <p>
                                <span className="font-medium">Durum:</span> {serverUser.status}
                            </p>
                        </div>
                    )}
                </section>

                {/* Client Component Section */}
                <section className="p-4 border border-gray-200 rounded">
                    <h2 className="text-lg font-semibold mb-4">
                        Client Component (CSR) - clientApi ile
                    </h2>
                    <DashboardClient />
                </section>
            </div>
        </main>
    );
}
