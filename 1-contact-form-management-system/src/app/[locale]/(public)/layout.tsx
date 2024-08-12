import { Footer, Header } from "src/components/layouts";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="xl:container mx-auto flex flex-col min-h-screen">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
