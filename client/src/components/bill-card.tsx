import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface BillService {
  id: string;
  name: string;
  category: string;
  icon: string;
  url: string;
}

interface BillCardProps {
  service: BillService;
}

export default function BillCard({ service }: BillCardProps) {
  const handleCheckBill = () => {
    window.open(service.url, '_blank');
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer group" data-testid={`card-service-${service.name.toLowerCase()}`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">{service.icon}</span>
          <h3 className="font-semibold text-lg">{service.name}</h3>
        </div>
        <p className="text-muted-foreground mb-4 text-sm">Check your {service.name} bill online</p>
        <Button 
          onClick={handleCheckBill}
          className="w-full group-hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          data-testid={`button-check-${service.name.toLowerCase()}`}
        >
          Check on Official Site
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
