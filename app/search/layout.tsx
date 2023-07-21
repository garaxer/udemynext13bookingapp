import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TrailerBook - Search",
  description: "Search for a trailer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
