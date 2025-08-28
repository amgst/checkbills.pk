import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { billServices } from "@/data/services";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface BillService {
  id: string;
  name: string;
  category: string;
  icon: string;
  url: string;
}

export default function BillCheck() {
  const { serviceId } = useParams();
  const [, setLocation] = useLocation();

  const service = billServices.find(s => s.id === serviceId);

  const handleGoToService = () => {
    if (service?.url) {
      window.open(service.url, '_blank');
    }
  };

  const handleGoBack = () => {
    setLocation('/');
  };

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Alert>
            <AlertDescription>
              Service not found. Please go back and try again.
            </AlertDescription>
          </Alert>
          <Button onClick={handleGoBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Check ${service.name} Bill Online - CheckBills.pk`}</title>
        <meta name="description" content={`Check your ${service.name} bill online. Access the official ${service.name} bill checking portal.`} />
        <meta name="keywords" content={`${service.name}, bill check, pakistan, online bill`} />
        <link rel="canonical" href={`https://checkbills-pk.vercel.app/check/${serviceId}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleGoBack}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Services
          </Button>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center text-2xl">
                  <i className={`${service.icon} mr-3 text-primary`}></i>
                  {service.name}
                </CardTitle>
                <CardDescription className="text-lg">
                  You will be redirected to the official {service.name} bill checking portal.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="p-6 bg-muted rounded-lg">
                  <p className="text-muted-foreground mb-4">
                    Click the button below to access the official {service.name} website where you can:
                  </p>
                  <ul className="text-left text-sm text-muted-foreground space-y-2 max-w-md mx-auto">
                    <li>• Check your current bill amount</li>
                    <li>• View bill details and due dates</li>
                    <li>• Make online payments</li>
                    <li>• Download bill copies</li>
                  </ul>
                </div>
                
                <Button
                  onClick={handleGoToService}
                  className="w-full max-w-sm"
                  size="lg"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Go to {service.name} Website
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  You will be redirected to: {service.url}
                </p>
              </CardContent>
            </Card>
           </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
