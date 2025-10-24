import React from "react";
import { FaYoutube, FaLinkedinIn, FaInstagram, FaGithub } from "react-icons/fa";

const categories = [
  "Technology",
  "Travel",
  "Lifestyle",
  "Business",
  "Health",
  "Science",
  "Entertainment",
  "Sports",
  "Food",
  "Fashion",
  "Crypto",
  "Education",
  "Environment",
  "Politics",
  "Art",
];

const Footer = () => {

    function mycategory(category) {
        return (<li className="hover:text-white transition" > {category}</li>);
    }

    return (
    <footer className="bg-[#0f172a] text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Webapp / Brand Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">StoryMint</h2>
          <p className="text-sm leading-relaxed mb-4">
            StoryMint is your hub for the latest in digital innovation, AI, and creative insights.
            Empowering creators and businesses with valuable resources and inspiration.
          </p>

          <div className="flex gap-4">
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

        {/* Categories Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((category) => mycategory(category))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <a href="mailto:connectdocsmedia@gmail.com" className="hover:text-white transition">
                connectdocsmedia@gmail.com
              </a>
            </li>
            <li>
              <p>203 Innovation Street,<br /> Bangalore, India</p>
            </li>
            <li>
              <a href="tel:+911234567890" className="hover:text-white transition">
                +91 9034817987
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} StoryMint. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
