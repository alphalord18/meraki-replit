import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const timelineData = [
  {
    date: "March 15, 2025",
    title: "Registrations Open",
    description: "Begin your journey with Meraki 2025"
  },
  {
    date: "April 1, 2025",
    title: "Preliminary Rounds",
    description: "First stage of competitions begin"
  },
  {
    date: "April 15, 2025",
    title: "Semi Finals",
    description: "Best performers compete"
  },
  {
    date: "May 1, 2025",
    title: "Grand Finale",
    description: "Witness the ultimate showdown"
  }
];

const Timeline = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center"
            style={{ fontFamily: "Noe Display" }}>
          Event Timeline
        </h2>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#2E4A7D]" />

          {/* Timeline items */}
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`flex items-center mb-8 ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="w-1/2 px-4">
                <Card className={index % 2 === 0 ? "ml-auto" : "mr-auto"}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                    <span className="text-sm text-[#2E4A7D] font-semibold">
                      {item.date}
                    </span>
                  </CardContent>
                </Card>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#FFC857] rounded-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
