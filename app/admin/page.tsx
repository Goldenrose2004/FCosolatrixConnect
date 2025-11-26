import { Suspense } from "react"

import AdminClient from "./AdminClient"

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-[#041A44]">
          <p className="text-lg font-semibold">Loading admin dashboard…</p>
        </div>
      }
    >
      <AdminClient />
    </Suspense>
  )
}

