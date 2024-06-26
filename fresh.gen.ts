// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_500 from "./routes/_500.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $api_email_availability_middleware from "./routes/api/email-availability/_middleware.ts";
import * as $api_email_availability_index from "./routes/api/email-availability/index.ts";
import * as $api_handle_availability from "./routes/api/handle-availability.ts";
import * as $api_joke from "./routes/api/joke.ts";
import * as $api_password_strength from "./routes/api/password-strength.ts";
import * as $greet_name_ from "./routes/greet/[name].tsx";
import * as $index from "./routes/index.tsx";
import * as $login_index from "./routes/login/index.tsx";
import * as $signup_index from "./routes/signup/index.tsx";
import * as $Counter from "./islands/Counter.tsx";
import * as $HandleInput from "./islands/HandleInput.tsx";
import * as $PasswordInput from "./islands/PasswordInput.tsx";
import * as $PasswordPairInputs from "./islands/PasswordPairInputs.tsx";
import * as $PasswordStrengthIndicator from "./islands/PasswordStrengthIndicator.tsx";
import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_500.tsx": $_500,
    "./routes/_app.tsx": $_app,
    "./routes/api/email-availability/_middleware.ts":
      $api_email_availability_middleware,
    "./routes/api/email-availability/index.ts": $api_email_availability_index,
    "./routes/api/handle-availability.ts": $api_handle_availability,
    "./routes/api/joke.ts": $api_joke,
    "./routes/api/password-strength.ts": $api_password_strength,
    "./routes/greet/[name].tsx": $greet_name_,
    "./routes/index.tsx": $index,
    "./routes/login/index.tsx": $login_index,
    "./routes/signup/index.tsx": $signup_index,
  },
  islands: {
    "./islands/Counter.tsx": $Counter,
    "./islands/HandleInput.tsx": $HandleInput,
    "./islands/PasswordInput.tsx": $PasswordInput,
    "./islands/PasswordPairInputs.tsx": $PasswordPairInputs,
    "./islands/PasswordStrengthIndicator.tsx": $PasswordStrengthIndicator,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
