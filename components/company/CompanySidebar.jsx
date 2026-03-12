'use client'
import { usePathname } from "next/navigation"
import { HomeIcon, LayoutListIcon, SquarePenIcon, SquarePlusIcon } from "lucide-react"
import Link from "next/link"

const CompanySidebar = ({ companyInfo }) => {

    const pathname = usePathname()

    const sidebarLinks = [
        { name: 'Dashboard', href: '/company', icon: HomeIcon },
        { name: 'Post Job', href: '/company/add-job', icon: SquarePlusIcon },
        { name: 'Manage Jobs', href: '/company/manage-job', icon: SquarePenIcon },
        { name: 'Applications', href: '/company/applications', icon: LayoutListIcon },
    ]

    return (
        <div className="w-64 bg-white border-r h-full flex flex-col">

            <div className="p-6 border-b">
                <h2 className="font-semibold text-slate-800">
                    {companyInfo?.name}
                </h2>
                <p className="text-xs text-slate-500">
                    Company Panel
                </p>
            </div>

            <div className="flex-1 py-4">
                {sidebarLinks.map((link, index) => (
                    <Link
                        key={index}
                        href={link.href}
                        className={`flex items-center gap-3 px-6 py-3 text-sm transition
                        ${pathname === link.href
                                ? "bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600"
                                : "text-slate-600 hover:bg-slate-50"}`}
                    >
                        <link.icon size={18} />
                        {link.name}
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default CompanySidebar