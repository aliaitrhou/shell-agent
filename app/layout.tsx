import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Analytics } from "@vercel/analytics/react";

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
      <html lang="en">
        <body className={`bg-neutral-950 text-white`}>
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
