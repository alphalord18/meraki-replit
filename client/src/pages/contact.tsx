import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin } from "lucide-react";
import type { FormEvent } from "react";
import emailjs from '@emailjs/browser';

// Define email data interface
interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [pageLoaded, setPageLoaded] = useState<boolean>(false);
  const { toast } = useToast();

  // Initialize EmailJS with your user ID (this should be done at the app level ideally)
  emailjs.init('G9JIIT4BFWZuaL1k5');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: name,
        from_email: "aaravgarg649@gmail.com",
        to_email: "aaravgarg1812@gmail.com",
        reply_to: email,
        subject: subject || `New message from ${name}`,
        message: message,
        name: name,
        email: email
      };

      // Send email using EmailJS - this happens directly from the browser
      // Replace these IDs with your actual EmailJS service and template IDs
      const response = await emailjs.send(
        'service_meraki',
        'template_email',
        templateParams
      );

      if (response.status === 200) {
        toast({
          title: "Message sent",
          description: "We'll get back to you soon!",
        });
        
        // Reset form
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        throw new Error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-[#F4F4F4] py-20"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: "Noe Display" }}>
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Subject</label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <div className="relative w-full h-40">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="absolute inset-0 w-full h-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 overflow-auto"
                    />
                  </div>
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#2E4A7D]" />
                    <a href="mailto:meraki@jaipuria.com" className="hover:text-[#2E4A7D]">
                      meraki@jaipuria.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#2E4A7D]" />
                    <a href="tel:+918887787985" className="hover:text-[#2E4A7D]">
                      +91 88877 87985
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#2E4A7D]" />
                    <address className="not-italic">
                      Seth M.R. Jaipuria School, Vineet Khand, Gomti Nagar
                      <br />
                      Lucknow, India 226010
                    </address>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="h-[400px] rounded-lg overflow-hidden relative">
              <iframe
                src="https://www.google.com/maps/embed/v1/place?key=AIzaSyB2NIWI3Tv9iDPrlnowr_0ZqZWoAQydKJU&q=Seth%20M.%20R.%20Jaipuria%20School%2C%20Vineet%20Khand%2C%20Gomti%20Nagar%2C%20Lucknow%2C%20Uttar%20Pradesh%2C%20India&zoom=16&maptype=roadmap"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setPageLoaded(true)}
              />
              {!pageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2E4A7D]"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;
