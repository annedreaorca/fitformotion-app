"use client";

import { Navbar, NavbarContent, NavbarItem } from "@nextui-org/navbar";

import {
  IconActivity,
  IconBook,
  IconDashboard,
  IconJumpRope,
} from "@tabler/icons-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarUser from "./NavbarUser";

const NAV_CONTENT_ITEMS = [
  { icon: <IconDashboard />, href: "/dashboard", label: "Dashboard" },
  { icon: <IconActivity />, href: "/activity", label: "Activity Log" },
  { icon: <IconJumpRope />, href: "/workout", label: "Start Workout" },
  { icon: <IconBook />, href: "/exercises", label: "Exercises" },
];

export default function MobileNavbarClient({
  username,
  userImage,
}: {
  username: string | undefined;
  userImage: string | undefined;
}) {
  const pathname = usePathname();

  return (
    <Navbar className="bg-white dark:bg-zinc-900 block md:hidden shadow-md">
      <NavbarContent justify="start">
        <NavbarItem>
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
            aria-label="Home Page"
          >
            <Image
              src="/images/logo/Fitformotion Brandmark Logo White Ver.svg"
              alt="Fitformotion Logo"
              className="w-8 h-8"
              width={30}
              height={30}
            />
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="gap-5" justify="center">
        {NAV_CONTENT_ITEMS.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link href={item.href} aria-label={item.label}>
              {item.icon}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem>
          <Link href="/profile">
            <NavbarUser username={username} userImage={userImage} />
          </Link>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
