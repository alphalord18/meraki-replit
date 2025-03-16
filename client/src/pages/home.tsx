import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import EventHighlights from "@/components/home/EventHighlights";
import WhyJoinSection from "@/components/home/WhyJoinSection";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const MagazineSection = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "Noe Display" }}>
          Download Meraki Magazine
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Featuring the best stories, interviews, and literary works
        </p>
        <Button size="lg" className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white">
          <Download className="mr-2" /> Download Now
        </Button>
      </motion.div>
    </div>
  </section>
);

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
        <WhyJoinSection />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <EventHighlights />
      </motion.div>
      <MagazineSection />
    </div>
  );
};

export default Home;