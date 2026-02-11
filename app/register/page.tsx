"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerRequestSchema, type RegisterRequest } from "@/lib/schema/auth";
import { register } from "@/lib/services/auth";
import { ZodError } from "zod";

export default function RegisterPage() {
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterRequest>({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setIsLoading(true);

        // Validate with Zod
        try {
            registerRequestSchema.parse(formData);
        } catch (error) {
            if (error instanceof ZodError) {
                setErrors(error.issues.map((issue) => issue.message));
                setIsLoading(false);
                return;
            }
        }

        // Register with Laravel API
        const result = await register(formData);

        if (!result.success) {
            const errorMessages = result.errors || [result.message];
            setErrors(errorMessages);
            setIsLoading(false);
            return;
        }

        // Auto sign-in after successful registration
        const signInResult = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
        });

        setIsLoading(false);

        if (signInResult?.error) {
            // Registration was successful but auto sign-in failed
            // Redirect to login page
            router.push("/login?registered=true");
            return;
        }

        if (signInResult?.ok) {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">Kayıt Ol</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.length > 0 && (
                        <div className="p-3 border border-red-300 bg-red-50 rounded text-red-700 text-sm">
                            <ul className="list-disc list-inside">
                                {errors.map((error, index) => (
                                    <li key={index}>{error}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium mb-1"
                        >
                            İsim
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Adınız Soyadınız"
                            required
                            disabled={isLoading}
                            aria-label="İsim"
                            tabIndex={0}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="ornek@email.com"
                            required
                            disabled={isLoading}
                            aria-label="Email adresi"
                            tabIndex={0}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-1"
                        >
                            Şifre
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                            aria-label="Şifre"
                            tabIndex={0}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password_confirmation"
                            className="block text-sm font-medium mb-1"
                        >
                            Şifre Onayı
                        </label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            required
                            disabled={isLoading}
                            aria-label="Şifre onayı"
                            tabIndex={0}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        tabIndex={0}
                        aria-label="Kayıt ol butonu"
                    >
                        {isLoading ? "Kayıt yapılıyor..." : "Kayıt Ol"}
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Zaten hesabınız var mı?{" "}
                    <Link
                        href="/login"
                        className="text-blue-600 hover:underline"
                        tabIndex={0}
                        aria-label="Giriş yap sayfasına git"
                    >
                        Giriş Yap
                    </Link>
                </p>
            </div>
        </main>
    );
}
