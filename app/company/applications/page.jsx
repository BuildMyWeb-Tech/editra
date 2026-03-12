'use client'

import { useEffect, useState } from "react"
import Loading from "@/components/Loading"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import toast from "react-hot-toast"
import { EyeIcon } from "lucide-react"

export default function CompanyApplications() {
  const { getToken } = useAuth()

  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchApplications = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get(
        "/api/company/applications",
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setApplications(data.applications || [])
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      const token = await getToken()

      await axios.post(
        "/api/company/applications",
        { applicationId: id, status },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setApplications(prev =>
        prev.map(app =>
          app.id === id ? { ...app, status } : app
        )
      )

      toast.success("Status updated")
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  if (loading) return <Loading />

  const statusBadge = (status) => {
    const map = {
      APPLIED: "bg-blue-100 text-blue-700",
      IN_REVIEW: "bg-yellow-100 text-yellow-700",
      HIRED: "bg-purple-100 text-purple-700",
      IN_PROGRESS: "bg-indigo-100 text-indigo-700",
      COMPLETED: "bg-green-100 text-green-700",
      REJECTED: "bg-red-100 text-red-700"
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${map[status]}`}>
        {status}
      </span>
    )
  }

  return (
    <>
      <h1 className="text-2xl text-slate-500 mb-6">
        Job <span className="text-slate-800 font-medium">Applications</span>
      </h1>

      {applications.length === 0 ? (
        <div className="text-center text-slate-500 py-10">
          No applications received yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full max-w-5xl text-left text-sm ring-1 ring-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-50 text-slate-600 uppercase">
              <tr>
                <th className="px-4 py-3">Job</th>
                <th className="px-4 py-3">Editor</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Skills</th>
                <th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Resume</th>
                <th className="px-4 py-3">Applied</th>
                {/* <th className="px-4 py-3">Status</th> */}
                <th className="px-4 py-3">Update Status </th>
              </tr>
            </thead>
            <tbody className="divide-y">

              {applications.map((app) => {

                const editor = app.editor
                const user = editor?.user

                return (

                  <tr key={app.id} className="hover:bg-slate-50">

                    <td className="px-4 py-3 font-medium">
                      {app.job?.title}
                    </td>

                    <td className="px-4 py-3">

                      <div className="flex flex-col">

                        <span className="font-medium text-slate-800">
                          {user?.name || user?.email}
                        </span>

                        {/* <span className="text-xs text-slate-500">
                          {editor?.location || "Location not set"}
                        </span> */}

                      </div>

                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600">
                      {editor?.phone || "-"}
                    </td>

                    <td className="px-4 py-3">

                      <div className="flex flex-wrap gap-1">

                        {editor?.skills?.slice(0, 3).map(skill => (
                          <span
                            key={skill}
                            className="text-xs bg-slate-100 px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}

                      </div>

                    </td>

                    <td className="px-4 py-3 text-sm text-slate-600 max-w-[200px] truncate">
                      {editor?.experience || "-"}
                    </td>

                    <td className="px-4 py-3">

                      {editor?.resumeUrl ? (

                        <a
                          href={editor.resumeUrl}
                          target="_blank"
                          className="text-indigo-600 hover:underline text-sm"
                        >
                          View Resume
                        </a>

                      ) : (

                        <span className="text-slate-400 text-sm">
                          No Resume
                        </span>

                      )}

                    </td>

                    <td className="px-4 py-3 text-slate-500 text-sm">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>

                    {/* <td className="px-4 py-3">
                      {statusBadge(app.status)}
                    </td> */}

                    <td className="px-4 py-3">

                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >

                        <option value="APPLIED">APPLIED</option>
                        <option value="IN_REVIEW">IN REVIEW</option>
                        <option value="HIRED">HIRED</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="REJECTED">REJECTED</option>

                      </select>

                    </td>

                  </tr>

                )

              })}

            </tbody>
          </table>
        </div>
      )}
    </>
  )
}