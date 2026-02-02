"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
    acceptTerms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-white">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <p className="text-gray-600 text-sm font-medium mb-2">Get In Touch</p>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact me
          </h2>
          <p className="text-gray-600 text-lg">
            Let's collaborate on your next AI product or discuss opportunities in ML, NLP, or voice-first systems.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name and Last Name - Two Columns */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-900 font-medium mb-2"
              >
                First name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-light rounded-lg focus:outline-none focus:border-purple-primary transition-colors"
                placeholder=""
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-900 font-medium mb-2"
              >
                Last name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-purple-light rounded-lg focus:outline-none focus:border-purple-primary transition-colors"
                placeholder=""
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-900 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-light rounded-lg focus:outline-none focus:border-purple-primary transition-colors"
              placeholder=""
            />
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phone"
              className="block text-gray-900 font-medium mb-2"
            >
              Phone number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-light rounded-lg focus:outline-none focus:border-purple-primary transition-colors"
              placeholder=""
            />
          </div>

          {/* Choose a Topic - Dropdown */}
          <div>
            <label
              htmlFor="topic"
              className="block text-gray-900 font-medium mb-2"
            >
              Choose a topic
            </label>
            <select
              id="topic"
              name="topic"
              value={formData.topic}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-light rounded-lg focus:outline-none focus:border-purple-primary transition-colors appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-[length:20px] bg-[right_12px_center] bg-no-repeat pr-10"
            >
              <option value="">Select one...</option>
              <option value="general">General Inquiry</option>
              <option value="project">Project Collaboration</option>
              <option value="hire">Hiring Opportunity</option>
              <option value="ai">AI/ML Consulting</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Message - Textarea */}
          <div>
            <label
              htmlFor="message"
              className="block text-gray-900 font-medium mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border-2 border-purple-light rounded-lg focus:outline-none focus:border-purple-primary transition-colors resize-none"
              placeholder="Type your message..."
            />
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="acceptTerms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="w-5 h-5 border-2 border-purple-light rounded focus:ring-2 focus:ring-purple-primary focus:ring-offset-0 text-purple-primary"
            />
            <label
              htmlFor="acceptTerms"
              className="text-gray-900 font-medium cursor-pointer"
            >
              I accept the terms
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              className="bg-purple-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-dark transition-colors shadow-lg hover:shadow-xl"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
