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
      className="relative max-w-7xl mx-auto px-20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel wrapper */}
      <div className="relative  h-80 md:h-[120px] overflow-hidden pb-20 mt-4">
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 rounded-md transition-opacity duration-1000 ease-in-out ${
              index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={img.src}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover rounded-md"
            />

          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full focus:outline-none ${
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
