import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { Resend } from 'resend';

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db('better-auth-db');
const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async({user, url, token}, request) =>{
      void resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Password Reset",
        html: `<h2>Reset your password</h2>
        Click the link to reset your password: ${url}
        <p>Ignore this email if you haven't requested a password reset.</p>`,
      }).then(({ data, error }) => {
        if (error) console.error("Resend error:", error);
        else console.log("Reset email sent:", data.id);
      })
      .catch((err) => console.error("Resend request failed:", err));

    }
  },
  emailVerification: {
  sendVerificationEmail: async ({ user, url }) => {
    // not awaited on purpose, so response time doesn't reveal whether an email exists
    void resend.emails.send({
        from: "Acme <onboarding@resend.dev>",
        to: user.email,
        subject: "Verify your email",
        html: `<h1>Please Verify Your Email Address</h1>
        Click <a href="${url}">here</a> to verify your email.`,
      })
      .then(({ data, error }) => {
        if (error) console.error("Resend error:", error);
        else console.log("Verification email sent:", data.id);
      })
      .catch((err) => console.error("Resend request failed:", err));
  },
  sendOnSignUp: true,
  autoSignInAfterVerification: true,
  expiresIn: 7 * 24 * 3600, // 7 days
},
  socialProviders: {
    google: {
      clientId: process.env.BETTER_AUTH_GOOGLE_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GOOGLE_SECRET
    },
    github: {
      clientId: process.env.BETTER_AUTH_GITHUB_CLIENT_ID,
      clientSecret: process.env.BETTER_AUTH_GITHUB_SECRET
    }
  },

  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
});