import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/ui/themes";
import { Inter } from "next/font/google";
import Image from "next/image";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Servd - AI Recipe Platform",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{ theme: neobrutalism }}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className}`}>
          <Header />

          <main className="min-h-screen">{children}</main>

          <Toaster richColors />

          <footer className="px-4 py-8 border-t">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-centergap-6">
              <div className="flex items-center gap-3">
                <Image
                  src="/logo-orange.png"
                  alt="Servd Logo"
                  width={48}
                  height={48}
                  className="w-14"
                />
              </div>

              <p className="text-stone-500 text-sm">Made with 🧡 by Jyothika</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
