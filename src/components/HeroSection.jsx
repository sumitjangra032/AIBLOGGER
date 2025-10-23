import React, { useEffect, useState, useRef } from "react";

const categories = ["technology", "travel", "lifestyle"]; // your categories

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
  { name: "Technology", description: "Discover the latest trends, gadgets, and innovations shaping our world." },
  { name: "Travel", description: "Embark on journeys and explore breathtaking destinations around the globe." },
  { name: "Lifestyle", description: "Get tips, trends, and inspiration for a vibrant and fulfilling life." },
  { name: "Business", description: "Stay updated with strategies, insights, and success stories in the business world." },
  { name: "Health", description: "Learn about wellness, fitness, and healthy living for a better you." },
  { name: "Science", description: "Dive into discoveries, research, and fascinating scientific breakthroughs." },
  { name: "Entertainment", description: "Catch up on movies, music, shows, and everything pop culture." },
  { name: "Sports", description: "Follow games, athletes, and exciting sports updates from around the world." },
  { name: "Food", description: "Explore delicious recipes, culinary tips, and gastronomic adventures." },
  { name: "Fashion", description: "Stay ahead with trends, styling tips, and iconic fashion statements." },
  { name: "Crypto", description: "Understand the world of cryptocurrencies, blockchain, and digital finance." },
  { name: "Education", description: "Access learning resources, insights, and knowledge to grow your mind." },
  { name: "Environment", description: "Learn about sustainability, climate change, and eco-friendly living." },
  { name: "Politics", description: "Stay informed about global politics, policies, and government affairs." },
  { name: "Art", description: "Discover creative expressions, masterpieces, and artistic inspiration." },
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
      <div className="relative h-96 md:h-[600px] overflow-hidden rounded-lg mb-20">
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
            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 text-center text-white px-4 py-2 rounded-md">
            <h2 className="text-4xl font-bold mb-2">
                {img.category[0].toUpperCase() + img.category.slice(1)}
            </h2>
            <p className="text-lg font-medium">
                {categories_quotes.find(cq => cq.name.toLowerCase() === img.category)?.description || ""}
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
