import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";
import { firaCode, mplus, lexend, montserrat } from "./fonts";
import ClinetLayout from "@/components/clinet-layout";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!clerkKey) {
  throw new Error("Missing Clerk publishableKey.");
}

export const metadata: Metadata = {
  title: "ShellAgent",
  description: "Learn about OSes in the Proper way",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
      publishableKey={clerkKey}
    >
      <html
        lang="en"
        className={`${firaCode.variable} ${mplus.variable} ${lexend.variable} ${montserrat.variable}`}
      >
        <body
          className={`bg-neutral-950 text-white min-h-[100dvh] flex flex-col`}
        >
          <ClinetLayout>
            {children}
          </ClinetLayout>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
