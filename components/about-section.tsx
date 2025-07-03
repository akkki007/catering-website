"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const AboutSection = () => {
  const [aboutData, setAboutData] = useState<{ abtText: string; features: string[] }>({
    abtText: '',
    features: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const docRef = doc(db, "Home",'about-section');
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAboutData({
            abtText: data['abt-text'] || '',
            features: [
              data['feature-1'] || '',
              data['feature-2'] || ''
            ].filter(Boolean)
          });
        }
      } catch (error) {
        console.error('Error fetching about data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <section className="py-12 px-4 md:px-8 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">About us</h2>
        
        <p className="text-gray-700 mb-8 leading-relaxed">
          {aboutData.abtText || "A tiffin in the Indian context refers to a light meal or snack, typically eaten between breakfast and dinner, and is especially common during lunch hours."}
        </p>
        
        <div className="flex flex-wrap gap-4">
          {aboutData.features.map((feature, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;