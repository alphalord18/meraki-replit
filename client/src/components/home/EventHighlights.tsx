import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const EventHighlights = () => {
  const { data: events } = useQuery({
    queryKey: ["/api/events"],
  });

  return (
    <section className="py-20 bg-[#E8EAF6]">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-12 text-center"
            style={{ fontFamily: "Noe Display" }}>
          Event Highlights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events?.slice(0, 3).map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </span>
                    <span className="text-sm font-semibold text-[#2E4A7D]">
                      {event.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventHighlights;
