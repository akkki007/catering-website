import { Navbar } from "@/components/navbar";

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}