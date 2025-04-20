import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  const [pageLoaded, setPageLoaded] = useState(false);

  return (
    <motion.div 
      className="min-h-screen bg-[#F4F4F4] py-20"
    >
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: "Noe Display" }}>
          Contact Us
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="h-full">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Mail className="w-8 h-8 text-[#2E4A7D]" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Email</h3>
                    <a href="mailto:meraki@jaipuria.com" className="text-lg hover:text-[#2E4A7D]">
                      meraki@jaipuria.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Phone className="w-8 h-8 text-[#2E4A7D]" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Phone</h3>
                    <a href="tel:+918887787985" className="text-lg hover:text-[#2E4A7D]">
                      +91 88877 87985
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <MapPin className="w-8 h-8 text-[#2E4A7D] mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold mb-1">Address</h3>
                    <address className="not-italic text-lg">
                      Seth M.R. Jaipuria School<br />
                      Vineet Khand, Gomti Nagar<br />
                      Lucknow, India 226010
                    </address>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="h-[600px] rounded-lg overflow-hidden relative">
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
    </motion.div>
  );
};

export default Contact;