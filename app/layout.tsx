import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "../components/providers/ThemeProvider";
import { cn } from "@/lib/utils";
import ModalProvider from "@/components/providers/ModalProvider";
import ToasterProvider from "@/components/providers/ToasterProvider";
import SocketProvider from "@/components/providers/SocketProvider";
const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Team chat application",
  description: "Generated by create next app",
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
              {children}
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
