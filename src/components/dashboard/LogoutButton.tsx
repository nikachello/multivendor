"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-2 rounded text-sm text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors text-left w-full"
    >
      Sign out
    </button>
  );
}
