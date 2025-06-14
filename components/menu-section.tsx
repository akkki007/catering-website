import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MenuItem from "./menu-item"
import type { MenuItemType } from "@/lib/menu-data"

interface MenuSectionProps {
  title: string
  items: MenuItemType[]
}

export default function MenuSection({ title, items }: MenuSectionProps) {
  return (
    <Card className="overflow-hidden border-primary/20">
      <CardHeader className="bg-primary text-primary-foreground">
        <CardTitle className="text-xl text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3">
          {items.map((item, index) => (
            <MenuItem key={index} name={item.name} price={item.price} description={item.description} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
