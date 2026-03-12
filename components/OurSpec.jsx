'use client'

import { Shield, Users, Clock } from "lucide-react";

export default function OurSpec() {
  const specs = [
    {
      icon: <Users size={24} className="text-green-600" />,
      title: "Verified Editors",
      description: "All editors are verified professionals with real portfolios."
    },
    {
      icon: <Shield size={24} className="text-green-600" />,
      title: "Secure Hiring",
      description: "Safe platform to hire editors and protect your project."
    },
    {
      icon: <Clock size={24} className="text-green-600" />,
      title: "Fast Delivery",
      description: "Collaborate and get your edits done on time."
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      {specs.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition">
          {item.icon}
          <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
          <p className="text-gray-500 text-sm">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
