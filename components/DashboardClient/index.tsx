"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getMe } from "@/lib/services/auth";
import type { ApiUser } from "@/lib/types/auth";

export const DashboardClient = () => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<ApiUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (status !== "authenticated") {
                return;
            }

            setIsLoading(true);
            setError(null);

            const userData = await getMe();

            if (userData) {
                setUser(userData);
            } else {
                setError("Kullanıcı bilgileri alınamadı");
            }

            setIsLoading(false);
        };

        fetchUser();
    }, [status]);

    if (status === "loading" || isLoading) {
        return <p className="text-gray-500">Yükleniyor...</p>;
    }

    if (!session) {
        return <p className="text-gray-500">Oturum bulunamadı</p>;
    }

    if (error) {
        return <p className="text-red-600">{error}</p>;
    }

    if (!user) {
        return <p className="text-gray-500">Kullanıcı bilgisi yok</p>;
    }

    return (
        <div className="space-y-2 text-sm">
            <p>
                <span className="font-medium">ID:</span> {user.id}
            </p>
            <p>
                <span className="font-medium">İsim:</span> {user.name}
            </p>
            <p>
                <span className="font-medium">Email:</span> {user.email}
            </p>
            <p>
                <span className="font-medium">Telefon:</span> {user.phone || "Belirtilmemiş"}
            </p>
            <p>
                <span className="font-medium">Tip:</span> {user.type}
            </p>
            <p>
                <span className="font-medium">Durum:</span> {user.status}
            </p>
            <p>
                <span className="font-medium">Oluşturulma:</span>{" "}
                {new Date(user.created_at).toLocaleDateString("tr-TR")}
            </p>
        </div>
    );
};
