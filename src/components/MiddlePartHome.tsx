"use client";

import { useState, useEffect } from "react";

const MiddlePartHome = () => {
  return (
    <div>
      {/* Text Section */}
      <div className="h-[200px] w-full flex items-center justify-center bg-lamaYellowLight p-4">
        <div className="text-center space-y-4">
          <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700">
            “Education is the most powerful weapon which you can use to change the world.”
          </p>
          <p className="text-md sm:text-lg lg:text-xl font-medium text-gray-700 pt-4">
            “The beautiful thing about learning is that no one can take it away from you.”
          </p>
        </div>
      </div>

      {/* Image Slider Section */}
      <div className="ImageSlider">
        <ImageSlider />
      </div>
    </div>
  );
};

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    "https://via.placeholder.com/400x300?text=Image+1",
    "https://via.placeholder.com/400x300?text=Image+2",
    "https://via.placeholder.com/400x300?text=Image+3",
    "https://via.placeholder.com/400x300?text=Image+4",
    "https://via.placeholder.com/400x300?text=Image+5",
    "https://via.placeholder.com/400x300?text=Image+1",
    "https://via.placeholder.com/400x300?text=Image+2",
    "https://via.placeholder.com/400x300?text=Image+3",
    "https://via.placeholder.com/400x300?text=Image+3",
    "https://via.placeholder.com/400x300?text=Image+3",
  ];

  // Automatically slide images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Slide every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full overflow-hidden bg-gray-100">
      {/* Slider Track */}
      <div
        className="flex transition-transform duration-500"
        style={{
          transform: `translateX(-${(currentIndex * 100) / 9}%)`,
          width: `${(9 / 9) * 100}%`,
        }}
      >
        {images.map((image, index) => (
          <div key={index} className="flex-shrink-0 w-1/3 px-2">
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="h-[250px] object-cover w-full rounded-md"
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        <button
          className="text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
          onClick={() =>
            setCurrentIndex((prevIndex) =>
              prevIndex === 0 ? images.length - 1 : prevIndex - 1
            )
          }
        >
          &lt;
        </button>
        <button
          className="text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
          onClick={() =>
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
          }
        >
          &gt;
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full bg-white opacity-50 hover:opacity-100 cursor-pointer ${
              index === currentIndex ? "opacity-100" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default MiddlePartHome;
