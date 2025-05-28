import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
      description: 'High-quality wireless headphones with noise cancellation',
    },
    {
      id: 2,
      name: 'Wireless Speaker',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&auto=format&fit=crop&q=60',
      description: 'Portable Bluetooth speaker with amazing sound quality',
    },
    {
      id: 3,
      name: 'Smart Watch',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
      description: 'Feature-rich smartwatch with health monitoring',
    },
    {
      id: 4,
      name: 'Gaming Laptop',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&auto=format&fit=crop&q=60',
      description: 'High-performance gaming laptop with RTX graphics',
    },
    {
      id: 5,
      name: 'Wireless Earbuds',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60',
      description: 'True wireless earbuds with active noise cancellation',
    },
    {
      id: 6,
      name: '4K Monitor',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60',
      description: 'Ultra-wide 4K monitor with HDR support',
    },
    {
      id: 7,
      name: 'Mechanical Keyboard',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format&fit=crop&q=60',
      description: 'RGB mechanical keyboard with customizable switches',
    },
    {
      id: 8,
      name: 'Gaming Mouse',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500&auto=format&fit=crop&q=60',
      description: 'High-precision gaming mouse with programmable buttons',
    },
    {
      id: 9,
      name: 'Tablet Pro',
      price: 499.99,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&auto=format&fit=crop&q=60',
      description: 'Professional tablet with stylus support and high-resolution display',
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-primary">
      {/* Product Carousel */}
      <div className="relative h-[500px] overflow-hidden bg-gradient-to-r from-primary-100 via-white to-primary-200 dark:from-dark-primary dark:via-dark-secondary dark:to-dark-primary">
        {featuredProducts.map((product, index) => (
          <div
            key={product.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="container mx-auto px-4 h-full">
              <div className="flex items-center justify-between h-full">
                <div className="w-1/2 pr-8 pl-12">
                  <h2 className="text-4xl font-bold mb-4 text-gray-900">
                    {product.name}
                  </h2>
                  <p className="text-xl mb-6 text-gray-700">
                    {product.description}
                  </p>
                  <p className="text-3xl font-bold mb-8 text-primary-600 dark:text-primary-300">
                    ${product.price}
                  </p>
                  <button
                    onClick={() => navigate(`/products/${product.id}`)}
                    className="btn btn-primary bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white"
                  >
                    Shop Now
                  </button>
                </div>
                <div className="w-1/2 pr-12">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[400px] object-contain dark:brightness-90"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-dark-secondary/90 hover:bg-white dark:hover:bg-dark-secondary transition-colors duration-200 z-10 shadow-lg text-gray-800 dark:text-gray-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-dark-secondary/90 hover:bg-white dark:hover:bg-dark-secondary transition-colors duration-200 z-10 shadow-lg text-gray-800 dark:text-gray-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {featuredProducts.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentSlide
                  ? 'bg-primary-600 dark:bg-primary-300'
                  : 'bg-gray-400 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-16 bg-white dark:bg-dark-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-900 dark:text-white">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card group bg-white dark:bg-dark-primary shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{product.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-primary-600 dark:text-primary-400 text-2xl font-bold">
                      ${product.price}
                    </p>
                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="btn btn-primary"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white dark:from-dark-primary dark:to-dark-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg bg-white dark:bg-dark-primary shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Quality Products</h3>
              <p className="text-gray-600 dark:text-gray-400">We only sell products that meet our high quality standards</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white dark:bg-dark-primary shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Fast Delivery</h3>
              <p className="text-gray-600 dark:text-gray-400">Get your products delivered quickly and safely</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-white dark:bg-dark-primary shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Secure Payment</h3>
              <p className="text-gray-600 dark:text-gray-400">Your payment information is always secure</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 