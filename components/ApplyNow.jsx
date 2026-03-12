'use client'

import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

export default function ApplyNow({ jobId }) {
  const { user } = useUser()
  const { getToken } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleApply = async () => {
    if (!user) {
      toast.error("Please login to apply")
      router.push("/")
      return
    }

    try {
      setLoading(true)
      const token = await getToken()
      await axios.post(
        "/api/job-applications",
        { jobId, proposal: "Interested in this job." },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success("Application submitted successfully")
    } catch (err) {
      const msg = err?.response?.data?.error
      toast.error(msg || "Failed to apply")

      if (msg?.includes("profile")) router.push("/profile") // redirect to profile
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleApply}
      disabled={loading}
      className="bg-slate-800 text-white py-2 px-4 rounded-lg w-full hover:bg-slate-700 transition disabled:opacity-60"
    >
      {loading ? "Applying..." : "Apply Now"}
    </button>
  )
}