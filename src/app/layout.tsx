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
  metadataBase: new URL('https://calebvanlue.com'),
  title: "Caleb Van Lue",
  description: "Software Engineer & Music Enthusiast",
  icons: {
    icon: {
      url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎧</text></svg>",
      type: "image/svg+xml",
    },
  },
  openGraph: {
    title: "Caleb Van Lue",
    description: "Software Engineer & Music Enthusiast",
    url: "https://calebvanlue.com",
    siteName: "Caleb Van Lue",
    images: [
      {
        url: "/record.png",
        width: 1200,
        height: 630,
        alt: "Vinyl record player showcasing Caleb Van Lue's portfolio",
      },
    ],
    locale: "en_US",
    type: "website",
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
