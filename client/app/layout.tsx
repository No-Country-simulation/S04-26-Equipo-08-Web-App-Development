import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import QueryProvider from "./providers/query-provider";
import MainFooter from "./components/layout/footers/main-footer";
import { ToastProvider } from "./providers/ToastProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NorthPay",
  description: "NorthPay Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
          <MainFooter />
        </QueryProvider>
      </body>
    </html>
  );
}
