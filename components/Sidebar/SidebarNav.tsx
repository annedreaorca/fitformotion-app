"use client";
import { useSidebarToggleContext } from "@/contexts/SidebarToggleContext";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
  icon: JSX.Element;
  label?: string;
  href?: string;
  active: boolean;
}

import {
  IconActivity,
  IconBook,
  IconClipboardList,
  IconDashboard,
  IconJumpRope,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";

export default function SidebarNav() {
  const { sidebarCollapse, toggleSidebar } = useSidebarToggleContext();
  const pathname = usePathname();

  return (
    <div className="px-5">
      <ul className="text-sm">
        <NavItem
          icon={<IconDashboard size={22} className="shrink-0" />}
          label="Dashboard"
          href="/dashboard"
          active={pathname === "/dashboard"}
        />

        <NavItem
          icon={<IconUser size={22} className="shrink-0" />}
          label="Profile"
          href="/profile"
          active={pathname === "/profile"}
        />

        <NavItem
          icon={<IconActivity size={22} className="shrink-0" />}
          label="Activity Log"
          href="/activity"
          active={pathname === "/activity"}
        />

        <NavItem
          icon={<IconBook size={22} className="shrink-0" />}
          label="Browse Exercises"
          href="/exercises"
          active={pathname === "/exercises"}
        />

        <NavItem
          icon={<IconJumpRope size={22} className="shrink-0" />}
          label="Workout Routine"
          href="/workout"
          active={pathname.startsWith("/workout")}
        />

        <NavItem
          icon={<IconClipboardList size={22} className="shrink-0" />}
          label="Routine Planner"
          href="/edit-routine/step-1"
          active={pathname.startsWith("/edit-routine/")}
        />

        <NavItem
          icon={<IconSettings size={22} className="shrink-0" />}
          label="Settings"
          href="/profile/advanced"
          active={pathname.startsWith("/profile/advanced")}
        />

        <div className="absolute bottom-0 left-0 right-0 py-5 px-5 flex flex-col items-start">
          <SidebarToggle />
        </div>
      </ul>
    </div>
  );
}

function SubMenuTitle({ title }: { title: string }) {
  const { sidebarCollapse } = useSidebarToggleContext();

  return (
    !sidebarCollapse && (
      <li className="uppercase text-xs text-zinc-600 dark:text-zinc-400 font-semibold mb-1 mt-4 px-2">
        {title}
      </li>
    )
  );
}

function NavItem({ icon, label, href, active }: NavItemProps) {
  const { sidebarCollapse } = useSidebarToggleContext();

  const styles = {
    button_bg_primary_800: {
      backgroundColor: "#991b1b",
    },
  };

  const content = (
    <div
      className={clsx(
        "flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out",
        sidebarCollapse ? "justify-center" : "",
        active
          ? "bg-zinc-300 text-black dark:text-primary text-white"
          : "text-zinc-600 dark:text-zinc-400 text-white",
      )}
      style={active ? styles.button_bg_primary_800 : {}}
    >
      {icon}
      {!sidebarCollapse && label && <div>{label}</div>}
    </div>
  );

  return (
    <li className="my-1">
      <Link href={href || "#"}>{content}</Link>
    </li>
  );
}

function SidebarToggle() {
  const { sidebarCollapse, toggleSidebar } = useSidebarToggleContext();

  return (
    <li onClick={toggleSidebar} className="cursor-pointer my-1">
      <div
        className={clsx(
          "flex items-center space-x-3 p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors duration-200 ease-in-out",
          sidebarCollapse ? "justify-center" : "",
        )}
      >
        {sidebarCollapse ? (
          <IconLayoutSidebarLeftExpand size={22} className="shrink-0" />
        ) : (
          <IconLayoutSidebarLeftCollapse size={22} className="shrink-0" />
        )}
        {!sidebarCollapse && <div>Collapse Sidebar</div>}
      </div>
    </li>
  );
}
