import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin } from "lucide-react";

// Temporary event data
const tempEvents = [
  {
    id: 1,
    title: "Poetry Slam Championship",
    description: "Express your emotions through verses in this competitive poetry event",
    date: "2025-08-23",
    venue: "Main Auditorium",
    category: "Poetry",
    rules: `
      <h4>Rules & Guidelines:</h4>
      <ul>
        <li>Original content only</li>
        <li>3-5 minutes per performance</li>
        <li>No props or musical instruments</li>
        <li>Judging based on content, delivery, and audience impact</li>
      </ul>
    `,
  },
  {
    id: 2,
    title: "Literary Debate Competition",
    description: "Engage in intellectual discourse on contemporary literary topics",
    date: "2025-08-24",
    venue: "Conference Hall",
    category: "Debate",
    rules: `
      <h4>Rules & Guidelines:</h4>
      <ul>
        <li>Teams of 2 members</li>
        <li>7 minutes per speaker</li>
        <li>Topics will be provided 1 hour before the debate</li>
        <li>Constructive arguments and rebuttals expected</li>
      </ul>
    `,
  },
  // Add more events as needed
];

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-12 sm:py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 sm:mb-12 text-center" style={{ fontFamily: "Noe Display" }}>
          Our Events
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {tempEvents.map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedEvent(event)}
              className="cursor-pointer"
            >
              <Card className="bg-white hover:shadow-xl transition-shadow h-full">
                <CardContent className="p-4 sm:p-6 flex flex-col h-full">
                  <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ fontFamily: "Editorial New Bold" }}>
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-4 flex-grow">{event.description}</p>
                  {/* Removed date display as requested */}
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
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedEvent(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <ScrollArea className="p-4 sm:p-6 h-full">
                  <div className="flex flex-col">
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ fontFamily: "Editorial New Bold" }}>
                      {selectedEvent.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-600">
                      {/* Venue information - always visible but responsive */}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        <span className="text-sm sm:text-base">{selectedEvent.venue}</span>
                      </div>
                    </div>

                    <div className="prose max-w-none">
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">About the Event</h3>
                      <p className="mb-6">{selectedEvent.description}</p>

                      <h3 className="text-lg sm:text-xl font-semibold mb-2">Rules & Guidelines</h3>
                      <div dangerouslySetInnerHTML={{ __html: selectedEvent.rules }} />
                    </div>
                    
                    {/* Made button container full-width and always visible */}
                    <div className="mt-8 flex justify-center sm:justify-end w-full">
                      <Button 
                        onClick={() => setSelectedEvent(null)}
                        className="w-full sm:w-auto"
                      >
                        Close
                      </Button>
                    </div>
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
