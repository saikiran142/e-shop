import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import './index.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Router>
          <div className="min-h-screen bg-white dark:bg-dark-primary text-gray-900 dark:text-dark-primary transition-colors duration-200">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation" element={<Confirmation />} />
              </Routes>
            </div>
            <footer className="bg-white border-t mt-auto">
              <div className="container mx-auto px-4 py-6">
                <p className="text-center text-gray-600">
                  © 2024 E-Shop. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </Router>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
