"use client";

import { useState } from "react";
import { CONTACT_EMAIL } from "@/data/site";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    acceptTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      setSubmitStatus({
        type: "error",
        message: "Please accept the terms to submit the form.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "Thank you! Your message has been sent successfully.",
        });
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
          acceptTerms: false,
        });
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
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
          <p className="text-gray-600 mt-4">
            Use the form below and I will get it at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=Portfolio%20inquiry`}
              className="text-purple-primary font-medium hover:underline break-all"
            >
              {CONTACT_EMAIL}
            </a>
            , or open your mail app with that link.
          </p>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} method="POST" className="space-y-6">
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

          {/* Submit Status Message */}
          {submitStatus.type && (
            <div
              className={`p-4 rounded-lg ${
                submitStatus.type === "success"
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}
            >
              <p className="font-medium">{submitStatus.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-purple-dark transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
