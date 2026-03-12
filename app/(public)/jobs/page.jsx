'use client'
import { Suspense, useState, useEffect } from "react"
import JobCard from "@/components/JobCard"
import {
  MoveLeftIcon,
  FilterIcon,
  SlidersHorizontalIcon,
  Search,
  BriefcaseIcon
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

function JobsContent() {
  const searchParams = useSearchParams()
  const search = searchParams.get('search') || ''
  const router = useRouter()

  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('newest')

  // ✅ Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs')
        if (!res.ok) throw new Error('Failed to fetch jobs')
        const data = await res.json()

        if (Array.isArray(data)) setJobs(data)
        else if (data?.jobs) setJobs(data.jobs)
        else setJobs([])

      } catch (err) {
        console.error(err)
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // ✅ Filter by search (using title now)
  const filteredJobs = jobs.filter(job =>
    search
      ? job.title?.toLowerCase().includes(search.toLowerCase())
      : true
  )

  // ✅ Sort
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.budget - b.budget
      case 'price-high':
        return b.budget - a.budget
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-[70vh] mx-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center my-6">
          <h1
            onClick={() => router.push('/jobs')}
            className="text-2xl text-slate-500 flex items-center gap-2 cursor-pointer"
          >
            {search && <MoveLeftIcon size={20} />}
            {search
              ? `Search: "${search}"`
              : <span>All <span className="text-slate-700 font-medium">Jobs</span></span>
            }
          </h1>

          <div className="hidden md:flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-slate-200 py-2 px-4 rounded-lg text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Budget: Low to High</option>
              <option value="price-high">Budget: High to Low</option>
            </select>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const value = formData.get('search')
              router.push(`/jobs?search=${value}`)
            }}
            className="relative"
          >
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Search jobs..."
              className="w-full bg-slate-100 border py-2 pl-10 pr-4 rounded-lg text-sm"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              <Search size={16} />
            </div>
          </form>
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="flex justify-center py-20">Loading jobs...</div>
        ) : sortedJobs.length > 0 ? (
          <>
            <p className="text-sm text-slate-600 mb-4">
              Showing {sortedJobs.length} jobs
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-32">
              {sortedJobs.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center py-16 text-center">
            <BriefcaseIcon className="w-10 h-10 text-slate-400 mb-4" />
            <h3 className="text-lg font-medium text-slate-800">
              No jobs found
            </h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Loading...</div>}>
      <JobsContent />
    </Suspense>
  )
}