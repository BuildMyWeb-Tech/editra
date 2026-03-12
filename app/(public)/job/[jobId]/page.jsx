'use client'

import JobDescription from "@/components/JobDescription";
import JobDetails from "@/components/JobDetails";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function JobPage() {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await axios.get(`/api/jobs?id=${jobId}`);

        // ✅ Remove empty images
        const cleanedJob = {
          ...data.job,
          images: data.job?.images?.filter(Boolean) || []
        };

        setJob(cleanedJob);

      } catch (error) {
        console.error("Failed to fetch job", error);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJob();
  }, [jobId]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Loading job details...
      </div>
    );

  if (!job)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-slate-500">
        Job not found
      </div>
    );

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Breadcrumb */}
        <div className="text-sm text-slate-500 mb-6">
          Home / Jobs / <span className="text-slate-700">{job.category}</span>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            <JobDetails job={job} />
            <JobDescription job={job} />
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">

                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Apply for this Job
                </h3>

                <p className="text-sm text-slate-500 mb-4">
                  Submit your proposal and start working with this client.
                </p>

                <JobDetails job={job} sidebar />

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}