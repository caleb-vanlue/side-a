import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const handwritingFont = localFont({
  src: "../../public/fonts/Myfont-Regular.otf",
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Caleb Van Lue",
  description: "Yeah, I made this 🤷🏻‍♂️",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎧</text></svg>"
        />
      </head>
      <body className={`${handwritingFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
