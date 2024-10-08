import { Handlers } from "$fresh/server.ts";
import { AuthenticationError } from "../../../Errors/AuthenticationError.ts";
import { getUserByEmail } from "$kv/userSchema.ts";
import { authenticate, makeAuthHeaders } from "../../../lib/authentication.ts";
import { verifyJwt } from "../../../lib/jwt.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    let email = "";
    let password = "";
    let loginToken = "";
    try {
      const isForm = req.headers.get("Content-Type")?.toLowerCase() ===
        "application/x-www-form-urlencoded";

      if (isForm) {
        const form = await req.formData();

        email = form.get("email")?.toString() as string;
        password = form.get("password")?.toString() as string;
        loginToken = form.get("login-token")?.toString() as string;
      } else {
        const json = await req.json();
        email = json.email;
        password = json.password;
      }

      if (loginToken) {
        try {
          const { sub } = await verifyJwt(loginToken);
          email = sub;
        } catch {
          // doesn't matter
        }
      }

      if ((!email || !password) && !loginToken) {
        throw new AuthenticationError(email);
      }

      const user = loginToken
        ? await getUserByEmail(email)
        : await authenticate(email, password);

      if (!user) {
        throw new AuthenticationError(email);
      }

      const { headers, accessToken, refreshToken } = await makeAuthHeaders(
        req,
        new Headers(),
        user.email,
        {
          updateRefreshToken: true,
          refreshTokenVersion: user.refreshTokenVersion || 1,
        },
      );

      return new Response(
        JSON.stringify({ response: "ok", email, accessToken, refreshToken }),
        {
          headers,
        },
      );
    } catch (err) {
      console.error(err);
      return new Response(
        JSON.stringify({ message: err.message, email }),
        {
          status: 401,
        },
      );
    }
  },
};
