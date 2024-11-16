import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { Metadata } from "next";
import { MainLayout } from "@/components/main-layout";

export const metadata: Metadata = {
  title: "DAO Genie",
  description: "", // todo-riley
  icons: [
    // todo-riley
    // place favicon.ico in public folder and uncomment the following line
    // { rel: "icon", url: "/favicon.ico" }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
