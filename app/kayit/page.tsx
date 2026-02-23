"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { registerRequestSchema, type RegisterRequest } from "@/lib/schema/auth";
import { register } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ZodError } from "zod";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";

export default function KayitPage() {
    const router = useRouter();

    const [formData, setFormData] = useState<RegisterRequest>({
        name: "",
        surname: "",
        email: "",
        phone: "",
        password: "",
        password_confirmation: "",
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);

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
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-screen">
            <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-[450px] lg:w-[450px]">
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

                            <div className="grid lg:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-foreground">
                                        İsim
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="given-name"
                                        placeholder="Adınız"
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
                                        htmlFor="surname"
                                        className="text-foreground"
                                    >
                                        Soyisim
                                    </Label>
                                    <Input
                                        id="surname"
                                        name="surname"
                                        type="text"
                                        autoComplete="family-name"
                                        placeholder="Soyadınız"
                                        value={formData.surname}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        aria-invalid={errors.length > 0}
                                        aria-label="Soyisim"
                                        className="h-10"
                                    />
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-4">
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
                                        htmlFor="phone"
                                        className="text-foreground"
                                    >
                                        Telefon
                                    </Label>
                                    <PhoneInput
                                        defaultCountry="tr"
                                        value={formData.phone}
                                        onChange={(phone) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                phone,
                                            }))
                                        }
                                        className="w-full [&_.react-international-phone-input-container]:flex [&_.react-international-phone-country-selector-button]:h-10 [&_.react-international-phone-country-selector-button]:rounded-l-md [&_.react-international-phone-country-selector-button]:border [&_.react-international-phone-country-selector-button]:border-input [&_.react-international-phone-country-selector-button]:bg-transparent"
                                        inputClassName={cn(
                                            "h-10 w-full min-w-0 rounded-r-md border border-input border-l-0 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm",
                                            "focus:border-ring focus:ring-ring/50 focus:ring-[3px] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                                            "placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
                                            errors.length > 0 &&
                                                "border-destructive ring-destructive/20 focus-visible:ring-destructive/20"
                                        )}
                                        inputProps={{
                                            id: "phone",
                                            name: "phone",
                                            "aria-label": "Telefon",
                                            "aria-invalid": errors.length > 0,
                                            required: true,
                                            disabled: isLoading,
                                            autoComplete: "tel",
                                            placeholder: "5XX XXX XX XX",
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-foreground"
                                >
                                    Şifre
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                    En az 8 karakter, bir büyük harf, bir küçük
                                    harf ve bir sembol içermelidir.
                                </p>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        placeholder={"Şifrenizi giriniz"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        aria-invalid={errors.length > 0}
                                        aria-label="Şifre"
                                        className="h-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                        disabled={isLoading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
                                        aria-label={
                                            showPassword
                                                ? "Şifreyi gizle"
                                                : "Şifreyi göster"
                                        }
                                        tabIndex={0}
                                    >
                                        {showPassword ? (
                                            <EyeOff
                                                className="size-4"
                                                aria-hidden
                                            />
                                        ) : (
                                            <Eye
                                                className="size-4"
                                                aria-hidden
                                            />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-foreground"
                                >
                                    Şifre onayı
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type={
                                            showPasswordConfirmation
                                                ? "text"
                                                : "password"
                                        }
                                        autoComplete="new-password"
                                        placeholder={"Şifreniz onayı"}
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                        required
                                        disabled={isLoading}
                                        aria-invalid={errors.length > 0}
                                        aria-label="Şifre onayı"
                                        className="h-10 pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPasswordConfirmation(
                                                (prev) => !prev
                                            )
                                        }
                                        disabled={isLoading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none"
                                        aria-label={
                                            showPasswordConfirmation
                                                ? "Şifreyi gizle"
                                                : "Şifreyi göster"
                                        }
                                        tabIndex={0}
                                    >
                                        {showPasswordConfirmation ? (
                                            <EyeOff
                                                className="size-4"
                                                aria-hidden
                                            />
                                        ) : (
                                            <Eye
                                                className="size-4"
                                                aria-hidden
                                            />
                                        )}
                                    </button>
                                </div>
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
