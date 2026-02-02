"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Hero() {
  // Array of profile images to rotate
  const profileImages = [
    "/lucas-profile.jpeg",
    "/lucas-mdcworks.jpeg",
    "/luccas-thinkbig.jpeg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % profileImages.length);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [profileImages.length]);
  return (
    <section id="home" className="min-h-screen flex items-center justify-center pt-20 px-6">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Greeting */}
            <p className="text-gray-600 text-lg">Hey, I am</p>
            
            {/* Name */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Lucas Lisboa Alves
            </h1>
            
            {/* Headline with highlighted text */}
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              AI Product Lead & <span className="text-purple-primary">Software Engineer</span>
            </h2>
            
            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
              Building intelligent products at the intersection of AI, ML, and human-centered design. Specializing in voice-first AI systems, NLP, and computer vision to deliver transformative user experiences.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              <a
                href="https://linkedin.com/in/lucaslisboadev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-primary transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a
                href="https://github.com/LucasLisboaDev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-purple-primary transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                </svg>
              </a>
            </div>
            
            {/* CTA Button */}
            <a
              href="#contact"
              className="inline-block bg-purple-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-dark transition-colors shadow-lg hover:shadow-xl"
            >
              Get In Touch
            </a>
          </div>

          {/* Right Image with Decorations */}
          <div className="relative flex items-center justify-center py-12">
            {/* Decorative Sparkles/Stars - positioned around the image */}
            {/* Top left teal sparkles */}
            <div className="absolute top-0 left-0 w-10 h-10 text-teal-primary opacity-80 animate-pulse">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="absolute top-8 left-4 w-6 h-6 text-teal-primary opacity-70">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            
            {/* Top right purple star */}
            <div className="absolute top-4 right-12 w-8 h-8 text-purple-primary opacity-80">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            
            {/* Bottom right purple star */}
            <div className="absolute bottom-20 right-8 w-6 h-6 text-purple-primary opacity-70">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            
            {/* Bottom left teal sparkles */}
            <div className="absolute bottom-12 left-0 w-8 h-8 text-teal-primary opacity-75">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>
            <div className="absolute bottom-4 left-12 w-6 h-6 text-teal-primary opacity-70">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </div>

            {/* Profile Image Container */}
            <div className="relative w-full max-w-md z-10">
              <div className="relative bg-blue-200 rounded-2xl p-4 shadow-2xl">
                <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                  {profileImages.map((imageSrc, index) => (
                    <Image
                      key={imageSrc}
                      src={imageSrc}
                      alt="Lucas Lisboa"
                      fill
                      className={`object-cover absolute inset-0 transition-opacity duration-1000 ${
                        index === currentImageIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                      priority={index === 0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
