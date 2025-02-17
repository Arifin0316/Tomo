import { z } from 'zod';
import { getUsername } from '@/lib/home';

export const registerSchema = z.object({
  username: z.string()
    .min(3, 'Username minimal 3 karakter')
    .max(20, 'Username maksimal 20 karakter')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh mengandung huruf, angka, dan underscore')
    .refine(async (username) => {
      const isAvailable = await getUsername(username);
      return isAvailable;
    }, 'Username sudah digunakan'),
  email: z.string().email('Email tidak valid'),
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Password harus mengandung setidaknya 1 huruf besar')
    .regex(/[0-9]/, 'Password harus mengandung setidaknya 1 angka'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password tidak cocok",
  path: ["confirmPassword"]
});
