import { Separator } from "@/components/ui/separator"

interface MenuItemProps {
  name: string
  price: string
  description?: string
}

export default function MenuItem({ name, price, description }: MenuItemProps) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-foreground">{name}</h3>
        <span className="font-bold text-primary">₹{price}</span>
      </div>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      <Separator className="mt-3 bg-primary/20" />
    </div>
  )
}
