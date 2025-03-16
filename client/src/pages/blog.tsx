import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

// Temporary blog data
const tempBlogs = [
  {
    id: 1,
    title: "The Evolution of Modern Poetry",
    author: "Dr. Sarah Johnson",
    content: `<p>In recent years, we've witnessed a remarkable transformation in how poetry is created, shared, and consumed. The digital age has brought forth new forms of expression, challenging traditional conventions while preserving the essence of poetic artistry.</p>
    <p>Modern poets are increasingly experimenting with multimedia elements, combining words with visual and auditory components to create immersive experiences. This evolution reflects our changing relationship with language and communication in the digital era.</p>
    <p>The democratization of poetry through social media and online platforms has also led to the emergence of diverse voices and perspectives, enriching the literary landscape in unprecedented ways.</p>`,
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80",
    createdAt: "2025-02-15"
  },
  {
    id: 2,
    title: "Storytelling in the Digital Age",
    author: "Prof. James Mitchell",
    content: `<p>The art of storytelling has undergone a significant transformation with the advent of digital technology. While the fundamental elements of a compelling narrative remain unchanged, the mediums through which stories are told have multiplied exponentially.</p>
    <p>Digital platforms have enabled interactive storytelling, where readers can influence the narrative's direction, creating a more engaging and personalized experience. This has led to the emergence of new literary forms that blur the lines between traditional storytelling and interactive entertainment.</p>`,
    imageUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80",
    createdAt: "2025-02-20"
  }
];

type Blog = {
  id: number;
  title: string;
  author: string;
  content: string;
  imageUrl: string;
  createdAt: string;
};

const Blog = () => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: "Noe Display" }}>
          Blog & Literary Works
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tempBlogs.map((blog) => (
            <motion.div
              key={blog.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedBlog(blog)}
              className="cursor-pointer"
            >
              <Card className="bg-white hover:shadow-xl transition-shadow overflow-hidden">
                <CardContent className="p-0">
                  {blog.imageUrl && (
                    <div className="aspect-video">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <Calendar className="w-4 h-4" />
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </div>
                    <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Editorial New Bold" }}>
                      {blog.title}
                    </h3>
                    <p className="text-gray-600">{blog.content.slice(0, 150)}...</p>
                    <p className="text-sm text-[#2E4A7D] mt-4">By {blog.author}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {selectedBlog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedBlog(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <ScrollArea className="h-full">
                  {selectedBlog.imageUrl && (
                    <div className="aspect-video">
                      <img
                        src={selectedBlog.imageUrl}
                        alt={selectedBlog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-8">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedBlog.createdAt).toLocaleDateString()}
                    </div>
                    <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: "Editorial New Bold" }}>
                      {selectedBlog.title}
                    </h2>
                    <p className="text-gray-600 mb-6">By {selectedBlog.author}</p>

                    <div className="prose max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: selectedBlog.content }} />
                    </div>

                    <div className="mt-8 flex justify-end">
                      <Button onClick={() => setSelectedBlog(null)}>Close</Button>
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

export default Blog;