import { motion } from "framer-motion";
import { Mic, Feather, Book, Theater } from "lucide-react";

const WhyJoinSection = () => {
  const features = [
    {
      icon: Mic,
      title: "Debate Club",
      description: "Engage in intellectual discourse and showcase your oratory skills"
    },
    {
      icon: Feather,
      title: "Poetry Slams",
      description: "Express your emotions through the power of verse"
    },
    {
      icon: Book,
      title: "Storytelling Contests",
      description: "Weave captivating narratives that leave audiences spellbound"
    },
    {
      icon: Theater,
      title: "Live Performances",
      description: "Bring your literary creations to life on stage"
    }
  ];

  return (
    <section className="py-20 bg-[#F4F4F4]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "Noe Display" }}>
            Join a Community of Literary Geniuses!
          </h2>
          <p className="text-xl text-gray-600">Discover why Meraki is the ultimate destination for literary enthusiasts</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <motion.div
                className="w-16 h-16 mx-auto mb-4 bg-[#2E4A7D] rounded-full flex items-center justify-center text-white"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon size={32} />
              </motion.div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyJoinSection;
