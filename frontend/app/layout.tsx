import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Header } from "@/components/Header";
import { PortalProvider } from "@/components/PortalProvider";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Business Requirement Management Portal",
  description: "Enterprise lifecycle portal for business requirements and deployment governance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <PortalProvider>
          <Sidebar />
          <Header />
          <main className="min-h-screen bg-app-gradient pl-64 pt-16">
            <div className="p-6">{children}</div>
          </main>
        </PortalProvider>
      </body>
    </html>
  );
}
