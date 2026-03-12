'use client'
import { useUser, UserButton } from "@clerk/nextjs"
import Link from "next/link"

const AdminNavbar = () => {

  const { user } = useUser()

  return (
    <div className="flex items-center justify-between px-12 py-4 border-b border-slate-200 bg-white">

      <Link href="/admin" className="relative text-3xl font-bold text-slate-800">
        <span className="text-indigo-600">Edit</span>ra
        <span className="absolute -top-2 -right-12 text-xs bg-indigo-600 text-white px-3 py-1 rounded-full">
          Admin
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <p className="text-slate-600">
          Hi, <span className="font-semibold">{user?.firstName}</span>
        </p>
        <UserButton />
      </div>

    </div>
  )
}

export default AdminNavbar