import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  // Close mobile menu when changing location
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <header 
      className={`w-full fixed top-0 left-0 right-0 transition-all duration-300 z-50 ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-background"
      } border-b`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          MERAKI 2025
        </Link>

        {/* Mobile Menu Button - increased z-index */}
        <button
          className="md:hidden relative z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/events">Events</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/speakers">Speakers</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/blog">Blog</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/sponsors">Sponsors</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/contact">Contact</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Button asChild className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white">
            <Link href="/register">Register Now</Link>
          </Button>
        </div>

        {/* Mobile Navigation - compact with auto height */}
        {isMenuOpen && (
          <div 
            className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg z-40 md:hidden 
            animate-in fade-in slide-in-from-top duration-300"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-col items-center gap-6">
              <Link href="/events" className="text-lg py-3 text-center w-full hover:text-[#FFC857] transition-colors">
                Events
              </Link>
              <Link href="/speakers" className="text-lg py-3 text-center w-full hover:text-[#FFC857] transition-colors">
                Speakers
              </Link>
              <Link href="/blog" className="text-lg py-3 text-center w-full hover:text-[#FFC857] transition-colors">
                Blog
              </Link>
              <Link href="/sponsors" className="text-lg py-3 text-center w-full hover:text-[#FFC857] transition-colors">
                Sponsors
              </Link>
              <Link href="/contact" className="text-lg py-3 text-center w-full hover:text-[#FFC857] transition-colors">
                Contact
              </Link>
              <Button 
                asChild 
                className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white w-full mt-4 transition-colors"
              >
                <Link href="/register">Register Now</Link>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
