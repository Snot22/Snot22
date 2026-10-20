import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lumora — Your world of AI companions",
  description: "Create original AI companions with personality, style, and voice.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}