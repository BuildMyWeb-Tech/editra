'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import CompanyNavbar from "./CompanyNavbar"
import CompanySidebar from "./CompanySidebar"
import { useAuth } from "@clerk/nextjs"
import axios from "axios"

const CompanyLayout = ({ children }) => {

    const { getToken } = useAuth()

    const [isCompany, setIsCompany] = useState(false)
    const [loading, setLoading] = useState(true)
    const [companyInfo, setCompanyInfo] = useState(null)

    const fetchCompany = async () => {
    try {
        const token = await getToken()

        const { data } = await axios.get(
            '/api/company/is-seller',
            { headers: { Authorization: `Bearer ${token}` }}
        )

        setIsCompany(data.isSeller)
        setCompanyInfo(data.companyInfo)

    } catch (error) {
        console.log(error)
    }
    finally{
        setLoading(false)
    }
}

    useEffect(() => {
        fetchCompany()
    }, [])

    return loading ? (
        <Loading />
    ) : isCompany ? (
        <div className="flex flex-col h-screen">
            <CompanyNavbar companyInfo={companyInfo} />
            <div className="flex flex-1 h-full overflow-hidden">
                <CompanySidebar companyInfo={companyInfo} />
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                    {children}
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">
                You are not authorized to access this page
            </h1>
            <Link
                href="/"
                className="bg-slate-800 text-white flex items-center gap-2 mt-8 p-2 px-6 rounded-full"
            >
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default CompanyLayout