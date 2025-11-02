import { useStore } from "../services/store";
import { useEffect } from "react";
import { FaYoutube, FaLinkedinIn, FaInstagram, FaGithub } from "react-icons/fa";

export default function AboutUs() {
  const { setIsSearchDisabled } = useStore();

  useEffect(() => {
    setIsSearchDisabled(true);
    return () => setIsSearchDisabled(false);
  }, [setIsSearchDisabled]);

  const team = [
    {
      name: "Sumit Jangra",
      role: "Founder & CEO",
      image: "/AboutUs/sumit_linkedin_profile_image.png",
      bio: "Visionary behind StoryMint, passionate about bringing stories to life."
    },
    {
      name: "Ishita Kapoor",
      role: "Content Head",
      image: "/AboutUs/ishitakapoor.png",
      bio: "Curates and manages high-quality blogs across categories."
    },
    {
      name: "Rohan Mehta",
      role: "Lead Developer",
      image: "/AboutUs/RohanMehta.png",
      bio: "Ensures smooth functionality and real-time updates across the platform."
    },
    {
      name: "Priya Verma",
      role: "UI/UX Designer",
      image: "/AboutUs/Priyaverma.png",
      bio: "Crafts an engaging and user-friendly interface for readers and bloggers."
    },
    {
      name: "Siddharth Rao",
      role: "Marketing & Community",
      image: "/AboutUs/SidharthRao.png",
      bio: "Builds the StoryMint community and spreads the word about new content."
    }
  ];

  return (
    <div className="w-full flex flex-col items-center text-gray-800">
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-5xl font-semibold mb-6">
          About StoryMint
        </h1>

        <p className="text-sm md:text-lg leading-relaxed max-w-3xl mx-auto">
          StoryMint was conceived from a singular insight: that in a world saturated with
          digital information, the demand for quality, depth, and genuine expertise is higher
          than ever. We empower creators who prioritize meticulous research and articulate
          expression, and serve readers who demand content that is valuable and verified.
        </p>
      </section>

      <section className="w-full bg-gray-50 py-14">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-4xl font-semibold mb-6">
            Our Mission & Vision
          </h2>

          <p className="text-sm md:text-lg leading-relaxed">
            We aim to be the definitive platform for intellectual discovery—a place where every
            visit yields new knowledge, sparks professional growth, and inspires personal
            curiosity. Our library spans Technology, Business, Science, Wellness, and Travel.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-center text-2xl md:text-4xl font-semibold mb-10">
          Meet Our Team
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-10 justify-items-center">
          {team.map((member, i) => (
            <div
              key={i}
              className="w-full max-w-[260px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
              />

              <h3 className="text-lg font-semibold">{member.name}</h3>
              <p className="text-sm text-indigo-600 font-medium mb-2">{member.role}</p>
              <p className="text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="pb-16 text-center">
        <p className="text-gray-600 mb-3">Connect with us:</p>

        <div className="flex gap-4 justify-center">
          <a
            href="https://www.linkedin.com/in/sumit-jangra-765b7024a/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-blue-500 transition-colors"
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
            className="hover:text-gray-900 transition-colors"
          >
            <FaGithub size={24} />
          </a>
        </div>
      </div>
    </div>
  );
}
