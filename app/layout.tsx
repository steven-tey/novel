import "@/styles/globals.css";
import cx from "classnames";
import { vercelBold, vercelRegular } from "@/styles/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cx(vercelBold.variable, vercelRegular.variable)}>
        {children}
      </body>
    </html>
  );
}
