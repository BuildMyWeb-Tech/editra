'use client'

import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { useAuth, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import axios from "axios"

export default function CreateCompany() {

    const { user } = useUser()
    const router = useRouter()
    const { getToken } = useAuth()

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [companyInfo, setCompanyInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        website: "",
        logo: null
    })

    const onChangeHandler = (e) => {
        setCompanyInfo({ ...companyInfo, [e.target.name]: e.target.value })
    }

    // Fetch existing company status
    const fetchCompanyStatus = async () => {
        try {

            const token = await getToken()

            const { data } = await axios.get(
                '/api/company/create',
                { headers: { Authorization: `Bearer ${token}` } }
            )

            if (["APPROVED", "REJECTED", "PENDING"].includes(data.status)) {

                setStatus(data.status)
                setAlreadySubmitted(true)

                switch (data.status) {

                    case "APPROVED":
                        setMessage("Your company request has been approved. Redirecting to dashboard...")
                        setTimeout(() => router.push("/company"), 4000)
                        break

                    case "REJECTED":
                        setMessage("Your company request was rejected. Please contact admin.")
                        break

                    case "PENDING":
                        setMessage("Your company request is pending. Please wait for admin approval.")
                        break
                }

            } else {
                setAlreadySubmitted(false)
            }

        } catch (error) {
            console.log(error)
        }

        setLoading(false)
    }

    const onSubmitHandler = async (e) => {

        e.preventDefault()

        if (!user) {
            toast.error("Please login first")
            return
        }

        try {

            const token = await getToken()

            const formData = new FormData()

            formData.append("name", companyInfo.name)
            formData.append("username", companyInfo.username)
            formData.append("description", companyInfo.description)
            formData.append("email", companyInfo.email)
            formData.append("contact", companyInfo.contact)
            formData.append("address", companyInfo.address)
            formData.append("website", companyInfo.website)
            formData.append("image", companyInfo.logo) // important

            const { data } = await axios.post(
                '/api/company/create',
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            )

            toast.success(data.message)

            fetchCompanyStatus()

        } catch (error) {

            toast.error(error?.response?.data?.error || "Something went wrong")

        }
    }

    useEffect(() => {
        if (user) fetchCompanyStatus()
    }, [user])

    if (!user) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center text-slate-500">
                <h1 className="text-3xl font-semibold">
                    Please Login to continue
                </h1>
            </div>
        )
    }

    if (loading) return <Loading />

    return (
        <>
            {!alreadySubmitted ? (

                <div className="mx-6 min-h-[70vh] my-16">

                    <form
                        onSubmit={onSubmitHandler}
                        className="max-w-3xl mx-auto flex flex-col gap-4 text-slate-600"
                    >

                        <div>
                            <h1 className="text-3xl font-semibold">
                                Add Your Company
                            </h1>
                            <p className="text-slate-500">
                                Submit your company details. Admin must approve before posting jobs.
                            </p>
                        </div>

                        {/* Logo Upload */}
                        <label className="cursor-pointer mt-6">
                            Company Logo

                            <Image
                                src={
                                    companyInfo.logo
                                        ? URL.createObjectURL(companyInfo.logo)
                                        : assets.upload_area
                                }
                                alt="logo"
                                width={120}
                                height={80}
                                className="mt-2 rounded-lg"
                            />

                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                onChange={(e) =>
                                    setCompanyInfo({
                                        ...companyInfo,
                                        logo: e.target.files[0]
                                    })
                                }
                            />
                        </label>

                        <input
                            name="username"
                            onChange={onChangeHandler}
                            value={companyInfo.username}
                            placeholder="Company Username"
                            className="border p-2 rounded"
                            required
                        />

                        <input
                            name="name"
                            onChange={onChangeHandler}
                            value={companyInfo.name}
                            placeholder="Company Name"
                            className="border p-2 rounded"
                            required
                        />

                        <textarea
                            name="description"
                            rows={4}
                            onChange={onChangeHandler}
                            value={companyInfo.description}
                            placeholder="Company Description"
                            className="border p-2 rounded"
                            required
                        />

                        <input
                            name="email"
                            type="email"
                            onChange={onChangeHandler}
                            value={companyInfo.email}
                            placeholder="Company Email"
                            className="border p-2 rounded"
                            required
                        />

                        <input
                            name="contact"
                            onChange={onChangeHandler}
                            value={companyInfo.contact}
                            placeholder="Contact Number"
                            className="border p-2 rounded"
                            required
                        />

                        <textarea
                            name="address"
                            rows={3}
                            onChange={onChangeHandler}
                            value={companyInfo.address}
                            placeholder="Company Address"
                            className="border p-2 rounded"
                            required
                        />

                        <input
                            name="website"
                            onChange={onChangeHandler}
                            value={companyInfo.website}
                            placeholder="Website (optional)"
                            className="border p-2 rounded"
                        />

                        <button
                            className="bg-slate-900 text-white py-2 rounded mt-4 hover:bg-black"
                        >
                            Submit Company Request
                        </button>

                    </form>

                </div>

            ) : (

                <div className="min-h-[70vh] flex items-center justify-center text-center">

                    <div className="max-w-xl">

                        <h2 className="text-2xl font-semibold text-slate-700">
                            {message}
                        </h2>

                        {status === "APPROVED" && (
                            <p className="text-slate-400 mt-3">
                                Redirecting to dashboard...
                            </p>
                        )}

                    </div>

                </div>

            )}
        </>
    )
}