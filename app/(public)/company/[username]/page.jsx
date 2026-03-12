'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Loading from "@/components/Loading"
import JobCard from "@/components/JobCard"
import { MapPinIcon, MailIcon, BriefcaseIcon, CheckCircleIcon } from "lucide-react"
import toast from "react-hot-toast"

export default function CompanyProfilePage() {
  const { username } = useParams()

  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`/api/company/data?username=${username}`)
      setCompany(data.company)
      setJobs(data.company.jobs || [])
    } catch (error) {
      toast.error("Company not found")
    }
    setLoading(false)
  }

  useEffect(() => {
    if (username) fetchCompanyData()
  }, [username])

  if (loading) return <Loading />

  if (!company)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Company not found
      </div>
    )

  return (
    <div className="min-h-[70vh] mx-6">

      {/* Company Banner */}
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-8 mt-6 flex flex-col md:flex-row items-center gap-8 shadow-sm">

        <div className="relative">
          <Image
            src={company.logo || "/company-placeholder.png"}
            alt={company.name}
            width={140}
            height={140}
            className="rounded-xl object-cover border-4 border-white shadow-md"
          />

          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 shadow">
            <CheckCircleIcon size={20} className="text-green-500" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-800">
            {company.name}
          </h1>

          <p className="text-sm text-slate-600 mt-3 max-w-2xl">
            {company.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

            {company.address && (
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
                <MapPinIcon size={16} />
                <span className="text-sm">{company.address}</span>
              </div>
            )}

            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
              <MailIcon size={16} />
              <span className="text-sm">{company.email}</span>
            </div>

            <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm">
              <BriefcaseIcon size={16} />
              <span className="text-sm">{jobs.length} Open Jobs</span>
            </div>

          </div>
        </div>
      </div>

      {/* Jobs Section */}
      <div className="max-w-7xl mx-auto mt-12 mb-32">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">
            Open <span className="font-semibold text-slate-800">Jobs</span>
          </h2>

          <p className="text-sm text-slate-500">
            {jobs.length} jobs available
          </p>
        </div>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {jobs.map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-500">
            No jobs posted yet
          </div>
        )}

      </div>
    </div>
  )
}