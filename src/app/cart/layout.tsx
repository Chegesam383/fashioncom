// app/layout.tsx

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import Header from "@/components/shared/header";
import Footer from "@/components/shared/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { CartSyncWrapper } from "../../components/shared/cartsyncWrapper";
import { Metadata } from "next";

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
          className={`${geistSans.variable} ${geistMono.variable} md:mt:24 mt-16`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header categoryNavHidden />
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
