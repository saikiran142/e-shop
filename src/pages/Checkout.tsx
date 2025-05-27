import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from '../store/slices/cartSlice';
import type { RootState } from '../store/store';
import { checkoutSchema, type CheckoutFormData } from '../schemas/checkoutSchema';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_51NkXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');

const steps = ['Shipping', 'Payment', 'Review'];

const PaymentForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    setProcessing(true);
    setPaymentError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setPaymentError(error.message || 'Payment failed');
      } else {
        // Simulate successful payment
        console.log('Payment successful:', paymentMethod);
        onSuccess();
      }
    } catch (err) {
      setPaymentError('An unexpected error occurred');
      console.error('Payment error:', err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 rounded-lg bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
        {paymentError && (
          <p className="text-red-500 text-sm mt-2">{paymentError}</p>
        )}
      </div>
      <div className="text-sm text-gray-500">
        <p>Test card number: 4242 4242 4242 4242</p>
        <p>Any future date for expiry</p>
        <p>Any 3 digits for CVC</p>
      </div>
      <button
        type="button"
        onClick={handlePayment}
        disabled={!stripe || processing}
        className="w-full bg-primary-600 text-white py-2.5 px-4 rounded-lg hover:bg-primary-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cartItems, total } = useSelector((state: RootState) => state.cart);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: CheckoutFormData) => {
    if (activeStep === steps.length) {
      // Process payment and create order
      console.log('Order submitted:', data);
      dispatch(clearCart());
      navigate('/orders');
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleNext = async () => {
    let isValid = false;
    
    if (activeStep === 1) {
      isValid = await trigger(['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode']);
    } else if (activeStep === 2) {
      // Payment validation is handled by Stripe
      isValid = true;
    } else {
      isValid = true;
    }

    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const renderShippingForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            {...register('firstName')}
            className="input"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            {...register('lastName')}
            className="input"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="input"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            {...register('address')}
            className="input"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            {...register('city')}
            className="input"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            {...register('state')}
            className="input"
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ZIP Code
          </label>
          <input
            {...register('zipCode')}
            className="input"
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
          )}
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={handleNext}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </form>
  );

  const renderPaymentForm = () => (
    <div>
      <Elements stripe={stripePromise}>
        <PaymentForm onSuccess={() => setActiveStep(3)} />
      </Elements>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => setActiveStep((prevStep) => prevStep - 1)}
          className="btn mr-4"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderReview = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => setActiveStep((prevStep) => prevStep - 1)}
          className="btn mr-4"
        >
          Back
        </button>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Place Order
        </button>
      </div>
    </form>
  );

  const getStepContent = (step: number) => {
    switch (step) {
      case 1:
        return renderShippingForm();
      case 2:
        return renderPaymentForm();
      case 3:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className={`flex items-center ${activeStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Shipping</div>
                <div className="text-xs">Address details</div>
              </div>
            </div>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${
            activeStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'
          }`}></div>
          <div className="flex-1">
            <div className={`flex items-center ${activeStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Payment</div>
                <div className="text-xs">Payment method</div>
              </div>
            </div>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${
            activeStep >= 3 ? 'bg-primary-600' : 'bg-gray-200'
          }`}></div>
          <div className="flex-1">
            <div className={`flex items-center ${activeStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                3
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium">Review</div>
                <div className="text-xs">Order summary</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">{getStepContent(activeStep)}</div>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 