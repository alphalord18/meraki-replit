import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import type { Blog } from "@shared/schema";

const Blog = () => {
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["/api/blogs"],
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: "Noe Display" }}>
          Blog & Literary Works
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogs?.map((blog) => (
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
