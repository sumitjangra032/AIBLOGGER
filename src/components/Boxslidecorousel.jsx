import React, { useEffect, useState } from "react";

// Reusing the categories array
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

// Reusing the image picking logic
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

const AutoSquareSlider = () => {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Load images
  useEffect(() => {
    setImages(getRandomImages());
  }, []);

  // Auto-slide every 8 seconds (your set interval)
  useEffect(() => {
    if (!images.length) return;
    const interval = setInterval(() => {
      // Logic for auto-sliding to the next index
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 8000); // Set interval is 8000ms (8 seconds)

    return () => clearInterval(interval); // Cleanup on unmount
  }, [images]);

  if (!images.length) return null;

  return (
    <div className="relative max-w-7xl mx-auto">
      <div className="relative w-full aspect-square overflow-hidden rounded-lg shadow-xl">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {images.map((img, index) => (
            <div key={index} className="w-full h-full flex-shrink-0">
              <img
                src={img.src}
                alt={`Slide ${index + 1} - ${img.category}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AutoSquareSlider;