import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import ModalProvider from "@/components/providers/ModalProvider";
import ToasterProvider from "@/components/providers/ToasterProvider";
import SocketProvider from "@/components/providers/SocketProvider";
import QueryProvider from "@/components/providers/QueryProvider";
const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Discord",
  description: "Connect People, Connects You",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, "bg-white dark:bg-[#313338]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            storageKey="discord-theme"
          >
            <ToasterProvider />
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>
                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
