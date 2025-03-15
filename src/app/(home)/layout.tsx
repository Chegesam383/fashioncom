import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";

import { ClerkProvider } from "@clerk/nextjs";
import { CartSyncWrapper } from "@/components/shared/cartsyncWrapper";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fashionist",
  description: "Online fashion store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} mt-48 md:mt-28`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-1">
              <CartSyncWrapper>{children}</CartSyncWrapper>
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
