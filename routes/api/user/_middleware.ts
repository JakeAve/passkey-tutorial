import { FreshContext } from "$fresh/server.ts";
import { getUserByEmail, SanitizedUser, User } from "../../../db/userSchema.ts";
import { validateAuthHeaders } from "../../../lib/authentication.ts";

export async function handler(
  req: Request,
  ctx: FreshContext,
) {
  try {
    const { sub: email } = await validateAuthHeaders(req);
    const rawUser = await getUserByEmail(email) as Partial<User>;

    ctx.state.rawUser = { ...rawUser };

    delete rawUser.id;
    delete rawUser.password;

    const user = { ...rawUser } as SanitizedUser;

    ctx.state.user = user;

    return ctx.next();
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ message: "Access Denied." }),
      { status: 401 },
    );
  }
}
