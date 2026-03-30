import type { PropsWithChildren } from "react";
import { Card } from "@heroui/react";

interface ImportCardProps extends PropsWithChildren {
  title: string;
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  description: string;
}

export const ImportCard = ({
  title,
  icon: Icon,
  description,
  children,
}: ImportCardProps) => {
  return (
    <Card className="h-full border-2 border-default transition-colors duration-200 hover:border-accent hover:bg-accent/5 group">
      <Card.Content className="flex flex-col gap-3 justify-between h-full p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 transition-colors duration-200 group-hover:text-accent">
            <Icon width={26} height={26} className="text-current" />
            <h2 className="text-xl font-medium">{title}</h2>
          </div>
          <p className="text-base text-default-foreground/70">{description}</p>
        </div>

        {children}
      </Card.Content>
    </Card>
  );
};
