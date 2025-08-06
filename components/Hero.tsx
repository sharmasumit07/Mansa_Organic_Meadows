"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Hero(): JSX.Element {
  const CLOUD_BASE = "https://res.cloudinary.com/dlstdyi8d";

  // High-res image (will be requested only when hero is visible)
  const full = `${CLOUD_BASE}/image/upload/f_auto,q_auto/v1754485689/mansa_photos/20250319_173717.jpg`;

  // Low-res preview (served immediately)
  const thumb = `${CLOUD_BASE}/image/upload/f_auto,q_auto,w_1000/mansa_photos/20250319_173717.jpg`;

  const [bgImage, setBgImage] = useState<string>(thumb);
  const [bgLoaded, setBgLoaded] = useState<boolean>(false);

  // ref to hero element for intersection observer
  const heroRef = useRef<HTMLElement | null>(null);
  // track whether we've started loading the full image (so we don't trigger multiple times)
  const startedRef = useRef(false);

  useEffect(() => {
    // If the user is on very slow JS environment or IntersectionObserver isn't available,
    // fall back to preloading immediately. (But modern browsers support this.)
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined"
    ) {
      const img = new window.Image();
      img.src = full;
      img.onload = () => {
        setBgImage(full);
        setBgLoaded(true);
      };
      img.onerror = () => setBgLoaded(true);
      return;
    }

    const el = heroRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            if (!startedRef.current) {
              startedRef.current = true;
              // load full image
              const img = new window.Image();
              img.src = full;
              img.onload = () => {
                setBgImage(full);
                setBgLoaded(true);
              };
              img.onerror = () => {
                // if load fails, mark as loaded so blur is removed
                setBgLoaded(true);
              };
            }
            // We can stop observing after starting the load
            obs.unobserve(entry.target);
          }
        }
      },
      {
        // load a bit before it enters viewport for smoother UX
        root: null,
        rootMargin: "200px",
        threshold: 0.01,
      }
    );

    observer.observe(el);

    return () => {
      try {
        observer.disconnect();
      } catch {}
    };
  }, [full]);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) aboutSection.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url("${bgImage}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
      aria-label="Hero section"
    >
      <div className="absolute inset-0 bg-black/40" />

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

      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce cursor-pointer"
        aria-label="Scroll to about"
      >
        <ChevronDown size={32} />
      </button>

      {!bgLoaded && (
        <div
          className="absolute inset-0 backdrop-blur-sm pointer-events-none"
          aria-hidden
        />
      )}
    </section>
  );
}
