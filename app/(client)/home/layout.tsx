import { Navbar } from "@/app/custom components/Navbar";

export default function CreateHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
