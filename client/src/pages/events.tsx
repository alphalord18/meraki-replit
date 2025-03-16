import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, MapPin } from "lucide-react";
import type { Event } from "@shared/schema";

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { data: events, isLoading } = useQuery({
    queryKey: ["/api/events"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: "Noe Display" }}>
          Our Events
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events?.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedEvent(event)}
              className="cursor-pointer"
            >
              <Card className="bg-white hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Editorial New Bold" }}>
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{event.description.slice(0, 100)}...</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                    <MapPin className="w-4 h-4" />
                    {event.venue}
                  </div>
                  <div className="mt-4">
                    <span className="inline-block px-3 py-1 bg-[#E8EAF6] text-[#2E4A7D] rounded-full text-sm font-semibold">
                      {event.category}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedEvent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <ScrollArea className="p-6 h-full">
                  <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "Editorial New Bold" }}>
                    {selectedEvent.title}
                  </h2>
                  
                  <div className="flex items-center gap-4 mb-6 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      {new Date(selectedEvent.date).toLocaleTimeString()}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      {selectedEvent.venue}
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-2">About the Event</h3>
                    <p className="mb-6">{selectedEvent.description}</p>

                    <h3 className="text-xl font-semibold mb-2">Rules & Guidelines</h3>
                    <div dangerouslySetInnerHTML={{ __html: selectedEvent.rules }} />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <Button onClick={() => setSelectedEvent(null)}>Close</Button>
                  </div>
                </ScrollArea>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Events;
