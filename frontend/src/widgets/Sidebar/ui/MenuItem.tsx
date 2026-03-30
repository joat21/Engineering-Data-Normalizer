import type { FC } from "react";
import { NavLink } from "react-router";
import { cn, Tooltip } from "@heroui/react";
import type { SidebarMenuItem } from "../model/types";

interface MenuItemProps {
  item: SidebarMenuItem;
  collapsed: boolean;
}

export const MenuItem: FC<MenuItemProps> = ({ collapsed, item }) => {
  const { label, icon: Icon, path } = item;

  return (
    <Tooltip isDisabled={!collapsed} delay={0}>
      <Tooltip.Trigger>
        <NavLink
          to={path}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-xl text-lg transition-colors duration-400",
              "hover:bg-default-hover",
              isActive && "bg-default font-medium",
            )
          }
        >
          {Icon && <Icon width={20} height={20} className="shrink-0" />}

          <span
            className={cn(
              "max-w-full opacity-100 whitespace-nowrap overflow-hidden transition-all duration-400",
              collapsed && "max-w-0 opacity-0",
            )}
          >
            {label}
          </span>
        </NavLink>
      </Tooltip.Trigger>

      <Tooltip.Content placement="right">
        <span className="text-base">{label}</span>
      </Tooltip.Content>
    </Tooltip>
  );
};
