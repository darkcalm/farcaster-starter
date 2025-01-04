import type { Metadata } from "next";
import { ThirdwebProvider } from "thirdweb/react";

import "~/app/globals.css";

export const metadata: Metadata = {
  title: "wrapper",
  description: "wrapper demo app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ margin: "3px", backgroundColor: "rgb(49, 51, 56)" }}>
        <ThirdwebProvider>{children}</ThirdwebProvider>
      </body>
    </html>
  );
}
