import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "../components/ThemeContext";
import { RecordPlayerProvider } from "../components/RecordPlayerContext";
import Footer from "../components/Footer";

const handwritingFont = localFont({
  src: "../../public/fonts/Myfont-Regular.otf",
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Caleb Van Lue",
  description: "Software Engineer & Music Enthusiast",
  icons: {
    icon: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎧</text></svg>",
      type: "image/svg+xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${handwritingFont.variable} antialiased`}>
        <ThemeProvider>
          <RecordPlayerProvider>{children}</RecordPlayerProvider>
        </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
