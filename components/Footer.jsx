'use client'
import Link from "next/link";
import { Mail, Phone, Briefcase, Users, Edit3 } from "lucide-react";

const Footer = () => {
  const linkSections = [
    {
      title: "EXPLORE",
      links: [
        { text: "Browse Jobs", path: "/jobs", icon: <Briefcase size={16} className="text-indigo-500" /> },
        { text: "Find Editors", path: "/editors", icon: <Users size={16} className="text-indigo-500" /> },
        { text: "Post a Job", path: "/create-company", icon: <Edit3 size={16} className="text-indigo-500" /> },
      ]
    },
    {
      title: "COMPANY",
      links: [
        { text: "Home", path: "/", icon: null },
        { text: "Company Dashboard", path: "/company", icon: null },
        { text: "Editor Dashboard", path: "/editor", icon: null },
      ]
    },
    {
      title: "SUPPORT",
      links: [
        { text: "+1 (800) 123-4567", path: "tel:+18001234567", icon: <Phone size={16} className="text-indigo-500" /> },
        { text: "support@editra.com", path: "mailto:support@editra.com", icon: <Mail size={16} className="text-indigo-500" /> },
      ]
    }
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-12 pb-12 border-b border-gray-200">

          {/* Brand */}
          <div className="max-w-sm">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              Editra<span className="text-indigo-600">.</span>
            </Link>

            <p className="mt-5 text-sm text-gray-600 leading-relaxed">
              Editra connects businesses with professional editors worldwide.
              Post projects, review proposals, and collaborate seamlessly —
              all in one powerful platform.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10 text-sm w-full md:w-auto">
            {linkSections.map((section, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900 mb-5 tracking-wide text-sm">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, i) => (
                    <li key={i} className="flex items-center gap-2 group">
                      {link.icon}
                      <Link
                        href={link.path}
                        className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-6 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} Editra. All rights reserved.
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-indigo-600 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-indigo-600 transition-colors">
              Privacy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;