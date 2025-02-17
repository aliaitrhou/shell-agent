import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Header from "./components/hearder";
import { Analytics } from "@vercel/analytics/react";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkKey) {
  throw new Error("Missing Clerk publishableKey.");
}

export const metadata: Metadata = {
  title: "AceOS",
  description: "AI powered OS course",
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
        <body className="bg-black">
          <div className="main">
            <div className="gradient"></div>
            <div className="gradient_background"></div>
            <div className="second_gradient"></div>
          </div>
          <Header />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
