"use client"
import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Service from './Service';

interface ServiceData {
  id: string;
  img?: string;
  title?: string;
  description?: string;
  [key: string]: any;
}

const Services = () => {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Services'));
        console.log(querySnapshot);
        
        interface ServiceData {
          id: string;
          img?: string;
          title?: string;
          description?: string;
          [key: string]: any;
        }
        const servicesData: ServiceData[] = [];
        
        querySnapshot.forEach((doc) => {
          servicesData.push({
            id: doc.id,
            ...doc.data()
          });
        });
        console.log(servicesData);
        setServices(servicesData);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className='py-12 sm:py-16 lg:py-24'>
        <div className='container px-4 mx-auto max-w-screen-xl'>
          <h2 className='mb-4 text-3xl font-semibold tracking-tighter text-center text-gray-900 sm:text-4xl lg:text-5xl'>
            Our Services
          </h2>
          <div className='w-40 h-1 bg-yellow-400 mx-auto mb-8 sm:mb-12 rounded-full'></div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center'>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full bg-gray-100 rounded-lg p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className='py-12 sm:py-16 lg:py-24'>
      <div className='container px-4 mx-auto max-w-screen-xl'>
        <h2 className='mb-4 text-3xl font-semibold tracking-tighter text-center text-gray-900 sm:text-4xl lg:text-5xl'>
          Our Services
        </h2>
        <div className='w-40 h-1 bg-yellow-400 mx-auto mb-8 sm:mb-12 rounded-full'></div>
        
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center'>
          {services.map((service) => (
            <Service
              key={service.id}
              imageUrl={service.img || "/default-service.jpg"}
              title={service.title || "Our Service"}
              description={service.description || "Premium service with quality assurance"}
              buttonText="Learn More" // Default button text as requested
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;