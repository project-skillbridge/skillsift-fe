import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/lib/providers";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const appName = process.env.NEXT_PUBLIC_APP_NAME ?? "SkillSift";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const plusJakartaOutfit = Plus_Jakarta_Sans({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: appName,
    template: `%s · ${appName}`,
  },
  description: `${appName} — Find Talent, Get Hired.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        plusJakartaSans.variable,
        plusJakartaOutfit.variable,
      )}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
