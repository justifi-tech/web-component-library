import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import ThemeProvider from "./ThemeProvider";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JustiFi Web Components Documentation",
  description: "Documentation for JustiFi's Web Component Library",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={lato.className}>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
