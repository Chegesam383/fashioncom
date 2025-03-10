import { Geist, Geist_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/shared/theme-provider";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { ClerkProvider } from "@clerk/nextjs";
import "../globals.css";
import { Metadata } from "next";
import { CartSyncWrapper } from "@/components/shared/cartsyncWrapper";
import { NuqsAdapter } from "nuqs/adapters/next/app";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cart | Fashionist",
  description: "your cart for Online fashion store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-stone-50 dark:bg-stone-900 mt-32 md:mt-16`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header categoryNavHidden />
            <main className="flex-1">
              <NuqsAdapter>
                <CartSyncWrapper>{children}</CartSyncWrapper>
              </NuqsAdapter>
            </main>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
