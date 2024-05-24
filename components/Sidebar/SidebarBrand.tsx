"use client";
import { useSidebarToggleContext } from "@/contexts/SidebarToggleContext";
import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";

export default function SidebarBrand() {
  const { sidebarCollapse } = useSidebarToggleContext();

  return (
    <div
      className={clsx(
        "px-5 mb-6",
        sidebarCollapse ? "flex justify-center" : "",
      )}
    >
      <Link href="/" className="flex items-center gap-3">
        <div className="flex items-end justify-center w-11 h-[60px] pb-2">
          <Image
            src="/images/logo/Fitformotion Brandmark Logo White Ver.svg"
            alt="Fitformotion Logo"
            width={40}
            height={40}
            className="w-10 h-10"
          />
        </div>
        {!sidebarCollapse && (
          <div className="flex gap-3 items-center pt-[16px]">
            <p className="text-xl brand uppercase font-bold text-zinc-400">
              Fitformotion
            </p>
            {/* <Chip color="primary" radius="full">Pro</Chip> */}
          </div>
        )}
      </Link>
    </div>
  );
}
