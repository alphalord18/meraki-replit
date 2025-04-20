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
    <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-4 text-white mt-6 md:mt-8">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <motion.div
          key={unit}
          className="flex flex-col items-center bg-black/30 backdrop-blur-sm rounded-lg p-2 md:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-2xl md:text-4xl font-bold">{value}</span>
          <span className="text-xs md:text-sm uppercase">{unit}</span>
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-8"
    >
      {items[currentIndex]}
    </motion.div>
  );
};

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Video Background - z-index adjusted to ensure it doesn't interfere with navigation */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <video 
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="https://videos.pexels.com/video-files/8244322/uhd_25fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay with z-index adjusted */}
        <div className="absolute inset-0 bg-black/60" style={{ zIndex: 1 }}></div>
      </div>

      {/* Content - z-index increased to ensure it's above the background but below navigation */}
      <div className="container mx-auto px-4 relative" style={{ zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto md:mx-0"
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFC857] via-yellow-500 to-[#FFC857] mb-4 md:mb-6 text-center md:text-left"
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
            className="text-lg md:text-xl lg:text-2xl text-gray-200 mb-3 md:mb-4 text-center md:text-left"
            style={{ fontFamily: "Editorial New" }}
          >
            Where Creativity Meets Expression
          </motion.p>

          <div className="text-lg md:text-xl text-[#FFC857] mb-6 md:mb-8 text-center md:text-left">
            <AutoScrollText />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4"
          >
            <Button
              size="lg"
              className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white text-sm md:text-base"
              onClick={() => document.location.href = '/register'}
            >
              Register Now <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
            <Button
              size="lg"
              className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white text-sm md:text-base"
            >
              View Events <Calendar className="ml-2 w-4 h-4 md:w-5 md:h-5" />
            </Button>
          </motion.div>

          <CountdownTimer />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
