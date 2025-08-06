'use client';

import { Clock, Users, ShoppingCart, Calendar, Truck, BookOpen } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: ShoppingCart,
      title: "Farm Stand",
      description: "Visit our on-site farm stand for the freshest produce picked daily",
      hours: "Daily 8AM - 6PM"
    },
    {
      icon: Users,
      title: "Farm Tours",
      description: "Educational tours for families, schools, and groups to learn about sustainable farming",
      hours: "Weekends by appointment"
    },
    {
      icon: Calendar,
      title: "CSA Program",
      description: "Community Supported Agriculture boxes delivered weekly with seasonal produce",
      hours: "May through October"
    },
    {
      icon: Truck,
      title: "Farmers Markets",
      description: "Find us at local farmers markets throughout the region",
      hours: "Saturdays 9AM - 2PM"
    },
    {
      icon: BookOpen,
      title: "Workshops",
      description: "Learn sustainable gardening, preservation techniques, and cooking classes",
      hours: "Monthly events"
    },
    {
      icon: Clock,
      title: "U-Pick Seasons",
      description: "Come pick your own berries, apples, and seasonal vegetables",
      hours: "Seasonal availability"
    }
  ];

  return (
    <section id="services" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Farm Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Beyond growing great food, we offer experiences and services that connect you to the land
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-green-100 w-16 h-16 rounded-xl flex items-center justify-center mb-4">
                <service.icon size={32} className="text-green-600" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>
              
              <div className="flex items-center text-sm text-green-600 font-semibold">
                <Clock size={16} className="mr-2" />
                {service.hours}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-green-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to Visit?</h3>
          <p className="text-lg mb-6 opacity-90">
            Contact us to schedule a tour, join our CSA, or learn about upcoming events
          </p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
          >
            Get in Touch
          </button>
        </div>
      </div>
    </section>
  );
}