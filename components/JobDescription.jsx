'use client'

import Image from "next/image"
import Link from "next/link"

const JobDescription = ({ job }) => {
  const company = job?.company

  return (
    <div className="space-y-10">

      {/* Description */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">
          Job Description
        </h2>

        <p className="text-slate-600 leading-relaxed whitespace-pre-line">
          {job?.description}
        </p>

        <div className="mt-8">
          <h3 className="font-semibold text-slate-800 mb-3">
            Requirements
          </h3>

          <ul className="list-disc pl-6 space-y-2 text-slate-600">
            <li>Professional editing experience</li>
            <li>Strong portfolio required</li>
            <li>Ability to meet deadlines</li>
            <li>Clear communication skills</li>
          </ul>
        </div>
      </div>

      {/* Company Card */}
      {company && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-start gap-5">

          <Image
            src={company.logo || "/company-placeholder.png"}
            alt={company.name || "Company logo"}
            width={80}
            height={80}
            className="rounded-xl object-cover"
          />

          <div className="flex-1">
            <h4 className="text-lg font-semibold text-slate-900">
              {company.name}
            </h4>

            <p className="text-sm text-slate-500 mb-3">
              Verified Company
            </p>

            {company.username && (
              <Link
                href={`/company/${company.username}`}
                className="inline-block text-sm font-medium text-green-600 hover:text-green-700 transition"
              >
                View Company Profile →
              </Link>
            )}
          </div>

        </div>
      )}

    </div>
  )
}

export default JobDescription