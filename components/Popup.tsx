"use client";
import React, { useState, useEffect } from 'react';
import { X, Star, Clock, Flame, Sparkles, Phone, ShoppingCart } from 'lucide-react';

const ModernOffersPopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentOffer, setCurrentOffer] = useState(0);

  const offers = [
    {
      type: "trending",
      badge: "🔥 Trending Now",
      title: "Special Maharashtrian Thali",
      subtitle: "Most Ordered This Week",
      description: "Authentic homestyle thali with dal, bhaji, rice, chapati, pickle & sweet",
      originalPrice: "₹250",
      offerPrice: "₹199",
      discount: "20% OFF",
      image: "🍛",
      features: ["Fresh & Hot", "Home Style", "4.8 ⭐ Rating"],
      urgency: "Only 15 orders left today!",
      bgGradient: "from-orange-400 via-red-400 to-pink-500"
    },
    {
      type: "offer",
      badge: "💰 Best Deal",
      title: "Tiffin Subscription",
      subtitle: "Monthly Special Offer",
      description: "Get healthy, fresh meals delivered daily to your doorstep",
      originalPrice: "₹4500",
      offerPrice: "₹3299",
      discount: "27% OFF",
      image: "🥘",
      features: ["30 Days", "Free Delivery", "Customizable"],
      urgency: "Offer expires in 2 days!",
      bgGradient: "from-green-400 via-blue-400 to-purple-500"
    },
    {
      type: "festival",
      badge: "🎉 Festival Special",
      title: "Diwali Faral Box",
      subtitle: "Traditional Sweets & Snacks",
      description: "Premium collection of traditional Diwali sweets and savory items",
      originalPrice: "₹800",
      offerPrice: "₹599",
      discount: "25% OFF",
      image: "🍮",
      features: ["10+ Varieties", "Fresh Made", "Gift Packaging"],
      urgency: "Pre-order now for Diwali!",
      bgGradient: "from-yellow-400 via-orange-400 to-red-500"
    }
  ];

  // Auto-show popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate offers every 5 seconds when popup is open
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setCurrentOffer((prev) => (prev + 1) % offers.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isVisible, offers.length]);

  const closePopup = () => {
    setIsVisible(false);
  };

  const currentOfferData = offers[currentOffer];

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      {/* Popup Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl transform animate-slideUp overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={closePopup}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header with Gradient Background */}
        <div className={`relative bg-gradient-to-br ${currentOfferData.bgGradient} p-6 text-white overflow-hidden`}>
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>
          
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-3">
            <Sparkles className="w-4 h-4 mr-1" />
            {currentOfferData.badge}
          </div>

          {/* Food Emoji/Icon */}
          <div className="text-6xl mb-3 text-center">
            {currentOfferData.image}
          </div>

          {/* Title & Subtitle */}
          <h3 className="text-xl font-bold mb-1 text-center">
            {currentOfferData.title}
          </h3>
          <p className="text-white/90 text-sm text-center mb-4">
            {currentOfferData.subtitle}
          </p>

          {/* Price Section */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl font-bold">
                {currentOfferData.offerPrice}
              </span>
              <span className="text-lg line-through text-white/80">
                {currentOfferData.originalPrice}
              </span>
            </div>
            <div className="inline-flex items-center px-3 py-1 bg-white text-green-600 rounded-full text-sm font-bold">
              <Flame className="w-4 h-4 mr-1" />
              {currentOfferData.discount}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Description */}
          <p className="text-gray-600 mb-4 text-center">
            {currentOfferData.description}
          </p>

          {/* Features */}
          <div className="flex justify-center gap-4 mb-4">
            {currentOfferData.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-500">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                {feature}
              </div>
            ))}
          </div>

          {/* Urgency Message */}
          <div className="flex items-center justify-center mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
            <Clock className="w-4 h-4 text-red-500 mr-2" />
            <span className="text-red-600 text-sm font-medium">
              {currentOfferData.urgency}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button className={`w-full bg-gradient-to-r ${currentOfferData.bgGradient} hover:shadow-lg text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center`}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              Order Now
            </button>
            
            <button className="w-full border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center">
              <Phone className="w-5 h-5 mr-2" />
              Call to Order
            </button>
          </div>

          {/* Offer Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {offers.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentOffer(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentOffer ? 'bg-orange-400 w-6' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Bottom Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-yellow-400 to-red-500"></div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(100px) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ModernOffersPopup;