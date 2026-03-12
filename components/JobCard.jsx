'use client'

import { BriefcaseIcon, Clock, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import ApplyNow from '@/components/ApplyNow'

const JobCard = ({ job }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '₹'
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <div className="group relative block transform transition-all duration-300 hover:-translate-y-1">
      <div className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300">

        <Link href={`/job/${job.id}`}>
          <div className="h-48 sm:h-56 w-full relative bg-slate-100 flex items-center justify-center cursor-pointer">
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-200 to-slate-300 animate-pulse" />
            )}

            <Image
              src={job.images?.[0] || '/placeholder-job.png'}
              alt={job.title}
              width={500}
              height={500}
              className={`max-h-40 object-contain transition-opacity duration-500 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
            />

            {job.isOpen && (
              <div className="absolute top-3 left-3 bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1">
                <CheckCircle size={12} /> Open
              </div>
            )}
          </div>
        </Link>

        <div className="p-4">
          <Link href={`/job/${job.id}`}>
            <h3 className="font-medium text-sm sm:text-base text-slate-800 line-clamp-2 min-h-[2.5rem] mb-1 cursor-pointer">
              {job.title}
            </h3>
          </Link>

          {job.description && (
            <p className="text-xs text-slate-600 line-clamp-2 mb-2">
              {job.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2">
           
            <p className="font-semibold text-base text-slate-900">
  {job?.budget && !isNaN(job.budget)
    ? `${currency}${Number(job.budget).toLocaleString()}`
    : "Budget not specified"}
</p>
            <span className="text-xs text-slate-500">Budget</span>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
            <BriefcaseIcon size={14} />
            Editing
            <span className="mx-1">•</span>
            <Clock size={14} />
            Recently posted
          </div>

          <div className="mt-4">
            <ApplyNow jobId={job.id} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobCard