import { motion } from 'framer-motion';
import { 
  Music, 
  Palette, 
  UtensilsCrossed 
} from 'lucide-react';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="about" className="py-20 bg-[#F5F5F5]">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">About The Festival</motion.h2>
          <motion.div variants={itemVariants} className="w-20 h-1 bg-[#06D6A0] mx-auto mb-8"></motion.div>
          <motion.p variants={itemVariants} className="text-lg max-w-3xl mx-auto">
            Meraki Fest is a three-day celebration of music, arts, and culture, bringing together artists and fans from around the world for an unforgettable experience.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[#06D6A0] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Music className="text-[#06D6A0]" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-4">Musical Performances</h3>
            <p className="text-gray-600">Experience live performances from top artists across multiple stages throughout the festival.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[#06D6A0] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Palette className="text-[#06D6A0]" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-4">Art Installations</h3>
            <p className="text-gray-600">Explore stunning visual art pieces and interactive installations from talented creators.</p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-[#06D6A0] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
              <UtensilsCrossed className="text-[#06D6A0]" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-4">Food & Crafts</h3>
            <p className="text-gray-600">Enjoy delicious cuisines from local vendors and shop handcrafted items from artisans.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
