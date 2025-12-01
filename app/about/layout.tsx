import { Navbar } from "@/components/navbar";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}