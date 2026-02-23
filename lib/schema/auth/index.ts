import { z } from "zod";

export const loginRequestSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

const hasUppercase = (s: string) => /[A-Z]/.test(s);
const hasLowercase = (s: string) => /[a-z]/.test(s);
const hasSymbol = (s: string) => /[^A-Za-z0-9]/.test(s);

export const registerRequestSchema = z
    .object({
        name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
        surname: z.string().min(2, "Soyisim en az 2 karakter olmalıdır"),
        email: z.string().email("Geçerli bir email adresi giriniz"),
        phone: z.string().min(1, "Telefon numarası gereklidir"),
        password: z
            .string()
            .min(8, "Şifre en az 8 karakter olmalıdır")
            .refine(hasUppercase, "Şifre en az bir büyük harf içermelidir")
            .refine(hasLowercase, "Şifre en az bir küçük harf içermelidir")
            .refine(hasSymbol, "Şifre en az bir sembol içermelidir"),
        password_confirmation: z.string().min(1, "Şifre onayı gereklidir"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Şifreler eşleşmiyor",
        path: ["password_confirmation"],
    });

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const forgotPasswordSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;