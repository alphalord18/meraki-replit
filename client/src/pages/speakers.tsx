import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Linkedin, Twitter, Globe } from "lucide-react";
import type { Speaker } from "@shared/schema";

const Speakers = () => {
  const [selectedSpeaker, setSelectedSpeaker] = useState<Speaker | null>(null);

  const { data: speakers, isLoading } = useQuery({
    queryKey: ["/api/speakers"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: "Noe Display" }}>
          Speakers & Judges
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {speakers?.map((speaker) => (
            <motion.div
              key={speaker.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedSpeaker(speaker)}
              className="cursor-pointer"
            >
              <Card className="bg-white hover:shadow-xl transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  <div className="aspect-[3/4] relative">
                    <img
                      src={speaker.imageUrl}
                      alt={speaker.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                      <div className="p-6 text-white">
                        <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "Editorial New Bold" }}>
                          {speaker.name}
                        </h3>
                        <p className="text-sm opacity-90">{speaker.designation}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedSpeaker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedSpeaker(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <ScrollArea className="h-full">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-1/3">
                      <img
                        src={selectedSpeaker.imageUrl}
                        alt={selectedSpeaker.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 md:w-2/3">
                      <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "Editorial New Bold" }}>
                        {selectedSpeaker.name}
                      </h2>
                      <p className="text-xl text-gray-600 mb-4">{selectedSpeaker.designation}</p>
                      
                      <div className="prose max-w-none mb-6">
                        <p>{selectedSpeaker.bio}</p>
                      </div>

                      <div className="flex gap-4">
                        {selectedSpeaker.socialLinks?.linkedin && (
                          <a
                            href={selectedSpeaker.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#2E4A7D]"
                          >
                            <Linkedin className="w-6 h-6" />
                          </a>
                        )}
                        {selectedSpeaker.socialLinks?.twitter && (
                          <a
                            href={selectedSpeaker.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#2E4A7D]"
                          >
                            <Twitter className="w-6 h-6" />
                          </a>
                        )}
                        {selectedSpeaker.socialLinks?.website && (
                          <a
                            href={selectedSpeaker.socialLinks.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-[#2E4A7D]"
                          >
                            <Globe className="w-6 h-6" />
                          </a>
                        )}
                      </div>

                      <div className="mt-8 flex justify-end">
                        <Button onClick={() => setSelectedSpeaker(null)}>Close</Button>
                      </div>
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

export default Speakers;
