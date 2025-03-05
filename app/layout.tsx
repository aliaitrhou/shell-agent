import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Header from "@/components/hearder";
import { Analytics } from "@vercel/analytics/react";
import Footer from "@/components/footer";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkKey) {
  throw new Error("Missing Clerk publishableKey.");
}

export const metadata: Metadata = {
  title: "QShell",
  description: "Learn about OSes with AI",
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
        <body className="bg-zinc-950">
          <div className="gradient_background"></div>
          <Header />
          {children}
          <Footer />
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
