import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FileText, Menu, Star } from "lucide-react";

export default function Header() {
  const [, setLocation] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Help", href: "/help" },
  ];

  return (
    <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              data-testid="link-home"
            >
              <FileText className="text-primary h-8 w-8" />
              <h1 className="text-xl font-bold text-primary">BillCheck.pk</h1>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setLocation(item.href)}
                className="text-foreground hover:text-primary transition-colors"
                data-testid={`nav-${item.name.toLowerCase()}`}
              >
                {item.name}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Button className="hidden sm:flex" data-testid="button-premium">
              <Star className="mr-2 h-4 w-4" />
              Premium
            </Button>
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex items-center space-x-2 mb-8">
                  <FileText className="text-primary h-6 w-6" />
                  <span className="text-lg font-bold text-primary">BillCheck.pk</span>
                </div>
                <nav className="space-y-4">
                  {navigation.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        setLocation(item.href);
                        setIsOpen(false);
                      }}
                      className="block w-full text-left py-2 text-foreground hover:text-primary transition-colors"
                      data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </button>
                  ))}
                  <Button className="w-full mt-6" data-testid="mobile-button-premium">
                    <Star className="mr-2 h-4 w-4" />
                    Premium
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
