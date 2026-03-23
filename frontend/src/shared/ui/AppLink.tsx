import { Link as RouterLink, type LinkProps } from "react-router";
import { cn, linkVariants } from "@heroui/styles";

export const AppLink = ({ className, ...props }: LinkProps) => {
  const styles = linkVariants();

  return <RouterLink {...props} className={cn(styles.base(), className)} />;
};
