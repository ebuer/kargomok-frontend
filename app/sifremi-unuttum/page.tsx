"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowLeft } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordRequest } from "@/lib/schema/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ZodError } from "zod";

export default function SifremiUnuttumPage() {
    const router = useRouter();

    const [formData, setFormData] = useState<ForgotPasswordRequest>({
        email: "",
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setIsLoading(true);

        try {
            forgotPasswordSchema.parse(formData);
        } catch (error) {
            if (error instanceof ZodError) {
                setErrors(error.issues.map((issue) => issue.message));
                setIsLoading(false);
                return;
            }
        }

        // For now, just console.log
        console.log("Forgot password request for:", formData.email);

        setIsLoading(false);
        setIsSubmitted(true);
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm lg:w-96">
                    <div>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-foreground"
                            aria-label="Ana sayfa"
                        >
                            <Image
                                src="/images/logo/default.png"
                                alt="Kargomok"
                                width={40}
                                height={40}
                                className="h-10 w-auto shrink-0"
                            />
                            <span className="text-xl font-semibold">
                                Kargomok
                            </span>
                        </Link>
                        <h2 className="mt-8 text-2xl font-bold tracking-tight text-foreground">
                            Şifremi unuttum
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            E-posta adresinize şifre sıfırlama bağlantısı
                            göndereceğiz.
                        </p>
                    </div>

                    <div className="mt-10">
                        {isSubmitted ? (
                            <div className="space-y-6">
                                <div className="rounded-md border border-primary/50 bg-primary/10 px-3 py-2 text-sm text-primary">
                                    <p>
                                        Eğer bu e-posta adresi kayıtlıysa, şifre
                                        sıfırlama bağlantısı gönderildi. Lütfen
                                        e-postanızı kontrol edin.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-10 w-full"
                                    onClick={() => {
                                        setIsSubmitted(false);
                                        setFormData({ email: "" });
                                    }}
                                    aria-label="Yeni istek gönder"
                                >
                                    <Mail className="size-4" aria-hidden />
                                    Yeni istek gönder
                                </Button>
                                <Link href="/giris">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="h-10 w-full"
                                        aria-label="Giriş sayfasına dön"
                                    >
                                        <ArrowLeft className="size-4" aria-hidden />
                                        Giriş sayfasına dön
                                    </Button>
                                </Link>
                            </div>
                        ) : (
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
                                    <Label htmlFor="email" className="text-foreground">
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

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="h-10 w-full font-semibold"
                                    aria-label="Şifre sıfırlama bağlantısı gönder"
                                >
                                    {isLoading ? (
                                        "Gönderiliyor..."
                                    ) : (
                                        <>
                                            <Mail className="size-4" aria-hidden />
                                            Şifre sıfırlama bağlantısı gönder
                                        </>
                                    )}
                                </Button>

                                <div className="text-center">
                                    <Link
                                        href="/giris"
                                        className="text-sm font-semibold text-primary hover:text-primary/90 inline-flex items-center gap-1"
                                        tabIndex={0}
                                        aria-label="Giriş sayfasına dön"
                                    >
                                        <ArrowLeft className="size-4" aria-hidden />
                                        Giriş sayfasına dön
                                    </Link>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative hidden w-0 flex-1 lg:block">
                <img
                    alt="Şifre sıfırlama"
                    src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1908&q=80"
                    className="absolute inset-0 size-full object-cover"
                />
            </div>
        </div>
    );
}
