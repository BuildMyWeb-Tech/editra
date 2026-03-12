'use client'

import React, { useEffect, useState } from 'react'
import Title from './Title'
import JobCard from './JobCard'
import { ArrowRight, Clock } from 'lucide-react'
import Link from 'next/link'

const LatestJobs = () => {
  const displayQuantity = 4
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs')
        if (!res.ok) throw new Error('Failed to fetch jobs')

        const data = await res.json()

        if (Array.isArray(data)) setJobs(data)
        else if (data?.jobs) setJobs(data.jobs)
        else setJobs([])

      } catch (error) {
        console.error(error)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  const sortedJobs = [...jobs].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <Title
          title={
            <div className="flex items-center gap-2">
              <Clock className="text-blue-500" size={24} />
              Latest Jobs
            </div>
          }
          description={`Showing ${Math.min(displayQuantity, sortedJobs.length)} of ${sortedJobs.length} jobs`}
        />

        <Link
          href="/jobs"
          className="hidden sm:flex items-center text-slate-700 hover:text-slate-900 transition-colors font-medium text-sm"
        >
          View All <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {!loading &&
          sortedJobs
            .slice(0, displayQuantity)
            .map((job) => <JobCard key={job.id} job={job} />)}
      </div>
    </div>
  )
}

export default LatestJobs