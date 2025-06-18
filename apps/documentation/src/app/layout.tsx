import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import ThemeProvider from "./ThemeProvider";

export const metadata: Metadata = {
  title: "JustiFi Web Components Documentation",
  description: "Documentation for JustiFi's Web Component Library",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
