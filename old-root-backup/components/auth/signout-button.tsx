"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function SignOutButton() {
  const router = useRouter()
  return (
    <Button
      variant="ghost"
      onClick={() => router.push("/")}
    >
      Sign Out
    </Button>
  )
}
