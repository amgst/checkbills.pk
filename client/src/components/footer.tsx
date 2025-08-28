import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  const [, setLocation] = useLocation();

  const serviceLinks = [
    { name: "Electricity Bills", href: "/" },
    { name: "Gas Bills", href: "/" },
    { name: "Mobile Bills", href: "/" },
    { name: "Internet Bills", href: "/" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Contact Us", href: "/contact" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="text-primary h-6 w-6" />
              <h3 className="text-lg font-bold text-primary">BillCheck.pk</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Pakistan's most trusted platform for checking utility bills online.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              {serviceLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => setLocation(link.href)}
                    className="hover:text-primary transition-colors text-left"
                    data-testid={`footer-service-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => setLocation(link.href)}
                    className="hover:text-primary transition-colors text-left"
                    data-testid={`footer-support-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-foreground mb-4">Newsletter</h4>
            <p className="text-muted-foreground mb-4">Get updates about new features</p>
            <div className="flex">
              <Input
                type="email"
                placeholder="Your email"
                className="rounded-r-none"
                data-testid="input-newsletter"
              />
              <Button className="rounded-l-none" data-testid="button-subscribe">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 BillCheck.pk. All rights reserved. | Made with ❤️ for Pakistan</p>
        </div>
      </div>
    </footer>
  );
}
