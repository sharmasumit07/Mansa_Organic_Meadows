"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { X, Play } from "lucide-react";

type GalleryItem = {
  type: "image" | "video";
  src: string; // mp4 or image
  webm?: string;
  thumbnail: string;
  poster?: string;
  title: string;
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

export default function Gallery(): JSX.Element {
  const [selectedMedia, setSelectedMedia] = useState<GalleryItem | null>(null);
  const [selectedVideoSrc, setSelectedVideoSrc] = useState<string | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const galleryItems: GalleryItem[] = [
    {
      type: "image",
      src: "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484914/20250204_163151.jpg",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484914/20250204_163151.jpg",
      title: "Morning Harvest",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484850/20241215_124415.jpg",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484850/20241215_124415.jpg",
      title: "Farm Fields",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754485644/mansa_photos/20250314_123518.jpg",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754485644/mansa_photos/20250314_123518.jpg",
      title: "Fresh Fruits",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484263/20230510_142333.jpg",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484263/20230510_142333.jpg",
      title: "Grazing Cattle",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754485712/mansa_photos/20250703_124047.jpg",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754485712/mansa_photos/20250703_124047.jpg",
      title: "Orchard in Bloom",
    },
    {
      type: "image",
      src: "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484320/20241012_160913.jpg",
      thumbnail:
        "https://res.cloudinary.com/dlstdyi8d/image/upload/v1754484320/20241012_160913.jpg",
      title: "Herb Garden",
    },
  ];

  const openMedia = (item: GalleryItem, trigger?: HTMLElement | null) => {
    lastFocusedRef.current =
      trigger ?? (document.activeElement as HTMLElement | null);
    setSelectedMedia(item);
    // if it is a video, set selectedVideoSrc only when modal opens to avoid preloading
    if (item.type === "video") {
      setSelectedVideoSrc(null); // clear first
      // small timeout gives modal render time
      setTimeout(() => setSelectedVideoSrc(item.src), 50);
    } else {
      setSelectedVideoSrc(null);
    }
    document.body.style.overflow = "hidden";
  };

  const closeMedia = () => {
    setSelectedMedia(null);
    setSelectedVideoSrc(null);
    document.body.style.overflow = "";
    lastFocusedRef.current?.focus();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedMedia) closeMedia();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedMedia]);

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Farm Gallery
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a visual journey through our farm and see the beauty of
            sustainable agriculture in action
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              role="button"
              tabIndex={0}
              aria-label={`${item.title} — ${item.type}`}
              className="relative group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={(e) => openMedia(item, e.currentTarget as HTMLElement)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openMedia(item, e.currentTarget as HTMLElement);
                }
              }}
            >
              <div className="h-64 relative">
                <Image
                  src={CLOUDINARY_TRANSFORM(item.thumbnail, 600)}
                  alt={item.title}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  loading={index <= 2 ? "eager" : "lazy"}
                />
              </div>

              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <div className="bg-white/90 rounded-full p-3 transform group-hover:scale-110 transition-transform">
                    <Play size={24} className="text-gray-900 ml-1" />
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedMedia && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
            aria-label={selectedMedia.title}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeMedia();
            }}
          >
            <div className="relative max-w-4xl w-full">
              <button
                onClick={closeMedia}
                aria-label="Close"
                className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              >
                <X size={24} className="text-white" />
              </button>

              <div className="mx-auto rounded-lg overflow-hidden bg-black">
                {selectedMedia.type === "image" ? (
                  <div className="relative w-full h-[80vh]">
                    <Image
                      src={selectedMedia.src}
                      alt={selectedMedia.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 1200px"
                      style={{ objectFit: "contain", background: "black" }}
                      priority
                    />
                  </div>
                ) : (
                  <div className="w-full h-auto max-h-[80vh] bg-black">
                    <video
                      controls
                      preload="none"
                      poster={
                        selectedMedia.poster ??
                        CLOUDINARY_TRANSFORM(selectedMedia.thumbnail, 800)
                      }
                      className="w-full h-full max-h-[80vh] bg-black"
                    >
                      {/* set video src only after modal opens using selectedVideoSrc state */}
                      {selectedMedia.webm && selectedVideoSrc && (
                        <source src={selectedMedia.webm} type="video/webm" />
                      )}
                      {selectedVideoSrc && (
                        <source src={selectedVideoSrc} type="video/mp4" />
                      )}
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>

              <div className="text-center mt-4">
                <h3 className="text-white text-xl font-semibold">
                  {selectedMedia.title}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
