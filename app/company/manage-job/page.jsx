'use client'

import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import Link from "next/link"
import { Pencil, Trash2 } from "lucide-react"

export default function CompanyManageJobs() {

  const { getToken } = useAuth()
  const { user } = useUser()

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$"

  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState([])

  const fetchJobs = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get(
        "/api/company/job",
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const jobsData = data?.products || []

      setJobs(
        jobsData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      )

    } catch (error) {
      console.error(error)
      toast.error(error?.response?.data?.error || error.message)
    }

    setLoading(false)
  }

  const toggleJobStatus = async (jobId) => {
    try {
      const token = await getToken()

      await axios.post(
        "/api/jobs/toggle",
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setJobs(prev =>
        prev.map(job =>
          job.id === jobId
            ? { ...job, inStock: !job.inStock }
            : job
        )
      )

      toast.success("Job status updated")

    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Failed to update job"
      )
    }
  }

  const deleteJob = async (jobId) => {

  const confirmDelete = confirm("Are you sure you want to delete this job?")

  if (!confirmDelete) return

  try {

    const token = await getToken()

    await axios.delete("/api/company/job", {
      headers: { Authorization: `Bearer ${token}` },
      data: { id: jobId }
    })

    setJobs(prev => prev.filter(job => job.id !== jobId))

    toast.success("Job deleted successfully")

  } catch (error) {

    toast.error(
      error?.response?.data?.error || "Failed to delete job"
    )

  }
}

  useEffect(() => {
    if (user) fetchJobs()
  }, [user])

  if (loading) return <Loading />

  return (
    <>
      <h1 className="text-2xl text-slate-500 mb-5">
        Manage <span className="text-slate-800 font-medium">Jobs</span>
      </h1>

      <table className="w-full max-w-4xl text-left ring ring-slate-200 rounded overflow-hidden text-sm">
        <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
         <tr>
  <th className="px-4 py-3">Job</th>
  <th className="px-4 py-3 hidden md:table-cell">Description</th>
  <th className="px-4 py-3">Budget</th>
  <th className="px-4 py-3 text-center">Status</th>
<th className="px-4 py-3 text-center">Actions</th>
</tr>
        </thead>

        <tbody className="text-slate-700">

          {jobs.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-10 text-gray-500">
                No jobs created yet
              </td>
            </tr>
          )}

          {jobs.map((job) => (
            <tr
              key={job.id}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-3">
                <div className="flex gap-2 items-center">
                  <Image
                    width={40}
                    height={40}
                    className="p-1 shadow rounded"
                    src={job.images?.[0] || "/job.png"}
                    alt=""
                  />
                  {job.name}
                </div>
              </td>

              <td className="px-4 py-3 max-w-md text-slate-600 hidden md:table-cell truncate">
                {job.description}
              </td>

              <td className="px-4 py-3">
                {currency} {job?.price ? Number(job.price).toLocaleString() : "0"}
              </td>

              <td className="px-4 py-3 text-center">
                <label className="relative inline-flex items-center cursor-pointer gap-3">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={job.inStock}
                    onChange={() =>
                      toast.promise(
                        toggleJobStatus(job.id),
                        { loading: "Updating job status..." }
                      )
                    }
                  />

                  <div className="w-9 h-5 bg-slate-300 rounded-full peer peer-checked:bg-green-600 transition-colors"></div>

                  <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-transform peer-checked:translate-x-4"></span>
                </label>

                <p className="text-xs mt-1">
                  {job.inStock ? "Open" : "Closed"}
                </p>
              </td>

          <td className="px-4 py-3 text-center">
  <div className="flex items-center justify-center gap-3">

    {/* Edit */}
    <Link
      href={`/company/edit-job/${job.id}`}
      className="p-2 rounded hover:bg-indigo-100 text-indigo-600"
    >
      <Pencil size={18} />
    </Link>

    {/* Delete */}
    <button
      onClick={() => deleteJob(job.id)}
      className="p-2 rounded hover:bg-red-100 text-red-600"
    >
      <Trash2 size={18} />
    </button>

  </div>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}