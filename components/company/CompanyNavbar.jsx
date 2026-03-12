'use client'
import { useUser, UserButton } from "@clerk/nextjs"
import Link from "next/link"

const CompanyNavbar = ({ companyInfo }) => {

    const { user } = useUser()

    return (
        <div className="flex items-center justify-between px-10 py-4 border-b bg-white">
            <Link href="/company" className="text-2xl font-bold text-slate-800">
                Editra<span className="text-indigo-600">Hub</span>
            </Link>

            <div className="flex items-center gap-4">
                <p className="text-sm text-slate-600">
                    {companyInfo?.name}
                </p>
                <UserButton />
            </div>
        </div>
    )
}

export default CompanyNavbar