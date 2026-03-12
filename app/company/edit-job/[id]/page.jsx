'use client'

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import axios from "axios"
import { useAuth } from "@clerk/nextjs"
import { toast } from "react-hot-toast"

export default function EditJobPage() {

  const { id } = useParams()
  const router = useRouter()
  const { getToken } = useAuth()

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [budget,setBudget] = useState("")

  useEffect(() => {

  const fetchJob = async () => {

    try {

      const token = await getToken()

      const { data } = await axios.get(
        `/api/company/job?id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (!data?.job) {
        toast.error("Job not found")
        return
      }

      const job = data.job

      setTitle(job.title || "")
      setDescription(job.description || "")
      setBudget(job.budget || "")

    } catch (error) {

      console.error(error)
      toast.error("Failed to load job")

    }

  }

  if (id) fetchJob()

}, [id])

  const updateJob = async (e)=>{
    e.preventDefault()

    try{

      const token = await getToken()

      await axios.put("/api/company/job",{
        id,
        title,
        description,
        budget
      },{
        headers:{Authorization:`Bearer ${token}`}
      })

      toast.success("Job updated")

      router.push("/company/manage-job")

    }catch(error){
      toast.error(error.response?.data?.error || "Update failed")
    }
  }

  return (

    <div className="max-w-2xl mx-auto">

      <h1 className="text-2xl font-semibold mb-6">
        Edit Job
      </h1>

      <form onSubmit={updateJob} className="space-y-4">

        <input
          className="w-full border p-3 rounded"
          placeholder="Job Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <textarea
          className="w-full border p-3 rounded"
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <input
          className="w-full border p-3 rounded"
          placeholder="Budget"
          type="number"
          value={budget}
          onChange={(e)=>setBudget(e.target.value)}
        />

        <button
          className="px-5 py-2 bg-indigo-600 text-white rounded"
        >
          Update Job
        </button>

      </form>

    </div>
  )
}