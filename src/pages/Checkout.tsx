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

// Initialize Stripe with the publishable key from environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const steps = ['Shipping', 'Payment', 'Review'];

const PaymentForm = ({ onSuccess, onValidate, onProcessPayment }: { 
  onSuccess: () => void; 
  onValidate: (isValid: boolean) => void;
  onProcessPayment: (processPaymentFn: () => Promise<boolean>) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const validateCard = async () => {
    if (!stripe || !elements) return false;

    setProcessing(true);
    setPaymentError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setPaymentError(error.message || 'Invalid card details');
        onValidate(false);
        return false;
      } else {
        onValidate(true);
        return true;
      }
    } catch (err) {
      setPaymentError('An unexpected error occurred');
      onValidate(false);
      return false;
    } finally {
      setProcessing(false);
    }
  };

  const processPayment = async () => {
    if (!stripe || !elements) return false;

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
        return false;
      } else {
        console.log('Payment successful:', paymentMethod);
        onSuccess();
        return true;
      }
    } catch (err) {
      setPaymentError('An unexpected error occurred');
      console.error('Payment error:', err);
      return false;
    } finally {
      setProcessing(false);
    }
  };

  // Expose processPayment to parent
  onProcessPayment(processPayment);

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Card Details
        </label>
        <div className="p-3 bg-white border border-gray-300 rounded-lg">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                  iconColor: '#6772e5',
                },
                invalid: {
                  color: '#9e2146',
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
        {paymentError && (
          <p className="mt-2 text-sm text-red-500">{paymentError}</p>
        )}
      </div>
      <div className="text-sm text-gray-500">
        <p>Test card number: 4242 4242 4242 4242</p>
        <p>Any future date for expiry</p>
        <p>Any 3 digits for CVC</p>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={validateCard}
          disabled={!stripe || processing}
          className="btn btn-primary"
        >
          {processing ? 'Validating...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(1);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isCardValid, setIsCardValid] = useState(false);
  const [processPayment, setProcessPayment] = useState<(() => Promise<boolean>) | null>(null);
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
      navigate('/confirmation');
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

  const handlePlaceOrder = async () => {
    if (isCardValid && processPayment) {
      const success = await processPayment();
      if (success) {
        // Process the order
        dispatch(clearCart());
        navigate('/confirmation');
      }
    }
  };

  const renderShippingForm = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            {...register('firstName')}
            className="input"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            {...register('lastName')}
            className="input"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="input"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            {...register('address')}
            className="input"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            City
          </label>
          <input
            {...register('city')}
            className="input"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-500">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            State
          </label>
          <input
            {...register('state')}
            className="input"
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-500">{errors.state.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            ZIP Code
          </label>
          <input
            {...register('zipCode')}
            className="input"
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-500">{errors.zipCode.message}</p>
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
        <PaymentForm 
          onSuccess={() => {
            setPaymentSuccess(true);
            navigate('/confirmation');
          }}
          onValidate={(isValid) => {
            setIsCardValid(isValid);
            if (isValid) {
              setActiveStep(3);
            }
          }}
          onProcessPayment={(processPaymentFn) => {
            setProcessPayment(() => processPaymentFn);
          }}
        />
      </Elements>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => setActiveStep((prevStep) => prevStep - 1)}
          className="mr-4 btn"
        >
          Back
        </button>
      </div>
    </div>
  );

  const renderReview = () => (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h3 className="mb-4 text-xl font-bold">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="pt-4 mt-4 border-t">
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
          className="mr-4 btn"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={!isCardValid}
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
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="p-6">{getStepContent(activeStep)}</div>
          </div>
        </div>
        <div>
          <div className="card">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-bold">Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t">
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