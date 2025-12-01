import { Navbar } from "@/components/navbar";

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}