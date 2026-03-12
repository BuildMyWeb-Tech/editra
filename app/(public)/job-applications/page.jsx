'use client'

import PageTitle from "@/components/PageTitle"
import { useEffect, useState } from "react"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import Loading from "@/components/Loading"
import {
  BriefcaseIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  HammerIcon,
  EyeIcon,
  XCircleIcon
} from "lucide-react"
import Link from "next/link"

export default function AppliedJobsPage() {
  const { getToken } = useAuth()
  const { user, isLoaded } = useUser()
  const router = useRouter()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  const statusTabs = ["all", "APPLIED", "REVIEWING", "HIRED", "COMPLETED", "REJECTED"]

  const getStatusBadge = (status) => {
    switch (status) {
      case "APPLIED":
        return {
          color: "bg-blue-100 text-blue-700",
          icon: <ClipboardListIcon size={14} className="mr-1" />,
          text: "Applied",
        }
      case "REVIEWING":
        return {
          color: "bg-indigo-100 text-indigo-700",
          icon: <EyeIcon size={14} className="mr-1" />,
          text: "Reviewing",
        }
      case "HIRED":
        return {
          color: "bg-yellow-100 text-yellow-700",
          icon: <HammerIcon size={14} className="mr-1" />,
          text: "Hired",
        }
      case "COMPLETED":
        return {
          color: "bg-green-100 text-green-700",
          icon: <CheckCircleIcon size={14} className="mr-1" />,
          text: "Completed",
        }
      case "REJECTED":
        return {
          color: "bg-red-100 text-red-700",
          icon: <XCircleIcon size={14} className="mr-1" />,
          text: "Rejected",
        }
      default:
        return {
          color: "bg-slate-100 text-slate-700",
          icon: <ClipboardListIcon size={14} className="mr-1" />,
          text: status,
        }
    }
  }

  /* ===============================
     Fetch Applications
  ================================*/
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = await getToken()

        const { data } = await axios.get(
          "/api/job-applications",
          { headers: { Authorization: `Bearer ${token}` } }
        )

        setApplications(data.applications || [])
      } catch (error) {
        toast.error(error?.response?.data?.error || error.message)
      } finally {
        setLoading(false)
      }
    }

    if (isLoaded) {
      if (user) fetchApplications()
      else router.push("/")
    }
  }, [isLoaded, user, getToken, router])

  const filteredApplications =
    activeTab === "all"
      ? applications
      : applications.filter(app => app.status === activeTab)

  if (!isLoaded || loading) return <Loading />

  return (
    <div className="min-h-[70vh] mx-6">
      {applications.length ? (
        <div className="my-10 max-w-7xl mx-auto">
          <div className="flex flex-col gap-4 mb-8">
            <PageTitle
              heading="My Applications"
              text={`Showing ${filteredApplications.length} of ${applications.length} applications`}
            />

            <div className="flex gap-3 flex-wrap">
              {statusTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm border transition ${
                    activeTab === tab
                      ? "bg-slate-800 text-white"
                      : "bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {tab === "all" ? "All" : tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredApplications.map((application) => {
              const status = getStatusBadge(application.status)

              return (
                <div
                  key={application.id}
                  className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-lg">
                      <BriefcaseIcon className="text-slate-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {application.job?.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {application.job?.company?.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                    {status.icon}
                    {status.text}
                  </span>

                  <Link
                    href={`/job/${application.job?.id}`}
                    className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Job
                    <ChevronRightIcon size={16} className="ml-1" />
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-slate-400">
          <BriefcaseIcon size={48} className="mb-4 text-slate-300" />
          <h1 className="text-2xl font-semibold text-slate-700 mb-2">
            No applications yet
          </h1>
          <p className="text-slate-500 mb-6 text-center max-w-md">
            Jobs you apply for will appear here so you can track their progress.
          </p>
          <Link
            href="/jobs"
            className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition"
          >
            Browse Jobs
          </Link>
        </div>
      )}
    </div>
  )
}