import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import EventHighlights from "@/components/home/EventHighlights";
import Timeline from "@/components/home/Timeline";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <EventHighlights />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Timeline />
      </motion.div>
    </div>
  );
};

export default Home;
