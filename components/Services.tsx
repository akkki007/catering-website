import React from 'react'
import { Button } from './ui/button'
import Service from './Service'

const Services = () => {
  return (
   <section className='py-12 sm:py-16 lg:py-24'>
  <div className='container px-4 mx-auto max-w-screen-xl'>
    <h2 className='mb-4 text-3xl font-semibold tracking-tighter text-center text-gray-900 dark:text-white sm:text-4xl lg:text-5xl'>
  Our Services
</h2>
<div className='w-40 h-1 bg-yellow-400 mx-auto mb-8 sm:mb-12 rounded-full'></div>

    
    {/* Centered grid with justify-center */}
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 justify-items-center'>
      <Service
  imageUrl="/tiffin.jpg"
  title="Tiffin Service"
  description="A tiffin in the Indian context refers to a light meal or snack, typically eaten between breakfast and dinner, and is especially common during lunch hours.
Daily fresh meals"
  buttonText="Learn More"
/>
<Service
  imageUrl="/catering.jpeg"
  title="Catering Service"
  description="Professional catering services for all your special events, parties, and corporate gatherings. We customize menus according to your preferences and dietary requirements."
  buttonText="Learn More"
/>
<Service
  imageUrl="/modak_dish.png"
  title="Modak Dish"
  description="Modak, Lord Ganesha's beloved sweet, offers a delightful taste of Maharashtrian tradition. These soft, steamed dumplings are filled with a luscious blend of fresh coconut and sweet jaggery, creating an irresistible treat"
  buttonText="Learn More"
/>
 <Service
  imageUrl="/tiffin.jpg"
  title="Tiffin Service"
  description="A tiffin in the Indian context refers to a light meal or snack, typically eaten between breakfast and dinner, and is especially common during lunch hours.
Daily fresh meals"
  buttonText="Learn More"
/>
<Service
  imageUrl="/catering.jpeg"
  title="Catering Service"
  description="Professional catering services for all your special events, parties, and corporate gatherings. We customize menus according to your preferences and dietary requirements."
  buttonText="Learn More"
/>
<Service
  imageUrl="/modak_dish.png"
  title="Modak Dish"
  description="Boost your online presence with our expert marketing strategies."
  buttonText="Learn More"
/>
    </div>
  </div>
</section>
  )
}

export default Services