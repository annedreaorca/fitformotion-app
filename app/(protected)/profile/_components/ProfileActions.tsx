"use client";
import { useClerk } from "@clerk/clerk-react";
import { Button } from "@nextui-org/button";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export default function ProfileActions() {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <div className="flex justify-end">
      <Button variant="flat" onClick={() => signOut(() => router.push("/"))}>
        <IconLogout /> Sign out
      </Button>
    </div>
  );
}
