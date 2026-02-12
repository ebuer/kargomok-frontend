"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LogIn } from "lucide-react";
import { loginRequestSchema, type LoginRequest } from "@/lib/schema/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ZodError } from "zod";

const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

    const [formData, setFormData] = useState<LoginRequest>({
        email: "",
        password: "",
    });
    const [rememberMe, setRememberMe] = useState(false);
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
            loginRequestSchema.parse(formData);
        } catch (error) {
            if (error instanceof ZodError) {
                setErrors(error.issues.map((issue) => issue.message));
                setIsLoading(false);
                return;
            }
        }

        const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
        });

        setIsLoading(false);

        if (result?.error) {
            setErrors([result.error]);
            return;
        }

        if (result?.ok) {
            router.push(callbackUrl);
            router.refresh();
        }
    };

    return (
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
                </Link>
                <h2 className="mt-8 text-2xl font-bold tracking-tight text-foreground">
                    Hesabınıza giriş yapın
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Üye değil misiniz?{" "}
                    <Link
                        href="/kayit"
                        className="font-semibold text-primary hover:text-primary/90"
                        tabIndex={0}
                        aria-label="Kayıt ol sayfasına git"
                    >
                        Kayıt olun
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

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-foreground">
                                Şifre
                            </Label>
                            <Link
                                href="/sifremi-unuttum"
                                className="text-sm font-semibold text-primary hover:text-primary/90"
                                tabIndex={0}
                                aria-label="Şifremi unuttum"
                            >
                                Şifremi unuttum
                            </Link>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
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

                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="remember-me"
                            checked={rememberMe}
                            onCheckedChange={(checked) =>
                                setRememberMe(checked === true)
                            }
                            disabled={isLoading}
                            aria-label="Beni hatırla"
                        />
                        <Label
                            htmlFor="remember-me"
                            className="cursor-pointer text-sm font-normal text-foreground"
                        >
                            Beni hatırla
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="h-10 w-full font-semibold"
                        aria-label="Giriş yap butonu"
                    >
                        {isLoading ? (
                            "Giriş yapılıyor..."
                        ) : (
                            <>
                                <LogIn className="size-4" aria-hidden />
                                Giriş yap
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-10">
                    <div className="relative">
                        <div
                            aria-hidden
                            className="absolute inset-0 flex items-center"
                        >
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm font-medium">
                            <span className="bg-background px-6 text-muted-foreground">
                                Veya şununla devam et
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-10 w-full font-semibold shadow-xs"
                            onClick={() => alert("coming soon")}
                            aria-label="Google ile giriş yap (yakında)"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden
                                className="size-5"
                            >
                                <path
                                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                                    fill="#EA4335"
                                />
                                <path
                                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                                    fill="#34A853"
                                />
                            </svg>
                            Google
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function GirisPage() {
    return (
        <div className="flex min-h-screen">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <Suspense
                    fallback={
                        <div className="mx-auto w-full max-w-sm text-center text-muted-foreground">
                            Yükleniyor...
                        </div>
                    }
                >
                    <LoginForm />
                </Suspense>
            </div>
            <div className="relative hidden w-0 flex-1 lg:block">
                <img
                    alt="Paket entegrasyonu ve kargo takip"
                    src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    className="absolute inset-0 size-full object-cover"
                />
            </div>
        </div>
    );
}
