import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const eventDate = new Date('2025-08-22'); // Updated event date
      const difference = eventDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-4 text-white mt-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div
          key={unit}
          className="flex flex-col items-center bg-black/30 backdrop-blur-sm rounded-lg p-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-4xl font-bold">{value}</span>
          <span className="text-sm uppercase">{unit}</span>
        </motion.div>
      ))}
    </div>
  );
};

const AutoScrollText = () => {
  const items = ["Debates", "Poetry", "Storytelling", "Literary Genius"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key={currentIndex}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-8"
    >
      {items[currentIndex]}
    </motion.div>
  );
};

// 3D Floating Element Components
const FloatingShape = ({ children, className, animationDelay = 0 }) => {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={{
        y: [0, -15, 0],
        rotate: [0, 5, -5, 0],
        scale: [1, 1.05, 0.95, 1],
      }}
      transition={{
        duration: 8,
        delay: animationDelay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};

const MicrophoneIcon = () => (
  <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" 
      fill="none" stroke="#FFC857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 10V12C19 15.866 15.866 19 12 19M5 10V12C5 15.866 8.13401 19 12 19M12 19V23M8 23H16" 
      fill="none" stroke="#FFC857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BookIcon = () => (
  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 19.5C4 18.837 4 18.5055 4.10222 18.2034C4.37962 17.3338 5.13777 16.7014 6.06938 16.5144C6.37905 16.4486 6.75113 16.4486 7.49528 16.4486H20M4 19.5V6.2C4 5.0799 4 4.51984 4.21799 4.09202C4.40973 3.71569 4.71569 3.40973 5.09202 3.21799C5.51984 3 6.0799 3 7.2 3H16.8C17.9201 3 18.4802 3 18.908 3.21799C19.2843 3.40973 19.5903 3.71569 19.782 4.09202C20 4.51984 20 5.0799 20 6.2V16.4486M4 19.5C4 20.163 4 20.4945 4.10222 20.7966C4.37962 21.6662 5.13777 22.2986 6.06938 22.4856C6.37905 22.5514 6.75113 22.5514 7.49528 22.5514H18.8C19.3046 22.5514 19.5569 22.5514 19.7332 22.4453C19.8906 22.3503 20 22.1907 20 22.0138C20 21.819 20 21.5504 20 21.0132V16.4486" 
      stroke="#FFC857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 7H16M8 11H13" stroke="#FFC857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PencilIcon = () => (
  <svg width="70" height="70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20L4 20M8.58579 8.58579L18.5858 18.5858C19.3668 19.3668 19.7573 19.7573 20 20C20.2427 20.2427 20.6332 20.6332 21.4142 21.4142C22.1953 22.1953 22.1953 23.4289 21.4142 24.2099C20.6332 24.991 19.3995 24.991 18.6185 24.2099C17.8374 23.4289 17.447 23.0384 17.2043 22.7957C16.9616 22.553 16.5711 22.1626 15.7901 21.3815L5.79006 11.3815C5.00897 10.6004 4.61843 10.2099 4.3757 9.9672C4.13298 9.72448 3.74244 9.33394 2.96135 8.55285C2.18026 7.77176 2.18026 6.53809 2.96135 5.757C3.74244 4.97591 4.9761 4.97591 5.75719 5.757C6.53828 6.53809 6.92882 6.92863 7.17155 7.17136C7.41428 7.41409 7.80482 7.80463 8.58579 8.58579Z" 
      stroke="#FFC857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 22L4 20M12.5 8.5L16 5M17.5 12L21 8.5" stroke="#FFC857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="90" height="90" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
      stroke="#FFC857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 12H22" stroke="#FFC857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 2C14.5013 4.73835 15.9228 8.29203 16 12C15.9228 15.708 14.5013 19.2616 12 22C9.49872 19.2616 8.07725 15.708 8 12C8.07725 8.29203 9.49872 4.73835 12 2Z" 
      stroke="#FFC857" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/8244250/8244250-uhd_2560_1440_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/60 z-1"></div>
      </div>

      {/* 3D Floating Elements */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        <FloatingShape className="right-12 top-16">
          <MicrophoneIcon />
        </FloatingShape>
        
        <FloatingShape className="right-8 bottom-24" animationDelay={2.5}>
          <BookIcon />
        </FloatingShape>
        
        <FloatingShape className="right-40 bottom-48" animationDelay={3.5}>
          <PencilIcon />
        </FloatingShape>
        
        <FloatingShape className="left-16 top-24" animationDelay={2}>
          <GlobeIcon />
        </FloatingShape>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <motion.h1
            className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFC857] via-yellow-500 to-[#FFC857] mb-6"
            style={{ fontFamily: "Noe Display" }}
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            MERAKI 2025
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-200 mb-4"
            style={{ fontFamily: "Editorial New" }}
          >
            Where Creativity Meets Expression
          </motion.p>

          <div className="text-xl text-[#FFC857] mb-8">
            <AutoScrollText />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white"
              onClick={() => window.location.href = '/register'}
            >
              Register Now <ArrowRight className="ml-2" />
            </Button>
            <Button
              size="lg"
              className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white"
            >
              View Events <Calendar className="ml-2" />
            </Button>
          </motion.div>

          <CountdownTimer />
        </motion.div>
      </div>

      {/* Particles Effect */}
      <div className="absolute inset-0 z-5 opacity-30">
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{ left: '10%', top: '20%' }}
          animate={{ y: [0, 100], opacity: [1, 0] }}
          transition={{ duration: 3, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 0.2 }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{ left: '20%', top: '40%' }}
          animate={{ y: [0, 100], opacity: [1, 0] }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 0.5 }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{ left: '80%', top: '15%' }}
          animate={{ y: [0, 100], opacity: [1, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{ left: '85%', top: '50%' }}
          animate={{ y: [0, 100], opacity: [1, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 1.5 }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{ left: '30%', top: '25%' }}
          animate={{ y: [0, 100], opacity: [1, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 0.8 }}
        />
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-white"
          style={{ left: '70%', top: '35%' }}
          animate={{ y: [0, 100], opacity: [1, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 1.2 }}
        />
      </div>
    </div>
  );
};

export default Hero;
