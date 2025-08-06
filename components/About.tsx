"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, Leaf, Users, Award } from "lucide-react";

export default function About(): JSX.Element {
  // Cloudinary base (your account)
  const CLOUD_BASE = "https://res.cloudinary.com/dlstdyi8d";

  // High-res background and small preview (Cloudinary transforms)
  const bgFull = `${CLOUD_BASE}/image/upload/f_auto,q_auto,w_1600/v1754484940/20250204_170618.jpg`;
  const bgThumb = `${CLOUD_BASE}/image/upload/f_auto,q_auto,w_800/v1754484940/20250204_170618.jpg`;

  // Inset image - use a moderate size for performance
  const insetImage = `${CLOUD_BASE}/image/upload/f_auto,q_auto,w_1200/v1754484914/20250204_163151.jpg`;
  const insetAlt = "Field view at Mansa Organic Meadows";

  const [bg, setBg] = useState<string>(bgThumb);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    // preload high-res background, swap when ready
    const img = new window.Image();
    img.src = bgFull;
    img.onload = () => {
      setBg(bgFull);
      setLoaded(true);
    };
    img.onerror = () => {
      // if full fails, keep thumb but treat as loaded
      setLoaded(true);
    };
    return () => {
      // nothing to cleanup
    };
  }, [bgFull]);

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Story
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A 25-acre sanctuary of natural farming and abundance in Damal
            Village, Kanchipuram.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Mansa Organic Meadows
            </h3>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At Mansa Organic Meadows, we grow food with care and respect for
              nature. Our farm is home to fruit trees, native herbs, poultry,
              and traditional crops — all cultivated using organic and
              regenerative practices.
            </p>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              We nurture over 700 coconut trees, 90 jackfruit trees, 400
              Australian jamun trees, and many varieties of citrus and mango,
              alongside rice, turmeric, pineapple, and medicinal plants. Our
              livestock — from Punganur cows to country chickens — thrive on
              organic feed and open pastures.
            </p>

            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Every harvest is nourished by compost made on-site, rainwater
              harvesting, and water-saving drip irrigation. No chemicals. No
              shortcuts. Just honest food that’s good for people and the planet.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Our mission: to grow food that heals — pure in taste, rich in
              biodiversity, and part of a healthier future for all.
            </p>
          </div>

          {/* Background card with progressive preview swap */}
          <div
            className="rounded-2xl h-96 shadow-xl relative overflow-hidden"
            aria-hidden="true"
            style={{
              backgroundImage: `url("${bg}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              transition: "filter 300ms ease",
            }}
          >
            {/* subtle overlay */}
            <div
              className={`absolute inset-0 bg-black transition-opacity duration-300 ${
                loaded ? "bg-opacity-10" : "bg-opacity-30"
              }`}
            />

            {/* If you want an actual <Image> overlay (improves LCP), keep this but keep background as fallback */}
            <div className="absolute inset-0">
              <Image
                src={insetImage}
                alt={insetAlt}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                style={{ objectFit: "cover" }}
                priority={false}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <FeatureCard
            icon={<Leaf size={32} className="text-white" />}
            title="Sustainable"
            description="Organic farming that protects our environment."
          />
          <FeatureCard
            icon={<Heart size={32} className="text-white" />}
            title="Family Owned"
            description="Three generations of farming expertise."
          />
          <FeatureCard
            icon={<Users size={32} className="text-white" />}
            title="Community"
            description="Supporting local food systems and education."
          />
          <FeatureCard
            icon={<Award size={32} className="text-white" />}
            title="Quality"
            description="Premium produce grown with passion."
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-300"
      tabIndex={0}
    >
      <div className="bg-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
