import { Inter,  } from "next/font/google";
import "./globals.css";
import localFont from 'next/font/local'

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "web-server indexes",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
