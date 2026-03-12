'use client'

import { useUser } from "@clerk/nextjs"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

export default function ProfilePage() {

const { user, isLoaded } = useUser()
const router = useRouter()

const [loading,setLoading] = useState(true)
const [saving,setSaving] = useState(false)

const [name,setName] = useState("")

const [profile,setProfile] = useState({
phone:"",
skills:[],
experience:"",
portfolio:"",
youtube:"",
instagram:"",
software:[],
resume:null,
resumeUrl:""
})

useEffect(()=>{

if(!isLoaded) return
if(!user) return router.push("/")

setName(user?.fullName || "")
console.log(user.fullName)

const fetchProfile = async ()=>{

  try{

    const {data} = await axios.get("/api/editor/profile")

    if(data.profile){

      setProfile({
        phone:data.profile.phone || "",
        skills:data.profile.skills || [],
        experience:data.profile.experience || "",
        portfolio:data.profile.portfolio || "",
        youtube:data.profile.youtube || "",
        instagram:data.profile.instagram || "",
        software:data.profile.software || [],
        resume:null,
        resumeUrl:data.profile.resumeUrl || ""
      })

    }

  }catch(err){

    toast.error("Failed to load profile")

  }finally{

    setLoading(false)

  }

}

fetchProfile()

},[isLoaded,user,router])


const handleChange = (e)=>{

const {name,value} = e.target
setProfile(prev=>({...prev,[name]:value}))

}

const handleSkillsChange = (e)=>{

setProfile(prev=>({
...prev,
skills:e.target.value.split(",").map(s=>s.trim())
}))

}

const handleSoftwareChange = (e)=>{

setProfile(prev=>({
...prev,
software:e.target.value.split(",").map(s=>s.trim())
}))

}

const handleResumeUpload = (e)=>{

setProfile(prev=>({...prev,resume:e.target.files[0]}))

}


const handleSave = async ()=>{

try{

setSaving(true)

if(name !== user.fullName){

const parts = name.split(" ")

await user.update({
firstName:parts[0] || "",
lastName:parts.slice(1).join(" ") || ""
})

}

const formData = new FormData()

formData.append("phone",profile.phone)
formData.append("experience",profile.experience)
formData.append("portfolio",profile.portfolio)
formData.append("youtube",profile.youtube)
formData.append("instagram",profile.instagram)

formData.append("skills",JSON.stringify(profile.skills))
formData.append("software",JSON.stringify(profile.software))

if(profile.resume){
formData.append("resume",profile.resume)
}

await axios.post("/api/editor/profile",formData)

toast.success("Profile updated successfully")

router.push("/jobs")

}catch(err){

toast.error("Failed to update profile")

}finally{

setSaving(false)

}

}

if(loading) return <div className="p-10 text-center">Loading profile...</div>

return (

<div className="max-w-4xl mx-auto p-6">

<h1 className="text-3xl font-semibold mb-8">
Editor Profile
</h1>

<div className="bg-white shadow-xl rounded-xl p-8 space-y-6">

{/* BASIC INFO */}

<div className="grid md:grid-cols-2 gap-6">

<div>
<label className="text-sm text-gray-600">Name</label>

<input
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full border rounded px-3 py-2"
/>

</div>

<div>

<label className="text-sm text-gray-600">Email</label>

<input
value={user?.emailAddresses?.[0]?.emailAddress || ""}
readOnly
className="w-full border rounded px-3 py-2 bg-gray-100"
/>

</div>

</div>


{/* PHONE */}

<div>

<label className="text-sm text-gray-600">
Phone Number
</label>

<input
name="phone"
value={profile.phone}
onChange={handleChange}
className="w-full border rounded px-3 py-2"
placeholder="+91 9876543210"
/>

</div>


{/* SKILLS */}

<div>

<label className="text-sm text-gray-600">
Skills (comma separated)
</label>

<input
value={profile.skills.join(", ")}
onChange={handleSkillsChange}
className="w-full border rounded px-3 py-2"
placeholder="Premiere Pro, After Effects, Color Grading"
/>

</div>


{/* SOFTWARE */}

<div>

<label className="text-sm text-gray-600">
Editing Software
</label>

<input
value={profile.software.join(", ")}
onChange={handleSoftwareChange}
className="w-full border rounded px-3 py-2"
placeholder="Premiere Pro, DaVinci Resolve"
/>

</div>


{/* EXPERIENCE */}

<div>

<label className="text-sm text-gray-600">
Experience
</label>

<textarea
name="experience"
value={profile.experience}
onChange={handleChange}
rows={4}
className="w-full border rounded px-3 py-2"
placeholder="Describe your editing experience..."
/>

</div>


{/* PORTFOLIO */}

<div>

<label className="text-sm text-gray-600">
Portfolio Website
</label>

<input
name="portfolio"
value={profile.portfolio}
onChange={handleChange}
className="w-full border rounded px-3 py-2"
placeholder="https://yourportfolio.com"
/>

</div>


{/* YOUTUBE */}

<div>

<label className="text-sm text-gray-600">
YouTube Channel
</label>

<input
name="youtube"
value={profile.youtube}
onChange={handleChange}
className="w-full border rounded px-3 py-2"
/>

</div>


{/* INSTAGRAM */}

<div>

<label className="text-sm text-gray-600">
Instagram
</label>

<input
name="instagram"
value={profile.instagram}
onChange={handleChange}
className="w-full border rounded px-3 py-2"
/>

</div>


{/* RESUME */}

<div>

<label className="text-sm text-gray-600">
Resume (PDF)
</label>

<input
type="file"
accept=".pdf"
onChange={handleResumeUpload}
className="block mt-2"
/>

{profile.resumeUrl && (

<a
href={profile.resumeUrl}
target="_blank"
className="text-blue-600 text-sm block mt-2"
>
View uploaded resume
</a>

)}

</div>


<button
onClick={handleSave}
disabled={saving}
className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
>
{saving ? "Saving..." : "Save Profile"}
</button>

</div>

</div>

)

}