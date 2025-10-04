export default function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-theatre-dark mb-8" style={{ fontFamily: 'Playfair Display, serif' }}>
          About Theatre Spotlight
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1507924538820-ede94a04019d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Theatre interior" 
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-theatre-dark mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4">
              Theatre Spotlight is the UK's premier destination for comprehensive theatre coverage, 
              bringing you the latest news, in-depth reviews, and exclusive content from both 
              West End and Broadway productions.
            </p>
            <p className="text-gray-700">
              We are passionate about celebrating the art of theatre and connecting audiences 
              with the stories, performances, and people that make the theatrical world so vibrant.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-theatre-dark mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
            What We Cover
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-theatre-dark mb-2">Latest News</h3>
              <p className="text-gray-600 text-sm">
                Breaking news, announcements, and updates from the theatre world
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-theatre-dark mb-2">Expert Reviews</h3>
              <p className="text-gray-600 text-sm">
                Professional critiques and analysis of current productions
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-theatre-dark mb-2">West End Coverage</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive coverage of London's theatre district
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-theatre-dark mb-2">Broadway Updates</h3>
              <p className="text-gray-600 text-sm">
                The latest from New York's premier theatre scene
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-theatre-dark mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            Join Our Community
          </h2>
          <p className="text-gray-700 mb-6">
            Be part of a community of theatre enthusiasts who share your passion for the performing arts.
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-theatre-primary hover:text-purple-700">
              <i className="fab fa-facebook-f text-2xl"></i>
            </a>
            <a href="#" className="text-theatre-primary hover:text-purple-700">
              <i className="fab fa-twitter text-2xl"></i>
            </a>
            <a href="#" className="text-theatre-primary hover:text-purple-700">
              <i className="fab fa-youtube text-2xl"></i>
            </a>
            <a href="#" className="text-theatre-primary hover:text-purple-700">
              <i className="fab fa-instagram text-2xl"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
