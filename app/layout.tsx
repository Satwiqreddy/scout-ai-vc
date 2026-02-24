import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppWrapper } from "@/components/AppWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VC Scout | AI-Powered Deal Sourcing",
  description: "Advanced intelligence platform for venture capital firms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
