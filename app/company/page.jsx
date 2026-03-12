'use client'

import Loading from "@/components/Loading"
import {
  BriefcaseIcon,
  UsersIcon,
  CheckCircleIcon,
  ClockIcon
} from "lucide-react"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function CompanyDashboard() {
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(true)

  const [data, setData] = useState({
    totalJobs: 0,
    completedJobs: 0,
    totalApplications: 0,
    acceptedApplications: 0,
    pendingApplications: 0
  })

  const fetchDashboard = async () => {
    try {
      const token = await getToken()

      const res = await axios.get("/api/company/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      setData(res.data)
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  if (loading) return <Loading />

  const cards = [
    {
      title: "Total Jobs",
      value: data.totalJobs,
      icon: BriefcaseIcon
    },
    {
      title: "Completed Jobs",
      value: data.completedJobs,
      icon: CheckCircleIcon
    },
    {
      title: "Total Applications",
      value: data.totalApplications,
      icon: UsersIcon
    },
    {
      title: "Accepted Applications",
      value: data.acceptedApplications,
      icon: CheckCircleIcon
    },
    {
      title: "Pending Applications",
      value: data.pendingApplications,
      icon: ClockIcon
    }
  ]

  return (
    <div className="space-y-8">
      
      <h1 className="text-2xl font-semibold text-slate-800">
        Company Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className="bg-white shadow-sm border rounded-xl p-6 flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <p className="text-sm text-slate-500">{card.title}</p>
              <p className="text-3xl font-bold text-slate-800">
                {card.value}
              </p>
            </div>
            <card.icon className="w-10 h-10 text-indigo-500" />
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4 text-slate-700">
          Overview
        </h2>

        <div className="flex flex-col gap-3 text-sm text-slate-600">
          <p>
            You have posted <b>{data.totalJobs}</b> jobs.
          </p>
          <p>
            <b>{data.completedJobs}</b> jobs have been completed.
          </p>
          <p>
            You received <b>{data.totalApplications}</b> applications.
          </p>
          <p>
            <b>{data.acceptedApplications}</b> editors were accepted.
          </p>
        </div>
      </div>

    </div>
  )
}