import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { billCheckRequestSchema, type BillCheckRequest, type BillService } from "@shared/schema";
import { ArrowLeft, CreditCard, Calendar, User, FileText, AlertCircle, CheckCircle } from "lucide-react";

interface BillCheckResponse {
  success: boolean;
  billData?: {
    billNumber: string;
    customerReference?: string;
    customerName: string;
    billingMonth: string;
    amount: number;
    dueDate: string;
    status: string;
    serviceProvider: string;
  };
  status: string;
  service: string;
  checkId: string;
}

export default function BillCheck() {
  const { serviceId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [billResult, setBillResult] = useState<BillCheckResponse | null>(null);

  const { data: services, isLoading: servicesLoading } = useQuery<BillService[]>({
    queryKey: ["/api/services"],
  });

  const service = services?.find(s => s.id === serviceId);
  const serviceLoading = servicesLoading;

  const form = useForm<BillCheckRequest>({
    resolver: zodResolver(billCheckRequestSchema),
    defaultValues: {
      serviceId: serviceId || "",
      billNumber: "",
      customerReference: "",
    },
  });

  const checkBillMutation = useMutation({
    mutationFn: async (data: BillCheckRequest) => {
      const response = await apiRequest("POST", "/api/bills/check", data);
      return response.json();
    },
    onSuccess: (data: BillCheckResponse) => {
      setBillResult(data);
      queryClient.invalidateQueries({ queryKey: ["/api/bills/recent"] });
      
      if (data.success) {
        toast({
          title: "Bill Found!",
          description: `Bill details retrieved successfully for ${data.service}.`,
        });
      } else {
        toast({
          title: "Bill Not Found",
          description: "Please verify your bill number and try again.",
          variant: "destructive",
        });
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to check bill. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BillCheckRequest) => {
    checkBillMutation.mutate(data);
  };

  if (serviceLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading service details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Service not found. Please go back and try again.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Check ${service.name} Bill Online - BillCheck.pk`}</title>
        <meta name="description" content={`Check your ${service.name} (${service.provider}) bill online instantly. Get bill details, amount due, and payment status.`} />
        <meta name="keywords" content={`${service.name}, ${service.provider}, bill check, pakistan, online bill`} />
        <link rel="canonical" href={`https://billcheck.pk/check/${serviceId}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-6"
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bill Check Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className={`${service.icon} mr-3 text-primary`}></i>
                  {service.name} Bill Check
                </CardTitle>
                <CardDescription>
                  {service.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="billNumber">Bill Number / Reference Number</Label>
                    <Input
                      id="billNumber"
                      placeholder="Enter your bill number"
                      {...form.register("billNumber")}
                      data-testid="input-bill-number"
                    />
                    {form.formState.errors.billNumber && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.billNumber.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="customerReference">Customer Reference (Optional)</Label>
                    <Input
                      id="customerReference"
                      placeholder="Enter customer reference if available"
                      {...form.register("customerReference")}
                      data-testid="input-customer-reference"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={checkBillMutation.isPending}
                    data-testid="button-check-bill"
                  >
                    {checkBillMutation.isPending ? "Checking..." : "Check Bill"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Bill Result */}
            <div>
              {billResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {billResult.success ? (
                        <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="mr-2 h-5 w-5 text-destructive" />
                      )}
                      Bill Check Result
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {billResult.success && billResult.billData ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Status</span>
                          <Badge variant={billResult.billData.status === 'paid' ? 'default' : 'destructive'}>
                            {billResult.billData.status.toUpperCase()}
                          </Badge>
                        </div>
                        
                        <Separator />
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              Customer Name
                            </span>
                            <span className="font-medium">{billResult.billData.customerName}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <FileText className="mr-2 h-4 w-4" />
                              Bill Number
                            </span>
                            <span className="font-medium">{billResult.billData.billNumber}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <Calendar className="mr-2 h-4 w-4" />
                              Billing Month
                            </span>
                            <span className="font-medium">{billResult.billData.billingMonth}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <CreditCard className="mr-2 h-4 w-4" />
                              Amount Due
                            </span>
                            <span className="font-bold text-lg">PKR {billResult.billData.amount.toLocaleString()}</span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center">
                              <Calendar className="mr-2 h-4 w-4" />
                              Due Date
                            </span>
                            <span className="font-medium">{billResult.billData.dueDate}</span>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <Button className="w-full" data-testid="button-pay-bill">
                          Pay Bill Online
                        </Button>
                      </div>
                    ) : (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Bill not found. Please verify your bill number and try again.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          
        </main>

        <Footer />
      </div>
    </>
  );
}
