import { Handlers, PageProps } from "$fresh/server.ts";
import { getPasskeysByUserId, Passkey } from "../../db/passkeySchema.ts";
import { SanitizedUser, User } from "../../db/userSchema.ts";
import RegisterPasskey from "../../islands/RegisterPasskey.tsx";
import { PasskeyEditDelete } from "../../islands/PasskeyEditDelete.tsx";
import { getAESKey } from "../../lib/getKey.ts";
import { createTimeBasedKey } from "../../lib/timeBasedKey.ts";
// import UpdateEmailForm from "../../islands/UpdateEmailForm.tsx";
import UpdateHandleForm from "../../islands/UpdateHandleForm.tsx";
import UpdatePasswordForm from "../../islands/UpdatePasswordForm.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const rawUser = ctx.state.rawUser as User;
    const user = ctx.state.user as SanitizedUser;

    const passkeys = await getPasskeysByUserId(rawUser.id);

    const key = await getAESKey();
    const timeBasedKey = await createTimeBasedKey(key, 300);

    return ctx.render({ user, passkeys, timeBasedKey });
  },
};

interface Props {
  user: SanitizedUser;
  passkeys: Passkey[];
  timeBasedKey: string;
}

export default function Home(props: PageProps<Props>) {
  const { user, passkeys /*, timeBasedKey */ } = props.data;

  return (
    <div class="h-screen">
      <h1 class="text-2xl p-8 col-span-2">Account</h1>
      <div class="flex gap-4">
        <div class="shadow-md rounded px-8 py-6">
          <h2 class="text-lg">Passkeys</h2>
          <ul class="flex flex-col gap-2 p-2">
            {passkeys.map((k, i) => (
              <PasskeyEditDelete key={i} id={k.id} nickname={k.nickname} />
            ))}
          </ul>
          <div class="mt-4 flex justify-center">
            <RegisterPasskey />
          </div>
        </div>
        <div class="shadow-md rounded px-8 py-6">
          <h2 class="text-lg">Change Password</h2>
          <UpdatePasswordForm />
        </div>
        {
          /* <div class="shadow-md rounded px-8 py-6">
          <h2 class="text-lg">Change Email</h2>
          <UpdateEmailForm user={user} timeBasedKey={timeBasedKey} />
        </div> */
        }
        <div class="shadow-md rounded px-8 py-6">
          <h2 class="text-lg">Change Handle</h2>
          <UpdateHandleForm user={user} />
        </div>
      </div>
    </div>
  );
}
