import { FreshContext, Handlers } from "$fresh/server.ts";
import { getUserByEmail } from "../../../../db/userSchema.ts";
import { validateEmail } from "../../../../lib/validators/validateEmail.ts";

export const handler: Handlers = {
  async POST(_req: Request, ctx: FreshContext) {
    try {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, Math.floor(Math.random() * 750));
      });

      const email = ctx.state.email as string;

      validateEmail(email);

      const user = await getUserByEmail(email.toLocaleLowerCase());
      if (!user) {
        return new Response(
          JSON.stringify({ response: "ok" }),
        );
      }
      throw new Error(`${email} is already taken.`);
    } catch (err) {
      return new Response(JSON.stringify({ message: err.message }), {
        status: 409,
      });
    }
  },
};
