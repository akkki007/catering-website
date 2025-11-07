import { Navbar } from "@/components/navbar";

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}