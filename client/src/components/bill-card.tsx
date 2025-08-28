import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BillService } from "@shared/schema";

interface BillCardProps {
  service: BillService;
}

export default function BillCard({ service }: BillCardProps) {
  const [, setLocation] = useLocation();

  const handleCheckBill = () => {
    setLocation(`/check/${service.id}`);
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
          className="w-full group-hover:bg-primary/90 transition-colors"
          data-testid={`button-check-${service.name.toLowerCase()}`}
        >
          Check Bill
        </Button>
      </CardContent>
    </Card>
  );
}
