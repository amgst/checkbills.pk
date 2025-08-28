import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { BillService } from "@shared/schema";
import { Search } from "lucide-react";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, setLocation] = useLocation();

  const { data: services = [] } = useQuery<BillService[]>({
    queryKey: ["/api/services"],
  });

  const filteredServices = services.filter(
    service =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    if (filteredServices.length > 0) {
      setLocation(`/check/${filteredServices[0].id}`);
      setShowSuggestions(false);
      setSearchQuery("");
    }
  };

  const handleServiceSelect = (service: BillService) => {
    setLocation(`/check/${service.id}`);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
    if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for bill type or service provider..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(e.target.value.length > 0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(searchQuery.length > 0)}
          className="w-full px-6 py-4 text-lg pr-20"
          data-testid="input-search"
        />
        <Button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 px-6 py-2"
          data-testid="button-search"
        >
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showSuggestions && filteredServices.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-64 overflow-y-auto">
          <CardContent className="p-0">
            {filteredServices.slice(0, 6).map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceSelect(service)}
                className="p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 flex items-center"
                data-testid={`suggestion-${service.name.toLowerCase()}`}
              >
                <i className={`${service.icon} text-primary mr-3`}></i>
                <div>
                  <div className="font-medium">{service.name}</div>
                  <div className="text-sm text-muted-foreground">{service.provider}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {showSuggestions && searchQuery.length > 0 && filteredServices.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50">
          <CardContent className="p-4 text-center text-muted-foreground">
            No services found for "{searchQuery}"
          </CardContent>
        </Card>
      )}
    </div>
  );
}
