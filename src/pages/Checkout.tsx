import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart, selectCartItems, selectCartTotal } from '../store/slices/cartSlice';
import { checkoutSchema, type CheckoutFormData } from '../schemas/checkoutSchema';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

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
  const [isStripeReady, setIsStripeReady] = useState(false);

  useEffect(() => {
    if (stripe && elements) {
      console.log('Stripe and elements are ready');
      setIsStripeReady(true);
    }
  }, [stripe, elements]);

  const validateCard = async () => {
    if (!stripe || !elements) {
      console.error('Stripe or elements not available');
      return false;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        console.error('Card element not found');
        return false;
      }

      console.log('Validating card...');
      const { error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error('Card validation error:', error);
        setPaymentError(error.message || 'Invalid card details');
        return false;
      } else {
        console.log('Card validation successful');
        onValidate(true);
      }
    } catch (err) {
      console.error('Validation error:', err);
      setPaymentError('An unexpected error occurred');
      onValidate(false);
      return false;
    } finally {
      setProcessing(false);
    }
  };

  const processPayment = useCallback(async () => {
    if (!stripe || !elements) {
      console.error('Stripe or elements not available');
      return false;
    }

    setProcessing(true);
    setPaymentError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        console.error('Card element not found');
        return false;
      }

      console.log('Creating payment method...');
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.error('Payment method creation failed:', error);
        setPaymentError(error.message || 'Payment failed');
        onValidate(false);
        return false;
      }

      if (!paymentMethod) {
        console.error('No payment method returned');
        setPaymentError('Payment method creation failed');
        onValidate(false);
        return false;
      }

      console.log('Payment method created successfully:', paymentMethod);
      onValidate(true);
      onSuccess();
      return true;

    } catch (err) {
      console.error('Payment processing error:', err);
      setPaymentError('An unexpected error occurred');
      onValidate(false);
      return false;
    } finally {
      setProcessing(false);
    }
  }, [stripe, elements, onSuccess, onValidate]);

  useEffect(() => {
    if (isStripeReady) {
      onProcessPayment(processPayment);
    }
  }, [onProcessPayment, processPayment, isStripeReady]);

  return (
    <div className="space-y-6">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Card Details
        </label>
        <div className="p-3 bg-white border border-gray-300 rounded-lg dark:bg-dark-primary dark:border-dark-primary">
          {!stripe || !elements ? (
            <div className="flex items-center justify-center h-12">
              <div className="text-gray-600 dark:text-gray-400">Initializing payment system...</div>
            </div>
          ) : (
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
          )}
        </div>
        {paymentError && (
          <p className="mt-2 text-sm text-red-500 dark:text-red-400">{paymentError}</p>
        )}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Test card number: 4242 4242 4242 4242</p>
        <p>Any future date for expiry</p>
        <p>Any 3 digits for CVC</p>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={validateCard}
          disabled={!stripe || processing || !isStripeReady}
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
  const [isCardValid, setIsCardValid] = useState(false);
  const [processPayment, setProcessPayment] = useState<(() => Promise<boolean>) | null>(null);
  const [stripePromise, setStripePromise] = useState<any>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
    }
  });

  useEffect(() => {
    const initStripe = async () => {
      try {
        console.log('Loading Stripe...');
        const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        console.log('Stripe loaded successfully');
        setStripePromise(stripe);
      } catch (error) {
        console.error('Failed to initialize Stripe:', error);
      }
    };

    initStripe();
  }, []);

  const onSubmit = async (data: CheckoutFormData) => {
    console.log('Form submitted with data:', data);
    console.log('Current step:', activeStep);
    
    if (activeStep === 1) {
      try {
        // Only validate shipping fields
        const shippingFields = [
          'firstName',
          'lastName',
          'email',
          'address',
          'city',
          'state',
          'zipCode'
        ] as const;

        console.log('Starting shipping form validation...');
        const isValid = await trigger(shippingFields);
        console.log('Shipping form validation result:', isValid);
        
        if (isValid) {
          console.log('Shipping form is valid, moving to step 2');
          setActiveStep(2);
        } else {
          console.log('Shipping form validation failed');
          // Log validation errors
          Object.keys(errors).forEach(key => {
            if (shippingFields.includes(key as any)) {
              console.log(`${key} error:`, errors[key as keyof typeof errors]);
            }
          });
        }
      } catch (error) {
        console.error('Validation error:', error);
      }
    } else if (activeStep === steps.length) {
      // Process payment and create order
      console.log('Order submitted:', data);
      dispatch(clearCart());
      navigate('/confirmation');
    }
  };

  const handlePaymentValidation = useCallback((isValid: boolean) => {
    console.log('Payment validation:', isValid);
    setIsCardValid(isValid);
    if (isValid) {
      setActiveStep(3);
    }
  }, []);

  const handlePaymentSuccess = useCallback(() => {
    console.log('Payment success');
    navigate('/confirmation');
  }, [navigate]);

  const handleProcessPayment = useCallback((processPaymentFn: () => Promise<boolean>) => {
    console.log('Setting payment processor');
    setProcessPayment(() => processPaymentFn);
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    try {
      if (!isCardValid) {
        console.error('Card is not valid');
        return;
      }

      if (!processPayment) {
        console.error('Payment processor not available');
        return;
      }

      console.log('Processing payment...');
      const success = await processPayment();
      console.log('Payment result:', success);

      if (success) {
        console.log('Payment successful, clearing cart and navigating...');
        dispatch(clearCart());
        navigate('/confirmation');
      } else {
        console.error('Payment failed');
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  }, [isCardValid, processPayment, dispatch, navigate]);

  const renderShippingForm = () => (
    <div className="space-y-6">
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            First Name *
          </label>
          <input
            {...register('firstName', { 
              required: 'First name is required',
              minLength: { value: 2, message: 'First name must be at least 2 characters' }
            })}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-dark-primary dark:border-dark-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Last Name *
          </label>
          <input
            {...register('lastName', { 
              required: 'Last name is required',
              minLength: { value: 2, message: 'Last name must be at least 2 characters' }
            })}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-dark-primary dark:border-dark-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.lastName.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Email *
          </label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-dark-primary dark:border-dark-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            Address *
          </label>
          <input
            {...register('address', { 
              required: 'Address is required',
              minLength: { value: 5, message: 'Address must be at least 5 characters' }
            })}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-dark-primary dark:border-dark-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.address.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            City *
          </label>
          <input
            {...register('city', { 
              required: 'City is required',
              minLength: { value: 2, message: 'City must be at least 2 characters' }
            })}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-dark-primary dark:border-dark-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
          />
          {errors.city && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            State *
          </label>
          <input
            {...register('state', { 
              required: 'State is required',
              minLength: { value: 2, message: 'State must be at least 2 characters' }
            })}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-dark-primary dark:border-dark-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.state.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
            ZIP Code *
          </label>
          <input
            {...register('zipCode', { 
              required: 'ZIP code is required',
              pattern: {
                value: /^\d{5}(-\d{4})?$/,
                message: 'Invalid ZIP code format'
              }
            })}
            className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:bg-dark-primary dark:border-dark-primary focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:text-white"
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{errors.zipCode.message}</p>
          )}
        </div>
        <div className="flex justify-end mt-6 md:col-span-2">
          <button
            type="submit"
            className="btn btn-primary"
            onClick={async () => {
              console.log('Next button clicked');
              const formData = getValues();
              console.log('Form data at click:', formData);
              
              // Manually trigger validation
              const shippingFields = [
                'firstName',
                'lastName',
                'email',
                'address',
                'city',
                'state',
                'zipCode'
              ] as const;
              
              const isValid = await trigger(shippingFields);
              console.log('Manual validation result:', isValid);
              
              if (isValid) {
                console.log('Manual validation passed, moving to step 2');
                setActiveStep(2);
              }
            }}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );

  const getStepContent = (step: number) => {
    console.log('Rendering step content for step:', step);
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

  const renderPaymentForm = () => {
    console.log('Rendering payment form, stripePromise:', !!stripePromise);
    if (!stripePromise) {
      return (
        <div className="flex items-center justify-center p-6">
          <div className="text-gray-600 dark:text-gray-400">Loading payment system...</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Elements stripe={stripePromise}>
          <PaymentForm 
            onSuccess={handlePaymentSuccess}
            onValidate={handlePaymentValidation}
            onProcessPayment={handleProcessPayment}
          />
        </Elements>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className="mr-4 btn"
          >
            Back
          </button>
        </div>
      </div>
    );
  };

  const renderReview = () => (
    <div>
      <div>
        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
            </div>
            <p className="font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="pt-4 mt-4 border-t border-gray-200 dark:border-dark-primary">
          <div className="flex justify-between font-bold text-gray-900 dark:text-white">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="button"
          onClick={() => setActiveStep(2)}
          className="mr-4 btn"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handlePlaceOrder}
          disabled={!isCardValid}
          className={`btn btn-primary ${!isCardValid ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isCardValid ? 'Place Order' : 'Card Not Valid'}
        </button>
      </div>
    </div>
  );

  // Add useEffect to monitor step changes
  useEffect(() => {
    console.log('Step changed to:', activeStep);
  }, [activeStep]);

  // Add useEffect to monitor form state
  useEffect(() => {
    if (activeStep === 1) {
      console.log('Shipping form state:', {
        values: {
          firstName: getValues('firstName'),
          lastName: getValues('lastName'),
          email: getValues('email'),
          address: getValues('address'),
          city: getValues('city'),
          state: getValues('state'),
          zipCode: getValues('zipCode'),
        },
        errors: Object.fromEntries(
          Object.entries(errors).filter(([key]) => 
            ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'].includes(key)
          )
        ),
      });
    }
  }, [getValues, errors, activeStep]);

  // Add useEffect to handle step changes
  useEffect(() => {
    if (activeStep === 2) {
      console.log('Rendering payment form...');
    }
  }, [activeStep]);

  // Add a direct step transition function
  const moveToNextStep = useCallback(() => {
    console.log('Moving to next step from', activeStep);
    setActiveStep(prev => prev + 1);
  }, [activeStep]);

  // Add useEffect to handle successful validation
  useEffect(() => {
    if (activeStep === 1 && Object.keys(errors).length === 0) {
      const formData = getValues();
      const hasAllRequiredFields = [
        'firstName',
        'lastName',
        'email',
        'address',
        'city',
        'state',
        'zipCode'
      ].every(field => formData[field as keyof CheckoutFormData]);

      if (hasAllRequiredFields) {
        console.log('All required fields are filled, moving to step 2');
        moveToNextStep();
      }
    }
  }, [errors, getValues, activeStep, moveToNextStep]);

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className={`flex items-center ${activeStep >= 1 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 1 ? 'bg-primary-600 dark:bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                1
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium dark:text-white">Shipping</div>
                <div className="text-xs dark:text-gray-400">Address details</div>
              </div>
            </div>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${
            activeStep >= 2 ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
          }`}></div>
          <div className="flex-1">
            <div className={`flex items-center ${activeStep >= 2 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 2 ? 'bg-primary-600 dark:bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                2
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium dark:text-white">Payment</div>
                <div className="text-xs dark:text-gray-400">Payment method</div>
              </div>
            </div>
          </div>
          <div className={`flex-1 h-0.5 mx-4 ${
            activeStep >= 3 ? 'bg-primary-600 dark:bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
          }`}></div>
          <div className="flex-1">
            <div className={`flex items-center ${activeStep >= 3 ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= 3 ? 'bg-primary-600 dark:bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                3
              </div>
              <div className="ml-3">
                <div className="text-sm font-medium dark:text-white">Review</div>
                <div className="text-xs dark:text-gray-400">Order summary</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="bg-white card dark:bg-dark-secondary">
            <div className="p-6">
              {getStepContent(activeStep)}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white card dark:bg-dark-secondary">
            <div className="p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">Order Summary</h3>
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-gray-200 dark:border-dark-primary">
                <div className="flex justify-between font-bold text-gray-900 dark:text-white">
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