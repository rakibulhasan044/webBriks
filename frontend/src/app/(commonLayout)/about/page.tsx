import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | ZenBoard",
  description: "Learn more about our mission and the team behind ZenBoard.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-slate-900 sm:text-5xl tracking-tight mb-6">
          Empowering Teams to Do Their Best Work
        </h1>
        <p className="text-lg text-slate-500 leading-relaxed">
          At ZenBoard, we believe that project management shouldn't feel like a chore. 
          Our mission is to create a seamless, intuitive, and delightful experience for teams 
          of all sizes to collaborate and achieve their goals.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
        <div className="bg-slate-100 rounded-3xl h-[400px] w-full flex items-center justify-center">
          <span className="text-slate-400 font-medium">Illustration</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
          <div className="space-y-4 text-slate-600 leading-relaxed">
            <p>
              ZenBoard started as a small internal tool built out of frustration with overly 
              complex project management software. We wanted something that was as powerful as 
              the big players but as easy to use as a simple to-do list.
            </p>
            <p>
              After sharing it with a few friends and seeing how much it helped their teams, 
              we decided to polish it up and share it with the world. Today, ZenBoard helps 
              thousands of teams stay organized and focused on what really matters.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-indigo-50 rounded-3xl p-8 md:p-16 mb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Our Core Values</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Simplicity", desc: "We design with clarity in mind, stripping away the unnecessary." },
            { title: "Collaboration", desc: "Great things are never done by one person. They're done by a team." },
            { title: "Performance", desc: "Your tools should never slow you down. Speed is a feature." }
          ].map((value, i) => (
            <div key={i} className="bg-slate-50 p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
              <p className="text-slate-500">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
