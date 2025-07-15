import PointerHighlight from "./ui/pointer-highlight";

export function PointerHighlightDemo() {
  return (
    <div className="mx-[37vw] max-w-xl py-20 text-2xl font-bold tracking-tighter md:text-4xl">
      Be ready to taste our<PointerHighlight><span>trending</span></PointerHighlight> 
    </div>
  );
}
export default PointerHighlightDemo;