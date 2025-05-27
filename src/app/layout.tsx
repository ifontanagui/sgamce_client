import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SGAMCE",  
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <body className="main">{children}</body>
    </html>
  );
}
