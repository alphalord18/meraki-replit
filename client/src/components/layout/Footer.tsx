import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-[#1B1B1F] text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">MERAKI 2025</h3>
            <p className="text-gray-400">Where Creativity Meets Expression</p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/events">Events</Link></li>
              <li><Link href="/speakers">Speakers</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/sponsors">Sponsors</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@meraki2025.com</li>
              <li>Phone: +91 1234567890</li>
              <li>Address: Your Venue, City</li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              {/* Add social media icons/links here */}
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 Meraki 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
