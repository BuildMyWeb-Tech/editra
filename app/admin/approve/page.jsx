'use client'

import StoreInfo from "@/components/admin/StoreInfo" // reused
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function AdminApproveCompanies() {
  const { user } = useUser()
  const { getToken } = useAuth()

  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch pending companies (still using approve-store API internally)
  const fetchCompanies = async () => {
    try {
      const token = await getToken()
      const { data } = await axios.get(
        "/api/admin/approve-store",
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCompanies(data.stores) // rename later in backend
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApproval = async ({ companyId, status }) => {
    try {
      const token = await getToken()
      const { data } = await axios.post(
        "/api/admin/approve-store", // TEMP
        { storeId: companyId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      toast.success(data.message)
      fetchCompanies()
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    }
  }

  useEffect(() => {
    if (user) fetchCompanies()
  }, [user])

  if (loading) return <Loading />

  return (
    <div className="text-slate-500 mb-28">
      <h1 className="text-2xl">
        Approve <span className="text-slate-800 font-medium">Companies</span>
      </h1>

      {companies.length ? (
        <div className="flex flex-col gap-4 mt-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex max-md:flex-col gap-4 md:items-end max-w-4xl"
            >
              {/* Company Info (UI reused) */}
              <StoreInfo store={company} />

              {/* Approval Actions */}
              <div className="flex gap-3 pt-2 flex-wrap">
                <button
                  onClick={() =>
                    toast.promise(
                      handleApproval({
                        companyId: company.id,
                        status: "approved",
                      }),
                      { loading: "Approving company..." }
                    )
                  }
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    toast.promise(
                      handleApproval({
                        companyId: company.id,
                        status: "rejected",
                      }),
                      { loading: "Rejecting company..." }
                    )
                  }
                  className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center h-80">
          <h1 className="text-3xl text-slate-400 font-medium">
            No company approvals pending
          </h1>
        </div>
      )}
    </div>
  )
}