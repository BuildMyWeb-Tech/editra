'use client'

import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { BriefcaseIcon, UsersIcon, Building2Icon } from "lucide-react"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminDashboard() {
  const { getToken } = useAuth()

  const [loading, setLoading] = useState(true)

  const [dashboardData, setDashboardData] = useState({
    totalJobs: 0,
    totalApplications: 0,
    totalCompanies: 0,
  })

  const dashboardCardsData = [
    {
      title: "Total Companies",
      value: dashboardData.totalCompanies,
      icon: Building2Icon,
    },
    {
      title: "Total Jobs Posted",
      value: dashboardData.totalJobs,
      icon: BriefcaseIcon,
    },
    {
      title: "Total Applications",
      value: dashboardData.totalApplications,
      icon: UsersIcon,
    },
  ]

  const fetchDashboardData = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get("/api/admin/dashboard", {
        headers: { Authorization: `Bearer ${token}` }
      })

      setDashboardData(data.dashboardData)

    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) return <Loading />

  return (
    <div className="text-slate-600">

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">
          Editra Admin Dashboard
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Manage companies, job postings, and editor applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {dashboardCardsData.map((card, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-xl p-6 flex items-center justify-between shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="text-sm text-slate-500">
                {card.title}
              </p>
              <h2 className="text-3xl font-bold text-slate-800 mt-2">
                {card.value}
              </h2>
            </div>

            <card.icon className="w-12 h-12 p-3 text-indigo-600 bg-indigo-50 rounded-full" />
          </div>
        ))}

      </div>

    </div>
  )
}