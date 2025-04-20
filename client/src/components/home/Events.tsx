import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { day1Events, day2Events, day3Events } from '@/lib/data';
import { Event } from '@/lib/types';

const Events = () => {
  const [activeDay, setActiveDay] = useState('day1');
  
  const handleTabClick = (day: string) => {
    setActiveDay(day);
  };

  const renderEvents = (events: Event[]) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event.id} className="event-card bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img className="w-full h-full object-cover" src={event.image} alt={event.title} />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-gray-600">{event.location}</p>
                </div>
                <span className="bg-[#06D6A0] text-white text-sm font-medium px-3 py-1 rounded-full">{event.time}</span>
              </div>
              <p className="text-gray-700 mb-4">{event.description}</p>
              <a href="#" className="text-[#06D6A0] font-medium hover:underline">View Details</a>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="events" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">Event Schedule</motion.h2>
          <motion.div variants={itemVariants} className="w-20 h-1 bg-[#06D6A0] mx-auto mb-8"></motion.div>
          <motion.p variants={itemVariants} className="text-lg max-w-3xl mx-auto">
            Explore our exciting lineup of performances and activities over the three-day festival.
          </motion.p>
        </motion.div>
        
        {/* Day Tabs */}
        <motion.div 
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="inline-flex rounded-full border border-gray-200 overflow-hidden">
            <button 
              className={`px-8 py-3 font-medium ${activeDay === 'day1' ? 'bg-[#06D6A0] text-white' : 'hover:bg-gray-50'}`}
              onClick={() => handleTabClick('day1')}
            >
              Day 1
            </button>
            <button 
              className={`px-8 py-3 font-medium ${activeDay === 'day2' ? 'bg-[#06D6A0] text-white' : 'hover:bg-gray-50'}`}
              onClick={() => handleTabClick('day2')}
            >
              Day 2
            </button>
            <button 
              className={`px-8 py-3 font-medium ${activeDay === 'day3' ? 'bg-[#06D6A0] text-white' : 'hover:bg-gray-50'}`}
              onClick={() => handleTabClick('day3')}
            >
              Day 3
            </button>
          </div>
        </motion.div>
        
        {/* Events Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            {activeDay === 'day1' && renderEvents(day1Events)}
            {activeDay === 'day2' && renderEvents(day2Events)}
            {activeDay === 'day3' && renderEvents(day3Events)}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Events;
