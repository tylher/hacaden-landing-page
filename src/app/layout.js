import HacadenLoader from "@/components/HacadenLoader";
import {
  Bricolage_Grotesque,
  Caveat_Brush,
  DM_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

// display: headlines and the wordmark
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

// body copy
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

// marker-style notes, arrows and asides
const caveatBrush = Caveat_Brush({
  variable: "--font-caveat-brush",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// amounts and numbers
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Hacaden | Give together",
  description:
    "Start a group gift in under a minute. Share one link, everyone chips in, and the gift tells a story.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${dmSans.variable} ${caveatBrush.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="">
        <HacadenLoader>{children}</HacadenLoader>
      </body>
    </html>
  );
}
