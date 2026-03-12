'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import { useUser, useAuth } from "@clerk/nextjs"
import axios from "axios"

const AdminLayout = ({ children }) => {

  const { user } = useUser()
  const { getToken } = useAuth()

  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchIsAdmin = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get('/api/admin/is-admin', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setIsAdmin(data.isAdmin)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchIsAdmin()
  }, [user])

  if (loading) return <Loading />

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-50">
        <h1 className="text-3xl font-bold text-slate-700 mb-3">
          Access Restricted
        </h1>
        <p className="text-slate-500 mb-6">
          You are not authorized to access the Editra Admin Panel.
        </p>
        <Link
          href="/"
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2 px-6 py-3 rounded-full transition"
        >
          Go to Homepage <ArrowRightIcon size={18} />
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <AdminNavbar />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout