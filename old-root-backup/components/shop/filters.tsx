"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type FiltersState = {
  size: string | "all"
  tag: string | "all"
}

export default function Filters({
  sizes = ["A5", "A4", "A3", "11x14"],
  tags = ["blossom", "portrait", "nature", "yokai"],
  value = { size: "all", tag: "all" },
  onChange = () => {},
}: {
  sizes?: string[]
  tags?: string[]
  value?: FiltersState
  onChange?: (next: FiltersState) => void
}) {
  const sizeAll = useMemo(() => ["all", ...sizes], [sizes])
  const tagAll = useMemo(() => ["all", ...tags], [tags])

  return (
    <div className="w-full border rounded-lg p-3 md:p-4 bg-white">
      <div className="flex flex-wrap items-center gap-2">
        <div className="text-xs uppercase tracking-wide text-zinc-500">Size</div>
        {sizeAll.map((s) => (
          <button
            key={s}
            className={cn(
              "text-xs rounded-md border px-2 py-1",
              value.size === s ? "bg-emerald-900 text-white border-emerald-900" : "bg-white hover:bg-zinc-50"
            )}
            onClick={() => onChange({ ...value, size: s })}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <div className="text-xs uppercase tracking-wide text-zinc-500">Theme</div>
        {tagAll.map((t) => (
          <button
            key={t}
            className={cn(
              "text-xs rounded-md border px-2 py-1",
              value.tag === t ? "bg-emerald-900 text-white border-emerald-900" : "bg-white hover:bg-zinc-50"
            )}
            onClick={() => onChange({ ...value, tag: t })}
          >
            {t}
          </button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => onChange({ size: "all", tag: "all" })}
        >
          Reset
        </Button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <Badge variant="secondary" className="bg-emerald-50 text-emerald-900 border-emerald-200">
          Paper matte
        </Badge>
        <Badge variant="secondary" className="bg-emerald-50 text-emerald-900 border-emerald-200">
          Archival ink
        </Badge>
      </div>
    </div>
  )
}
