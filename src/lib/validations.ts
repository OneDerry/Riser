
import z from "zod";

export class Validators {
  static get Login() {
    return z.object({
      email: z.string().email(),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
    });
  }

  static get SignUp() {
    return z.object({
      email: z.string().email(),
      password: z.string().min(8, {
        message: "Password must be at least 8 characters.",
      }),
    });
  }
}
