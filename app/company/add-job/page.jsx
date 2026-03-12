'use client'

import { assets } from "@/assets/assets"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"

export default function CompanyAddJob() {

  const { getToken } = useAuth()

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null
  })

  const [jobInfo, setJobInfo] = useState({
    title: "",
    description: "",
    budget: ""
  })

  const [loading, setLoading] = useState(false)

  const onChangeHandler = (e) => {
    setJobInfo({ ...jobInfo, [e.target.name]: e.target.value })
  }

  const handleImageUpload = (key, file) => {
    setImages(prev => ({ ...prev, [key]: file }))
  }

  const onSubmitHandler = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const formData = new FormData();

    formData.append("title", jobInfo.title);
    formData.append("description", jobInfo.description);
    formData.append("budget", jobInfo.budget);

    Object.keys(images).forEach((key) => {
      if (images[key]) {
        formData.append("images", images[key]);
      }
    });

    const token = await getToken();

    const { data } = await axios.post(
      "/api/company/job",   // ✅ FIXED ENDPOINT
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    toast.success(data.message || "Job posted successfully");

    setJobInfo({ title: "", description: "", budget: "" });
    setImages({ 1: null, 2: null, 3: null, 4: null });

  } catch (error) {
    toast.error(error?.response?.data?.error || error.message);
  } finally {
    setLoading(false);
  }
};

  return (
    <form
      onSubmit={onSubmitHandler}
      className="text-slate-500 mb-28"
    >
      <h1 className="text-2xl">
        Post a New <span className="text-slate-800 font-medium">Job</span>
      </h1>

      <p className="mt-7">
        Reference Images <span className="text-sm">(optional)</span>
      </p>

      <div className="flex gap-3 mt-4">
        {Object.keys(images).map((key) => (
          <label key={key} htmlFor={`images${key}`}>
            <Image
              width={300}
              height={300}
              className="h-15 w-auto border border-slate-200 rounded cursor-pointer"
              src={
                images[key]
                  ? URL.createObjectURL(images[key])
                  : assets.upload_area
              }
              alt=""
            />
            <input
              type="file"
              accept="image/*"
              id={`images${key}`}
              onChange={(e) => handleImageUpload(key, e.target.files[0])}
              hidden
            />
          </label>
        ))}
      </div>

      <label className="flex flex-col gap-2 my-6">
        Job Title
        <input
          type="text"
          name="title"
          onChange={onChangeHandler}
          value={jobInfo.title}
          placeholder="e.g. Professional Video Editor Needed"
          className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded"
          required
        />
      </label>

      <label className="flex flex-col gap-2 my-6">
        Work Description
        <textarea
          name="description"
          onChange={onChangeHandler}
          value={jobInfo.description}
          placeholder="Describe the work, expectations, deadline, etc."
          rows={5}
          className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none"
          required
        />
      </label>

      <label className="flex flex-col gap-2 my-6">
        Budget (₹)
        <input
          type="number"
          name="budget"
          onChange={onChangeHandler}
          value={jobInfo.budget}
          placeholder="e.g. 150"
          className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded"
          required
        />
      </label>

      <button
        disabled={loading}
        className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition"
      >
        {loading ? "Posting Job..." : "Post Job"}
      </button>
    </form>
  )
}
