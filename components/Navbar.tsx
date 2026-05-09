import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-lg">#</span>
          </div>
          <span className="text-gray-800 font-semibold text-lg">Lucas Lisboa</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-purple-primary font-medium">Home</a>
          <a href="#portfolio" className="text-gray-600 hover:text-gray-900 transition-colors">Portfolio</a>
          <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">About me</a>
          <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
          <a href="#certificates" className="text-gray-600 hover:text-gray-900 transition-colors">Certificates</a>
        </div>

        {/* Contact Button */}
        <a
          href="#contact"
          className="px-6 py-2 border-2 border-purple-primary text-purple-primary rounded-lg hover:bg-purple-primary hover:text-white transition-colors font-medium"
        >
          Contact Me
        </a>
      </div>
    </nav>
  );
}
