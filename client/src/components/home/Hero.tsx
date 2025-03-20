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
          <source src="https://assets.mixkit.co/videos/preview/mixkit-group-of-people-in-a-working-meeting-in-an-office-42122-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/60 z-1"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
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

      {/* Floating 3D Elements */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:block"
        animate={{
          y: [0, -20, 0],
          rotateZ: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {/* Add 3D floating elements here */}
      </motion.div>
    </div>
  );
};

export default Hero;
