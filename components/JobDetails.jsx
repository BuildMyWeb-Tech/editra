'use client'

import { BriefcaseIcon, ClockIcon } from "lucide-react"
import ApplyNow from "@/components/ApplyNow"
import Image from "next/image"

const JobDetails = ({ job, sidebar = false }) => {

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'

  // Safe budget formatting
  const formattedBudget =
    job?.budget && !isNaN(job.budget)
      ? `${currency}${Number(job.budget).toLocaleString()}`
      : "Budget not specified"

  // ============================
  // SIDEBAR VERSION
  // ============================
  if (sidebar) {
    return (
      <div className="space-y-5">

        <div>
          <div className="text-3xl font-bold text-slate-900">
            {formattedBudget}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Fixed Price Project
          </p>
        </div>

        <ApplyNow jobId={job.id} />

        <div className="pt-5 border-t text-sm text-slate-600 space-y-3">

          <div className="flex items-center gap-2">
            <BriefcaseIcon size={16} />
            {job.category || "Editing"}
          </div>

          <div className="flex items-center gap-2">
            <ClockIcon size={16} />
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </div>

          <div className="flex items-center gap-2">
            Status:
            <span className={`font-medium ${
              job.isOpen
                ? "text-green-600"
                : "text-red-600"
            }`}>
              {job.isOpen ? "Open" : "Closed"}
            </span>
          </div>

        </div>

      </div>
    )
  }

  // ============================
  // MAIN DETAILS VERSION
  // ============================
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">

      {/* Images Gallery */}
      {job?.images?.length > 0 && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {job.images.map((img, index) => (
            <div
              key={index}
              className="relative w-full h-48 rounded-xl overflow-hidden"
            >
              <Image
                src={img}
                alt="Job image"
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Header Section */}
      <div className="mb-8">

        <div className="flex items-center gap-3 mb-4">

          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
            job.isOpen
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}>
            {job.isOpen ? "Open" : "Closed"}
          </span>

          <span className="text-sm text-slate-500">
            Posted {new Date(job.createdAt).toLocaleDateString()}
          </span>

        </div>

        <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
          {job.title}
        </h1>

        {job.company && (
          <p className="text-slate-500 mt-3">
            Posted by{" "}
            <span className="font-semibold text-slate-700">
              {job.company.name}
            </span>
          </p>
        )}

      </div>

      {/* Job Meta Info */}
      <div className="flex flex-wrap gap-6 text-slate-600 border-t pt-6">

        <div className="flex items-center gap-2 font-semibold text-lg text-slate-900">
          {formattedBudget}
        </div>

        <div className="flex items-center gap-2">
          <BriefcaseIcon size={18} />
          {job.category || "Editing"}
        </div>

        <div className="flex items-center gap-2">
          <ClockIcon size={18} />
          Posted recently
        </div>

      </div>

    </div>
  )
}

export default JobDetails