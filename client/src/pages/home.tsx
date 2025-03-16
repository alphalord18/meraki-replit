import { motion } from "framer-motion";
import Hero from "@/components/home/Hero";
import EventHighlights from "@/components/home/EventHighlights";
import Timeline from "@/components/home/Timeline";
import WhyJoinSection from "@/components/home/WhyJoinSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Mail, Brain } from "lucide-react";
import { useState } from "react";

const LiteraryQuiz = () => {
  const [isStarted, setIsStarted] = useState(false);

  return (
    <section className="py-20 bg-[#E8EAF6]">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "Noe Display" }}>
            Test Your Literary Knowledge!
          </h2>
          {!isStarted ? (
            <Button
              size="lg"
              onClick={() => setIsStarted(true)}
              className="bg-[#2E4A7D] hover:bg-[#1B1B1F]"
            >
              <Brain className="mr-2" /> Start Quiz
            </Button>
          ) : (
            <div className="max-w-2xl mx-auto">
              {/* Quiz content will be implemented later */}
              <p className="text-gray-600 mb-4">Quiz coming soon!</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

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

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 bg-[#2E4A7D] text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "Noe Display" }}>
            Stay Updated
          </h2>
          <p className="text-xl mb-8">
            Subscribe to our newsletter for the latest updates and literary content
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white text-black"
            />
            <Button className="bg-[#FFC857] hover:bg-white text-black">
              <Mail className="mr-2" /> Subscribe
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <Timeline />
      </motion.div>
      <LiteraryQuiz />
      <MagazineSection />
      <NewsletterSection />
    </div>
  );
};

export default Home;