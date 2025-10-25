import React from "react";
import { FaYoutube, FaLinkedinIn, FaInstagram, FaGithub } from "react-icons/fa";


export default function AboutUs() {
  const teamMembers = [
    {
      name: "Sumit Jangra",
      role: "Founder & CEO",
      image: "/AboutUs/sumit_linkedin_profile_image.png",
      bio: "Visionary behind StoryMint, passionate about bringing stories to life.",
    },
    {
      name: "Ishita Kapoor",
      role: "Content Head",
      image: "/AboutUs/ishitakapoor.png",
      bio: "Curates and manages high-quality blogs across categories.",
    },
    {
      name: "Rohan Mehta",
      role: "Lead Developer",
      image: "/AboutUs/RohanMehta.png",
      bio: "Ensures smooth functionality and real-time updates across the platform.",
    },
    {
      name: "Priya Verma",
      role: "UI/UX Designer",
      image: "/AboutUs/Priyaverma.png",
      bio: "Crafts an engaging and user-friendly interface for readers and bloggers.",
    },
    {
      name: "Siddharth Rao",
      role: "Marketing & Community",
      image: "/AboutUs/SidharthRao.png",
      bio: "Builds the StoryMint community and spreads the word about new content.",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-sky-50 to-blue-100 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Header */}
        <div>
            <h2 className="text-4xl font-bold mb-4 text-slate-800">
            About StoryMint: Cultivating Insight, Connecting Minds
            </h2>

            <p className="text-lg text-slate-600 mb-8">
            StoryMint was conceived from a singular insight: that in a world saturated with digital information, the demand for **quality, depth, and genuine expertise** is higher than ever. We are not just a content aggregator; we are a meticulously engineered platform dedicated to fostering a trustworthy ecosystem where high-caliber ideas flourish and discerning audiences connect directly with influential thought leaders.
            </p>

            <h3 className="text-3xl font-semibold mb-3 text-slate-700">
            Our Foundational Vision and Commitment to Quality
            </h3>
            <p className="text-lg text-slate-600 mb-6">
            Our vision extends beyond passive reading. We aim to be the definitive platform for intellectual discovery—a place where every visit yields new knowledge, sparks professional growth, and inspires personal curiosity. We empower creators who prioritize meticulous research and articulate expression, and we serve readers who demand content that is both valuable and verified.
            </p>

            <p className="text-lg font-medium text-slate-700 mb-3">
            The StoryMint content library spans critical and dynamic fields:
            </p>
            <ul className="list-disc list-inside text-lg text-slate-600 ml-4 mb-8 space-y-1">
            <li>**Technology & Innovation:** Deep analysis of emerging tech, market disruption, and digital transformation.</li>
            <li>**Business & Economics:** Actionable strategies, macroeconomic trends, and leadership development.</li>
            <li>**Science & Research:** Accessible explanations of complex scientific breakthroughs and their real-world implications.</li>
            <li>**Health & Wellness:** Credible, evidence-based approaches to holistic well-being.</li>
            <li>**Travel & Culture:** Immersive narratives and insightful commentary on global society.</li>
            </ul>

            <h3 className="text-3xl font-semibold mb-3 text-slate-700">
            Engineered for the Professional User
            </h3>
            <p className="text-lg text-slate-600 mb-6">
            We recognize that our users—both readers and creators—are professionals who value efficiency, security, and personalization. The platform's architecture is designed to deliver a seamless, intuitive, and secure experience.
            </p>

            <h3 className="text-3xl font-semibold mb-3 text-slate-700">
            Join the StoryMint Community
            </h3>
            <p className="text-lg text-slate-600 mb-8">
            By setting an unwavering standard for editorial excellence and providing a professional-grade platform, StoryMint is actively cultivating the next generation of engaged readers and respected writers. We invite you to explore our categories, utilize our resources, and become part of a community committed to the enduring power of the written word.
            </p>
            <p className="text-xl font-bold text-slate-800 italic">
            StoryMint: Elevating the Discourse. Shaping Tomorrow’s Narrative.
            </p>
        </div>

        {/* Features */}
        {/* <div className="grid md:grid-cols-2 gap-6 mb-12 text-left">
          {features.map((feature, idx) => (
            <div key={idx} className="flex items-start space-x-3">
              <div className="text-sky-500 mt-1">✓</div>
              <p className="text-slate-700">{feature}</p>
            </div>
          ))}
        </div> */}

        {/* Team Section */}
        <h3 className="pt-20 text-3xl font-semibold mb-8 text-slate-800">Meet Our Team</h3>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mb-4 object-cover"
              />
              <h4 className="text-lg font-bold text-slate-800">{member.name}</h4>
              <p className="text-sky-500 font-semibold mb-2">{member.role}</p>
              <p className="text-slate-600 text-sm">{member.bio}</p>
            </div>
          ))}
        </div>

        {/* Contact / Social Links */}
        <div className="mt-12">
          <p className="text-slate-600 mb-2">Connect with us:</p>
          <div className="flex gap-4 justify-center">
            <a
                href="https://www.linkedin.com/in/sumit-jangra-765b7024a/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="hover:text-blue-400 transition-colors"
            >
                <FaLinkedinIn size={24} />
            </a>

            <a
                href="https://www.instagram.com/sumit_rajotia?igsh=ejltc3RqdWNnaWth/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-pink-500 transition-colors"
            >
                <FaInstagram size={24} />
            </a>

            <a
                href="https://www.youtube.com/@sumit.rajotiaa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="hover:text-red-500 transition-colors"
            >
                <FaYoutube size={24} />
            </a>

            <a
                href="https://github.com/sumitjangra032/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="hover:text-gray-800 transition-colors"
            >
                <FaGithub size={24} />
            </a>
            </div>
        </div>
      </div>
    </section>
  );
}
