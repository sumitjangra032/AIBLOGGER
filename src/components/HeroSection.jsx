import React, { useEffect, useState, useRef } from "react";

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

// Randomly pick 10 images with associated categories
const getRandomImages = () => {
  const allImages = [];
  

  categories.forEach((category) => {
    for (let i = 1; i <= 5; i++) {
      const randomIndex = Math.floor(Math.random() * 100) + 1;

      allImages.push({
        src: `/images/${category}/${category}_${randomIndex}.jpg`,
        category,
      });
    }
  });
  const shuffled = allImages.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 10);
};

const categories_quotes = [
  {
    name: "Technology",
    description:
      "Discover the latest innovations redefining our digital future — from AI breakthroughs and robotics to smart gadgets and software trends. Stay ahead with expert insights, detailed reviews, and the tech stories shaping tomorrow's world."
  },
  {
    name: "Travel",
    description:
      "Embark on breathtaking journeys across continents, uncover hidden gems, and immerse yourself in diverse cultures. From travel guides and itineraries to budget tips and wanderlust inspiration — explore the world, one destination at a time."
  },
  {
    name: "Lifestyle",
    description:
      "Find inspiration to live a balanced, stylish, and fulfilling life. Explore topics on self-care, productivity, fashion, and mindfulness — everything that helps you create a lifestyle that reflects your personality and purpose."
  },
  {
    name: "Business",
    description:
      "Stay updated with in-depth insights on entrepreneurship, startups, leadership, and corporate strategy. Learn how industry experts build success stories, adapt to market changes, and transform innovative ideas into thriving ventures."
  },
  {
    name: "Health",
    description:
      "Your go-to source for fitness, nutrition, and mental well-being. Learn how to maintain a balanced lifestyle with healthy habits, expert advice, and science-backed tips to help you live a happier, healthier life every day."
  },
  {
    name: "Science",
    description:
      "Dive deep into the wonders of discovery — from space exploration and physics to medical advancements and cutting-edge research. Explore how science continues to expand the boundaries of what we know about the universe."
  },
  {
    name: "Entertainment",
    description:
      "Stay in tune with the latest in movies, web series, music, and pop culture. Get reviews, celebrity news, and trending updates that keep you entertained and connected to the ever-evolving world of showbiz."
  },
  {
    name: "Sports",
    description:
      "Follow the action from your favorite games, teams, and athletes around the world. From live match updates and analysis to inspiring stories of victory — experience the thrill and passion that fuel global sports culture."
  },
  {
    name: "Food",
    description:
      "Explore a world of flavors through mouthwatering recipes, restaurant reviews, and culinary adventures. Learn cooking tips, discover food trends, and experience the joy of creating and savoring delicious dishes."
  },
  {
    name: "Fashion",
    description:
      "Unveil the latest trends, timeless styles, and fashion-forward inspirations. From streetwear to haute couture, learn how to express yourself through style, accessorizing, and confident dressing for every occasion."
  },
  {
    name: "Crypto",
    description:
      "Understand the evolving landscape of digital currencies, blockchain, and decentralized finance. Stay informed with news, guides, and expert analysis on how cryptocurrency is reshaping the global economy."
  },
  {
    name: "Education",
    description:
      "Expand your knowledge with insights into learning, career development, and personal growth. Discover modern education trends, online learning platforms, and resources that empower lifelong learners to thrive."
  },
  {
    name: "Environment",
    description:
      "Explore sustainability, renewable energy, and climate change awareness. Learn how small actions can make a big difference in protecting our planet and building a greener, more responsible future for generations to come."
  },
  {
    name: "Politics",
    description:
      "Stay informed about global affairs, government policies, and political movements shaping the world. Get balanced perspectives, detailed analysis, and thought-provoking insights into the decisions that impact society."
  },
  {
    name: "Art",
    description:
      "Celebrate creativity through visual arts, photography, music, and design. Discover inspiring artists, their stories, and how art continues to influence culture, emotion, and human connection across the globe."
  }
];


const HeroCarousel = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    setImages(getRandomImages());
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Swipe support
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) handleNext(); // swipe left
    if (touchStartX.current - touchEndX.current < -50) handlePrev(); // swipe right
  };

  if (!images.length) return null;

  return (
    <div
      className="relative w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel wrapper */}
      <div className="relative h-96 md:h-[800px] overflow-hidden rounded-lg pb-20">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={img.src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            {/* Category overlay */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white px-4 py-2">
            <h2 className="text-4xl font-bold mb-2">
                {img.category[0].toUpperCase() + img.category.slice(1)}
            </h2>
            <p className="text-lg font-medium text-white">
                {categories_quotes.find(cq => cq.name.toLowerCase() === img.category.toLowerCase())?.description || ""}
            </p>
            </div>

          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center">
        <button
          onClick={handlePrev}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 ml-2"
          aria-label="Previous slide"
        >
          &#10094;
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 flex items-center">
        <button
          onClick={handleNext}
          className="bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 mr-2"
          aria-label="Next slide"
        >
          &#10095;
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full focus:outline-none ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
