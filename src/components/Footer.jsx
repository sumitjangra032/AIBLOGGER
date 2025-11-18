import React from "react";
import { FaYoutube, FaLinkedinIn, FaInstagram, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";


const categories = [
  "Technology",
  "Travel",
  "Lifestyle",
  "Business",
  "Health",
  "Science",
];


const Footer = () => {

    function mycategory(category) {
        return (<li className="hover:text-red-500 transition" > {category}</li>);
    }

    return (
    <footer className="bg-red-50 text-xl font-semibold text-gray-600 py-12 border-t border-gray-300 mt-5 ">
        <div className="text-center flex justify-center flex-col gap-8 md:flex-row md:gap-20 md:justify-center md:text-left">
          {/* Webapp / Brand Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-600 mb-3">StoryMint</h2>
            <p className="
              text-sm text-pretty mb-4
              px-8
              md:px-0
              md:text-left
              md:max-w-[350px]
            ">
              StoryMint is your hub for the latest in digital innovation, AI, and creative insights .
              Empowering creators and businesses with valuable resources and inspiration.
            </p>

            <div className="flex justify-center gap-4 md:justify-start">
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
          <div className="md:mx-14">
            <h3 className="text-lg font-semibold text-grey-800 mb-4">Categories</h3>
            <ul className="space-y-1 text-sm">
              {categories.map((category, index) => (
                <React.Fragment key={category.id || index}>
                  {mycategory(category)}
                </React.Fragment>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div className="md:mx-5">
            <h3 className="text-lg font-semibold text-grey-800 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                    to="/terms-and-conditions"
                    className="hover:text-red-500 transition">
                    Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                    to="/privacy-policy"
                    className="hover:text-red-500 transition">
                    Privacy Policies
                </Link>
              </li>
                
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-grey-800 mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:connectdocsmedia@gmail.com" className="text-sm break-words hover:text-red-500 transition">
                  connectdocsmedia@gmail.com
                </a>
              </li>
              <li>
                <p>203 Innovation Street,<br /> Bangalore, India</p>
              </li>
              <li>
                <a href="tel:+919034817987" className="hover:text-red-500 transition">
                  +91 9034817987
                </a>
              </li>
            </ul>
          </div>
        </div>
      {/* Bottom line */}
      <div className="border-t border-gray-300 mt-10 pt-6 text-center text-sm text-grey-800">
        <p>© {new Date().getFullYear()} StoryMint. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
