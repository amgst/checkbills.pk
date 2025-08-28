import { Helmet } from "react-helmet-async";
import Header from "@/components/header";
import Footer from "@/components/footer";
import BillCard from "@/components/bill-card";
import SearchBar from "@/components/search-bar";
import { billServices } from "@/data/services";
import { Zap, Flame, Smartphone, Wifi, Droplets, Settings, Star, Shield, Tv, GraduationCap, Building2 } from "lucide-react";

interface BillService {
  id: string;
  name: string;
  category: string;
  icon: string;
  url: string;
}

const categoryIcons = {
  Electricity: Zap,
  Gas: Flame,
  Mobile: Smartphone,
  Internet: Wifi,
  Water: Droplets,
  "Cable TV": Tv,
  Insurance: Shield,
  Education: GraduationCap,
  Banking: Building2,
  other: Settings,
};

export default function Home() {
  const groupedServices = billServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, BillService[]>);

  return (
    <>
      <Helmet>
        <title>BillCheck.pk - Check All Pakistani Bills Online | Electricity, Gas, Water & More</title>
        <meta name="description" content="Check all Pakistani utility bills online at BillCheck.pk. Check LESCO, FESCO, MEPCO, IESCO, GEPCO, HESCO bills, gas bills (SNGPL, SSGCL), water bills, mobile bills and more instantly." />
        <meta name="keywords" content="pakistan bill check, electricity bill, gas bill, water bill, mobile bill, LESCO, FESCO, MEPCO, IESCO, GEPCO, HESCO, SEPCO, TESCO, SNGPL, SSGCL, PTCL bill" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="BillCheck.pk - Check All Pakistani Bills Online" />
        <meta property="og:description" content="Check electricity, gas, water, mobile and other utility bills for Pakistan instantly" />
        <meta property="og:url" content="https://billcheck.pk" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://billcheck.pk" />
        
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "BillCheck.pk",
            "url": "https://billcheck.pk",
            "description": "Check all Pakistani utility bills online including electricity, gas, water, mobile and more",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://billcheck.pk/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="gradient-hero py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Check All Pakistani Bills <span className="text-primary">Online</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Check electricity, gas, water, mobile, internet and other utility bills instantly. All major Pakistani service providers supported.
            </p>
            
            <SearchBar />
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {Object.entries(groupedServices).map(([category, categoryServices]) => {
              const IconComponent = categoryIcons[category as keyof typeof categoryIcons];
              return (
                <section key={category} className="mb-12">
                  <h2 className="text-2xl font-semibold text-foreground mb-6 flex items-center">
                    <IconComponent className="text-accent mr-3 h-6 w-6" />
                    {category.charAt(0).toUpperCase() + category.slice(1)} Bills
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {categoryServices.map((service) => (
                      <BillCard key={service.id} service={service} />
                    ))}
                  </div>

                </section>
              );
            })}
        </main>

        {/* Features Section */}
        <section className="bg-muted py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose BillCheck.pk?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fast, secure, and reliable bill checking service for all Pakistani utilities
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Get your bill status in seconds with our optimized platform</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">100% Secure</h3>
                <p className="text-muted-foreground">Your personal information is always protected and encrypted</p>
              </div>
              
              <div className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Mobile Friendly</h3>
                <p className="text-muted-foreground">Check bills on any device, anywhere, anytime</p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
