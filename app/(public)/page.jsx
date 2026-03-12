import Banner from "@/components/Banner";
import LatestJobs from "@/components/LatestJobs";
import OurSpec from "@/components/OurSpec";

export default function HomePage() {
  return (
    <main className="w-full">
      {/* BANNER */}
      <Banner />

      {/* HERO SECTION */}
      <section className="w-full bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Hire Professional Editors
          </h1>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Find experienced video, photo, and content editors for your projects.
            Post jobs, review proposals, and collaborate with top professionals.
          </p>

          <div className="flex justify-center gap-4">
            <a
              href="/jobs"
              className="px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              Browse Jobs
            </a>

            <a
              href="/create-company"
              className="px-6 py-3 border border-black text-black rounded-md hover:bg-black hover:text-white transition"
            >
              Post a Job
            </a>
          </div>
        </div>
      </section>

      {/* LATEST JOBS */}
      <section className="container mx-auto px-4 py-12">
        {/* <h2 className="text-2xl font-semibold mb-6">
          Latest Editing Jobs
        </h2> */}
        <LatestJobs />
      </section>

      {/* PLATFORM SPECIFICATIONS */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <OurSpec />
        </div>
      </section>
    </main>
  );
}
