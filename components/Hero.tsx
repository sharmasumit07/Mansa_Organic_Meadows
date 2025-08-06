"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Hero(): JSX.Element {
  // Cloudinary base (your account)
  const CLOUD_BASE = "https://res.cloudinary.com/dlstdyi8d";

  // Full image (high-res)
  const full = `${CLOUD_BASE}/image/upload/f_auto,q_auto/v1754485689/mansa_photos/20250319_173717.jpg`;

  // Thumbnail / preview generated on the fly by Cloudinary
  // w_1000 (width) gives a reasonably-sized background preview; change to w_800 or w_600 to shrink further.
  const thumb = `${CLOUD_BASE}/image/upload/f_auto,q_auto,w_1000/mansa_photos/20250319_173717.jpg`;

  const [bgImage, setBgImage] = useState<string>(thumb);
  const [bgLoaded, setBgLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Preload the high-res background and swap when ready
    const img = new window.Image();
    img.src = full;
    img.onload = () => {
      setBgImage(full);
      setBgLoaded(true);
    };
    img.onerror = () => {
      // If loading high-res fails, keep thumb and mark as loaded to remove blur
      setBgLoaded(true);
    };

    // cleanup
    return () => {
      // no cleanup necessary for Image object
    };
  }, [full]);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url("${bgImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
      aria-label="Hero section"
    >
      {/* subtle overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Welcome to
          <span className="block text-green-400"> Mansa Organic Meadows</span>
        </h1>

        <p className="text-xl md:text-2xl mb-8 opacity-90">
          Sustainable farming, fresh produce, and a commitment to nurturing the
          land for future generations
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={scrollToAbout}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Learn Our Story
          </button>
          <button
            onClick={() =>
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Visit Our Farm
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce cursor-pointer"
        aria-label="Scroll to about"
      >
        <ChevronDown size={32} />
      </button>

      {/* Optional: subtle blur while high-res not loaded */}
      {!bgLoaded && (
        <div
          className="absolute inset-0 backdrop-blur-sm pointer-events-none"
          aria-hidden
        />
      )}
    </section>
  );
}
