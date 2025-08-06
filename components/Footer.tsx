"use client";

import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Farm Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Mansa Organic Meadows</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Sustainable farming practices, premium quality produce, and a
              commitment to environmental stewardship. Visit us to experience
              farm-fresh goodness and learn about regenerative agriculture.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="bg-green-600 hover:bg-green-700 p-2 rounded-lg transition-colors"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "About Us", id: "about" },
                { name: "Highlights", id: "highlights" },
                { name: "Gallery", id: "gallery" },
                { name: "Services", id: "services" },
                { name: "Contact", id: "contact" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() =>
                      document
                        .getElementById(link.id)
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-gray-300 hover:text-green-400 transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin size={16} className="text-green-400" />
                <span className="text-gray-300 text-sm">
                  Damal Village, Kanchipuram, Tamil Nadu.
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-green-400" />
                <span className="text-gray-300 text-sm">(555) 123-FARM</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-green-400" />
                <span className="text-gray-300 text-sm">
                  hello@greenvalleyfarm.com
                </span>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-semibold mb-2">Farm Stand Hours</h5>
              <div className="text-gray-300 text-sm space-y-1">
                <p>Mon-Fri: 8AM - 6PM</p>
                <p>Sat-Sun: 9AM - 5PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Mansa Organic Meadows. All rights reserved. |
            <span className="ml-2">Proudly growing since 1952</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
