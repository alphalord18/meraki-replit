import { useState } from "react";
import { Link } from "wouter";
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

  return (
    <header className="w-full bg-background border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <a className="text-2xl font-bold">MERAKI 2025</a>
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
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

          <Link href="/register">
            <Button className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white">
              Register Now
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
              <Link href="/events">
                <a className="text-lg" onClick={() => setIsMenuOpen(false)}>Events</a>
              </Link>
              <Link href="/speakers">
                <a className="text-lg" onClick={() => setIsMenuOpen(false)}>Speakers</a>
              </Link>
              <Link href="/blog">
                <a className="text-lg" onClick={() => setIsMenuOpen(false)}>Blog</a>
              </Link>
              <Link href="/sponsors">
                <a className="text-lg" onClick={() => setIsMenuOpen(false)}>Sponsors</a>
              </Link>
              <Link href="/contact">
                <a className="text-lg" onClick={() => setIsMenuOpen(false)}>Contact</a>
              </Link>
              <Link href="/register">
                <Button 
                  className="bg-[#FFC857] hover:bg-[#2E4A7D] text-black hover:text-white w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register Now
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;