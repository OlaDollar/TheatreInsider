import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-theatre-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 theatre-secondary" style={{ fontFamily: 'Cinzel, serif' }}>
              Theatre Spotlight
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              The UK's premier destination for theatre news, reviews, and exclusive content covering West End and Broadway productions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-theatre-secondary transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-theatre-secondary transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-theatre-secondary transition-colors">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-theatre-secondary transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Content</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  Latest News
                </Link>
              </li>
              <li>
                <Link href="/reviews" className="hover:text-white transition-colors">
                  Reviews
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  West End Shows
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Broadway Shows
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Interviews
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Premium Subscription
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Newsletter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Theatre Shop
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Advertise With Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Press Releases
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">© 2024 Theatre Spotlight. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-4 md:mt-0">Proudly covering UK and US theatre since 2024</p>
        </div>
      </div>
    </footer>
  );
}
