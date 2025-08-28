import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { BillService } from "@shared/schema";

interface BillCardProps {
  service: BillService;
}

export default function BillCard({ service }: BillCardProps) {
  const [, setLocation] = useLocation();

  const handleCheckBill = () => {
    // Check if it's an external URL (starts with http)
    if (service.apiEndpoint?.startsWith('http')) {
      // Open official website in new tab
      window.open(service.apiEndpoint, '_blank');
    } else {
      // Use internal page for other services
      setLocation(`/check/${service.id}`);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group" data-testid={`card-service-${service.name.toLowerCase()}`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <i className={`${service.icon} text-primary text-2xl mr-3`}></i>
          <h3 className="font-semibold text-lg">{service.name}</h3>
        </div>
        <p className="text-muted-foreground mb-4 text-sm">{service.description}</p>
        <Button 
          onClick={handleCheckBill}
          className="w-full group-hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          data-testid={`button-check-${service.name.toLowerCase()}`}
        >
          {service.apiEndpoint?.startsWith('http') ? (
            <>
              Check on Official Site
              <ExternalLink className="h-4 w-4" />
            </>
          ) : (
            'Check Bill'
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
