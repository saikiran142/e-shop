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
import Table from './pages/Table';
import './index.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Router>
          <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-primary dark:via-dark-secondary dark:to-dark-primary text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route path="/table" element={<Table />} />
              </Routes>
            </main>
            <footer className="bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 mt-auto">
              <div className="container mx-auto px-4 py-6">
                <p className="text-center text-gray-600 dark:text-gray-400">
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
