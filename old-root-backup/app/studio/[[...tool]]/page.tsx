import Link from "next/link"

export const dynamic = "force-static"

export const metadata = {
  title: "Studio — TSUYA NO UCHI",
  description: "Content studio (not configured).",
}

export default function StudioPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-xl font-semibold text-zinc-800">Studio not configured</h1>
        <p className="mt-2 text-zinc-600">
          This project uses Supabase for content. Use the{" "}
          <Link href="/admin" className="text-emerald-700 hover:underline">
            admin dashboard
          </Link>{" "}
          to manage products.
        </p>
      </div>
    </div>
  )
}
