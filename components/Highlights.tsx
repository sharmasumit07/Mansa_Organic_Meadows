"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MediaItem = {
  image: string; // image url
  type: "image" | "video"; // we keep it for compatibility, but items are images only
  thumbnail?: string;
  title?: string;
};

const CLOUDINARY_TRANSFORM = (url: string, w = 400) => {
  try {
    const u = new URL(url);
    if (u.hostname.includes("res.cloudinary.com")) {
      const parts = u.pathname.split("/upload/");
      if (parts.length === 2) {
        return `${u.origin}${parts[0]}/upload/f_auto,q_auto,w_${w}/${parts[1]}`;
      }
    }
  } catch {
    // noop
  }
  return url;
};

export default function Showcase(): JSX.Element {
  // <-- ONLY IMAGE ITEMS HERE (commented out / removed any video entries) -->
  const items: MediaItem[] = [
    {
      image:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484875/20250115_102753.jpg",
      type: "image",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484875/20250115_102753.jpg",
      title: "20250115_102753",
    },
    {
      image:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484289/20240919_094450.jpg",
      type: "image",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484289/20240919_094450.jpg",
      title: "20240919_094450",
    },
    {
      image:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484351/20241024_124043.jpg",
      type: "image",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484351/20241024_124043.jpg",
      title: "20241024_124043",
    },
    {
      image:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484803/20241119_120754.jpg",
      type: "image",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484803/20241119_120754.jpg",
      title: "20241119_120754",
    },
    {
      image:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484964/20250226_131619.jpg",
      type: "image",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484964/20250226_131619.jpg",
      title: "20250226_131619",
    },
    {
      image:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754485667/mansa_photos/20250319_105948.jpg",
      type: "image",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754485667/mansa_photos/20250319_105948.jpg",
      title: "20250319_105948",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const currentItem = items[currentIndex];

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  // Auto-advance images only
  useEffect(() => {
    // Clear any previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Show loading until image finishes loading (onLoadingComplete will clear)
    setIsLoading(true);

    // Auto advance after 5s
    timeoutRef.current = setTimeout(() => {
      goToNext();
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, goToNext]);

  // small helper to get a transformed thumbnail for strip
  const getThumb = (item: MediaItem) => {
    return CLOUDINARY_TRANSFORM(item.thumbnail ?? item.image, 480);
  };

  return (
    <section
      id="highlights"
      className="relative w-full min-h-screen bg-white px-6 py-16 flex flex-col items-center justify-start"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
        Farm Highlights
      </h2>

      <div className="relative w-full max-w-6xl aspect-video rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-black flex items-center justify-center">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          </div>
        )}

        {/* IMAGE SLIDE */}
        <div className="relative w-full h-full">
          <Image
            src={currentItem.image}
            alt={currentItem.title ?? `Slide ${currentIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
            style={{ objectFit: "contain" }}
            priority={currentIndex === 0}
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
        </div>

        {/* Arrows */}
        <button
          onClick={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            goToPrevious();
          }}
          aria-label="Previous highlight"
          className="absolute top-1/2 left-3 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              timeoutRef.current = null;
            }
            goToNext();
          }}
          aria-label="Next highlight"
          className="absolute top-1/2 right-3 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <ChevronRight size={24} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                i === currentIndex
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails strip */}
      <div className="mt-6 flex gap-3 overflow-x-auto px-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative rounded-md overflow-hidden flex-shrink-0 transition-all duration-200 ${
              idx === currentIndex
                ? "ring-2 ring-green-500 scale-105"
                : "border border-gray-200 hover:border-green-300"
            }`}
            style={{ width: 120, height: 80 }}
            aria-label={`Go to slide ${idx + 1}`}
          >
            <Image
              src={getThumb(item)}
              alt={`Thumbnail ${idx + 1}`}
              fill
              sizes="120px"
              style={{ objectFit: "cover" }}
              priority={idx <= 2}
              loading={idx <= 2 ? "eager" : "lazy"}
            />
          </button>
        ))}
      </div>

      <div className="mt-4 text-center text-gray-600">
        <span className="text-sm">
          {currentIndex + 1} of {items.length}
        </span>
      </div>
    </section>
  );
}
