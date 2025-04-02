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
        <Link href="/">
          <a className="text-2xl font-bold">MERAKI 2025</a>
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
                <Link href="/events">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Events
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/speakers">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Speakers
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/blog">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Blog
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/sponsors">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Sponsors
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contact">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Button asChild className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white">
            <Link href="/register">Register Now</Link>
          </Button>
        </div>

        {/* Mobile Navigation - compact with auto height */}
        {isMenuOpen && (
         <div className="absolute top-16 left-0 right-0 bg-background border-b shadow-lg z-40 md:hidden">
            <nav className="container mx-auto px-4 py-4 flex flex-col items-center gap-4">
              <Link href="/events">
                <a className="text-lg py-2 text-center w-full hover:text-[#FFC857]">Events</a>
              </Link>
              <Link href="/speakers">
                <a className="text-lg py-2 text-center w-full hover:text-[#FFC857]">Speakers</a>
              </Link>
              <Link href="/blog">
                <a className="text-lg py-2 text-center w-full hover:text-[#FFC857]">Blog</a>
              </Link>
              <Link href="/sponsors">
                <a className="text-lg py-2 text-center w-full hover:text-[#FFC857]">Sponsors</a>
              </Link>
              <Link href="/contact">
                <a className="text-lg py-2 text-center w-full hover:text-[#FFC857]">Contact</a>
              </Link>
              <Button 
                asChild 
                className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white w-full mt-2"
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
