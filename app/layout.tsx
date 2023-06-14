import "@/styles/globals.css";
import cx from "classnames";
import { vercelBold, vercelRegular } from "@/styles/fonts";
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
        <body className={cx(vercelBold.variable, vercelRegular.variable)}>
          {children}
        </body>
      </Providers>
    </html>
  );
}
