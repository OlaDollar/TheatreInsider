import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import SearchBar from "./search-bar";

export default function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const navItems = [
    { path: "/news", label: "Latest News" },
    { path: "/reviews", label: "Reviews" },
    { path: "/whats-on", label: "What's On" },
    { path: "/theatres", label: "Theatres" },
    { path: "/crossword", label: "Daily Crossword" },
    { path: "/facts", label: "Theatre Facts" },
    { path: "/performers", label: "Performers" },
    { path: "/arts-education", label: "Arts Education" },
    { path: "/awards", label: "Awards" },
    { path: "/about", label: "About" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      {/* Top banner */}
      <div className="bg-theatre-primary text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-4">
              <span>Latest: Hamilton announces 2024 UK tour dates</span>
            </div>
            <div className="hidden sm:flex space-x-4">
              <a href="#" className="hover:text-theatre-secondary transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="hover:text-theatre-secondary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-theatre-secondary transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="hover:text-theatre-secondary transition-colors">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <h1 className="text-3xl font-bold theatre-primary" style={{ fontFamily: 'Cinzel, serif' }}>
                Theatre Spotlight
              </h1>
            </Link>
            <span className="ml-3 text-sm text-theatre-dark bg-theatre-secondary px-2 py-1 rounded font-medium">
              Premium
            </span>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`font-medium transition-colors ${
                  isActive(item.path)
                    ? "theatre-primary"
                    : "text-gray-700 hover:text-theatre-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <SearchBar />
            <Link href="/newsletter">
              <Button className="bg-theatre-primary hover:bg-purple-700 text-white">
                Subscribe
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`font-medium transition-colors ${
                    isActive(item.path)
                      ? "theatre-primary"
                      : "text-gray-700 hover:text-theatre-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <SearchBar />
              <Button className="bg-theatre-primary hover:bg-purple-700 text-white w-full">
                Subscribe
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
