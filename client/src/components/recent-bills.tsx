import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";

interface RecentBill {
  id: string;
  billNumber: string;
  serviceName: string;
  serviceProvider: string;
  status: string;
  checkedAt: string;
  serviceId: string;
}

export default function RecentBills() {
  const [, setLocation] = useLocation();
  const [localBills, setLocalBills] = useState<RecentBill[]>([]);

  const { data: recentBills = [] } = useQuery<RecentBill[]>({
    queryKey: ["/api/bills/recent"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  useEffect(() => {
    // Load recent bills from localStorage
    const stored = localStorage.getItem("recentBills");
    if (stored) {
      try {
        setLocalBills(JSON.parse(stored));
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

  // Combine server and local bills, removing duplicates
  const allBills = [...recentBills, ...localBills].reduce((acc, bill) => {
    const existing = acc.find(b => b.billNumber === bill.billNumber && b.serviceName === bill.serviceName);
    if (!existing) {
      acc.push(bill);
    }
    return acc;
  }, [] as RecentBill[]).slice(0, 5); // Show only 5 most recent

  const handleBillClick = (bill: RecentBill) => {
    if (bill.serviceId) {
      setLocation(`/check/${bill.serviceId}`);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  if (allBills.length === 0) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Clock className="text-primary mr-2 h-5 w-5" />
            Recent Bills
          </h3>
          <p className="text-muted-foreground text-sm">
            No recent bill checks found. Check a bill to see it here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Clock className="text-primary mr-2 h-5 w-5" />
          Recent Bills
        </h3>
        <div className="space-y-3">
          {allBills.map((bill, index) => (
            <div
              key={`${bill.id || index}-${bill.billNumber}`}
              className="flex items-center justify-between p-3 bg-muted rounded-md hover:bg-muted/80 transition-colors cursor-pointer"
              onClick={() => handleBillClick(bill)}
              data-testid={`recent-bill-${index}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {bill.serviceName} - {bill.billNumber}
                </p>
                <p className="text-sm text-muted-foreground">
                  {bill.checkedAt ? formatTimeAgo(bill.checkedAt) : 'Recently checked'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={bill.status === 'found' ? 'default' : 'secondary'} className="text-xs">
                  {bill.status}
                </Badge>
                <ExternalLink className="h-4 w-4 text-primary" />
              </div>
            </div>
          ))}
        </div>
        
        {allBills.length >= 5 && (
          <Button variant="ghost" size="sm" className="w-full mt-3" data-testid="button-view-all-recent">
            View All Recent Bills
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
