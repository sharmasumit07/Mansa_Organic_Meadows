// components/Showcase.tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type MediaItem = {
  image: string; // full-size image OR mp4 CDN URL
  type: "image" | "video";
  thumbnail?: string; // small preview (thumb or poster)
  poster?: string; // video poster (image)
  webm?: string; // optional webm (we did not generate by default)
  title?: string;
};

export default function Showcase(): JSX.Element {
  // --- items derived from your cloudinary-urls.json ---
  const items: MediaItem[] = [
    {
      image:
        "https://res.cloudinary.com/dlstdyi8d/video/upload/v1754484780/20241108_131510.mp4",
      type: "video",
      poster:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484780/20241108_131510.jpg",
      title: "Video 20241108_131510",
    },
    {
      image:
        "https://res.cloudinary.com/dlstdyi8d/video/upload/v1754485619/mansa_photos/20250227_115112.mp4",
      type: "video",
      poster:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754485619/mansa_photos/20250227_115112.jpg",
      title: "Video 20250227_115112",
    },
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentItem = items[currentIndex];

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  }, [items.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  }, [items.length]);

  const clearAutoAdvance = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  // when slide changes, set loading true so UI shows spinner until media ready
  useEffect(() => {
    setIsLoading(true);
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        videoRef.current.load();
      } catch {
        // ignore
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex]);

  // Auto-advance images only
  useEffect(() => {
    clearAutoAdvance();
    if (currentItem.type === "image") {
      timeoutRef.current = setTimeout(() => {
        goToNext();
      }, 5000);
    }
    return clearAutoAdvance;
  }, [currentIndex, currentItem.type, goToNext, clearAutoAdvance]);

  const handleVideoEnded = useCallback(() => {
    goToNext();
  }, [goToNext]);

  const handleVideoLoadStart = useCallback(() => setIsLoading(true), []);
  const handleVideoCanPlay = useCallback(() => setIsLoading(false), []);

  const handleThumbnailClick = useCallback(
    (idx: number) => {
      clearAutoAdvance();
      setCurrentIndex(idx);
    },
    [clearAutoAdvance]
  );

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

        {currentItem.type === "video" ? (
          <video
            ref={videoRef}
            key={`${currentItem.image}-${currentIndex}`}
            className="w-full h-full object-contain"
            controls
            preload="metadata"
            playsInline
            poster={currentItem.poster ?? currentItem.thumbnail}
            onEnded={handleVideoEnded}
            onLoadStart={handleVideoLoadStart}
            onCanPlay={handleVideoCanPlay}
            onError={() => setIsLoading(false)}
          >
            <source src={currentItem.image} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
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
        )}

        <button
          onClick={() => {
            clearAutoAdvance();
            goToPrevious();
          }}
          aria-label="Previous"
          className="absolute top-1/2 left-3 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          disabled={isLoading}
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => {
            clearAutoAdvance();
            goToNext();
          }}
          aria-label="Next"
          className="absolute top-1/2 right-3 -translate-y-1/2 z-30 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          disabled={isLoading}
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => handleThumbnailClick(i)}
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

      <div className="mt-6 flex gap-3 overflow-x-auto px-2">
        {items.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleThumbnailClick(idx)}
            className={`relative rounded-md overflow-hidden flex-shrink-0 transition-all duration-200 ${
              idx === currentIndex
                ? "ring-2 ring-green-500 scale-105"
                : "border border-gray-200 hover:border-green-300"
            }`}
            style={{ width: 120, height: 80 }}
            aria-label={`Go to slide ${idx + 1}`}
          >
            <Image
              src={item.poster ?? item.thumbnail ?? item.image}
              alt={`Thumbnail ${idx + 1}`}
              fill
              sizes="120px"
              style={{ objectFit: "cover" }}
              priority={idx <= 2}
            />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-white/90 rounded-full p-1 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5v14l11-7-11-7z" fill="#111827" />
                  </svg>
                </div>
              </div>
            )}
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
