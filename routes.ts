export default {
  "index": "/",
  "greet": {
    name: (name: string) => `/greet/${name}`,
  },
  "signup": {
    "index": "/signup",
  },
  "verify-email": {
    "index": "/verify-email",
  },
  "forgot-password": {
    "index": "/forgot-password",
  },
  "verify-password-reset": {
    "index": "/verify-password-reset",
  },
  "api": {
    "validate": {
      "password": "/api/validate/password",
      "name": "/api/validate/name",
      "handle": "/api/validate/handle",
      "email": {
        "index": "/api/validate/email",
      },
    },
    "auth": {
      "verify-authentication": "/api/auth/verify-authentication",
      "login": "/api/auth/login",
      "generate-authentication-options":
        "/api/auth/generate-authentication-options",
      "logout": "/api/auth/logout",
    },
    "user": {
      "password": "/api/user/password",
      "name": "/api/user/name",
      "passkey": {
        "generate-registration-options":
          "/api/user/passkey/generate-registration-options",
        "edit": "/api/user/passkey/edit",
        "verify-registration": "/api/user/passkey/verify-registration",
        "delete": "/api/user/passkey/delete",
      },
      "email": "/api/user/email",
      "handle": "/api/user/handle",
      "index": "/api/user",
    },
  },
  "reset-password": {
    "index": "/reset-password",
  },
  "account": {
    "index": "/account",
  },
  "login": {
    "index": "/login",
  },
};
