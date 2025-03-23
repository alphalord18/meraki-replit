import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const sponsorshipTiers = [
  {
    name: "Gold Sponsor",
    price: "₹50,000",
    benefits: [
      "Premium logo placement on website",
      "VIP access to all events",
      "Dedicated social media promotion",
      "Stage mentions during main events",
      "Exclusive meeting with performers"
    ]
  },
  {
    name: "Silver Sponsor",
    price: "₹30,000",
    benefits: [
      "Logo placement on website",
      "Access to all events",
      "Social media promotion",
      "Stage mentions during select events"
    ]
  },
  {
    name: "Bronze Sponsor",
    price: "₹15,000",
    benefits: [
      "Logo placement on website",
      "Access to main events",
      "Social media mention"
    ]
  }
];

// Temporary past sponsors data
const tempSponsors = [
  {
    id: 1,
    name: "TechCorp Inc.",
    logoUrl: "https://placehold.co/200x200?text=TechCorp",
    website: "https://example.com"
  },
  {
    id: 2,
    name: "Global Books",
    logoUrl: "https://placehold.co/200x200?text=GlobalBooks",
    website: "https://example.com"
  },
  {
    id: 3,
    name: "EduTech Solutions",
    logoUrl: "https://placehold.co/200x200?text=EduTech",
    website: "https://example.com"
  },
  {
    id: 4,
    name: "Creative Arts Foundation",
    logoUrl: "https://placehold.co/200x200?text=CreativeArts",
    website: "https://example.com"
  }
];

const Sponsors = () => {
  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      {/* Sponsorship Packages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-12 text-center" style={{ fontFamily: "Noe Display" }}>
            Become a Sponsor
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {sponsorshipTiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-white h-full flex flex-col">
                  <CardContent className="p-6 flex-grow">
                    <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "Editorial New Bold" }}>
                      {tier.name}
                    </h3>
                    <p className="text-3xl font-bold text-[#2E4A7D] mb-6">{tier.price}</p>
                    <ul className="space-y-3 mb-6">
                      {tier.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#FFC857] rounded-full" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button 
                      className="w-full" 
                      variant="default"
                      onClick={() => window.location.href = '/register'}
                    >
                      <Mail className="mr-2 h-4 w-4" /> Contact Us
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Sponsors */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center" style={{ fontFamily: "Noe Display" }}>
            Past Sponsors
          </h2>

          <div className="relative overflow-hidden">
            <div className="flex animate-scrolling-logos">
              {[...tempSponsors, ...tempSponsors].map((sponsor, index) => (
                <div key={`${sponsor.id}-${index}`} className="flex-none mx-8">
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-32 h-32 grayscale hover:grayscale-0 transition-all"
                  >
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="w-full h-full object-contain"
                    />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sponsors;
