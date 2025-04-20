import { motion } from 'framer-motion';
import { artists } from '@/lib/data';

const Artists = () => {
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
    <section id="artists" className="py-20 bg-[#0E1F33] text-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4">Featured Artists</motion.h2>
          <motion.div variants={itemVariants} className="w-20 h-1 bg-[#06D6A0] mx-auto mb-8"></motion.div>
          <motion.p variants={itemVariants} className="text-lg max-w-3xl mx-auto">
            Meet the incredible performers bringing their talent to Meraki Fest 2023.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {artists.map((artist) => (
            <motion.div key={artist.id} className="text-center" variants={itemVariants}>
              <div className="artist-image w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden mx-auto mb-4">
                <img className="w-full h-full object-cover" src={artist.image} alt={artist.name} />
              </div>
              <h3 className="text-xl font-semibold mb-1">{artist.name}</h3>
              <p className="text-gray-400">{artist.genre}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Artists;
