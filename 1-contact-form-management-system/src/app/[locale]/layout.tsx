import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Gabarito } from "next/font/google";
import type { Metadata } from "next";

import "./globals.scss";
import { ReduxProvider } from "src/features/Provider";
import { SnackbarProvider } from "src/contexts/snackbarContext";

const locales = ["en", "de"];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

const gabarito = Gabarito({ subsets: ["latin"] });

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
  },
  title: "ContactFormHub",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={gabarito.className}>
        <NextIntlClientProvider messages={messages}>
          <ReduxProvider>
            <SnackbarProvider>{children}</SnackbarProvider>
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
