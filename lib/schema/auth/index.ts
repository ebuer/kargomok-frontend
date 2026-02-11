import { z } from "zod";

export const loginRequestSchema = z.object({
    email: z.string().email("Geçerli bir email adresi giriniz"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const registerRequestSchema = z
    .object({
        name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
        email: z.string().email("Geçerli bir email adresi giriniz"),
        password: z.string().min(8, "Şifre en az 8 karakter olmalıdır"),
        password_confirmation: z.string().min(8, "Şifre onayı en az 8 karakter olmalıdır"),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Şifreler eşleşmiyor",
        path: ["password_confirmation"],
    });

export type RegisterRequest = z.infer<typeof registerRequestSchema>;