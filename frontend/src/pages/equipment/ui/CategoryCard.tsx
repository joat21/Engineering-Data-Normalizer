import { Card } from "@heroui/react";
import { ChevronRight, Layers } from "lucide-react";

interface CategoryCardProps {
  categoryName: string;
}

export const CategoryCard = ({ categoryName }: CategoryCardProps) => {
  return (
    <Card className="w-full min-h-28 border-2 border-default/50 group hover:border-accent hover:bg-accent/5 transition-all">
      <Layers
        className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity rotate-12"
        size={120}
      />

      <div className="flex items-center gap-1 group-hover:text-accent relative z-10">
        <span className="text-xl font-semibold transition-colors">
          {categoryName}
        </span>
        <div className="relative z-10 p-2 rounded-full transition-transform">
          <ChevronRight
            size={20}
            className="translate-x-0 group-hover:translate-x-0.5 transition-transform"
          />
        </div>
      </div>
    </Card>
  );
};
