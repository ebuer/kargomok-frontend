"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UserPlus } from "lucide-react";
import { registerRequestSchema, type RegisterRequest } from "@/lib/schema/auth";
import { register } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ZodError } from "zod";

export default function KayitPage() {
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

        try {
            registerRequestSchema.parse(formData);
        } catch (error) {
            if (error instanceof ZodError) {
                setErrors(error.issues.map((issue) => issue.message));
                setIsLoading(false);
                return;
            }
        }

        const result = await register(formData);

        if (!result.success) {
            const errorMessages = result.errors ?? [result.message];
            setErrors(errorMessages);
            setIsLoading(false);
            return;
        }

        const signInResult = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
        });

        setIsLoading(false);

        if (signInResult?.error) {
            router.push("/giris?registered=true");
            return;
        }

        if (signInResult?.ok) {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <Link
                            href="/"
                            className="flex items-center gap-2"
                            aria-label="Ana sayfa"
                        >
                            <Image
                                src="/images/logo/default.png"
                                alt="Kargomok"
                                width={40}
                                height={40}
                                className="h-10 w-auto shrink-0"
                            />
                        </Link>
                        <h2 className="mt-8 text-2xl font-bold tracking-tight text-foreground">
                            Hesap oluşturun
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Zaten hesabınız var mı?{" "}
                            <Link
                                href="/giris"
                                className="font-semibold text-primary hover:text-primary/90"
                                tabIndex={0}
                                aria-label="Giriş yap sayfasına git"
                            >
                                Giriş yapın
                            </Link>
                        </p>
                    </div>

                    <div className="mt-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errors.length > 0 && (
                                <div
                                    className="rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                                    role="alert"
                                >
                                    <ul className="list-disc list-inside space-y-0.5">
                                        {errors.map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-foreground">
                                    İsim
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    placeholder="Adınız Soyadınız"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    aria-invalid={errors.length > 0}
                                    aria-label="İsim"
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-foreground"
                                >
                                    E-posta adresi
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="ornek@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    aria-invalid={errors.length > 0}
                                    aria-label="E-posta adresi"
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-foreground"
                                >
                                    Şifre
                                </Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    aria-invalid={errors.length > 0}
                                    aria-label="Şifre"
                                    className="h-10"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-foreground"
                                >
                                    Şifre onayı
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="••••••••"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    aria-invalid={errors.length > 0}
                                    aria-label="Şifre onayı"
                                    className="h-10"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="h-10 w-full font-semibold"
                                aria-label="Kayıt ol butonu"
                            >
                                {isLoading ? (
                                    "Kayıt yapılıyor..."
                                ) : (
                                    <>
                                        <UserPlus className="size-4" aria-hidden />
                                        Kayıt ol
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="relative hidden w-0 flex-1 lg:block">
                <img
                    alt=""
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1908&q=80"
                    className="absolute inset-0 size-full object-cover"
                />
            </div>
        </div>
    );
}
