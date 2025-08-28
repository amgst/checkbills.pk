import { Switch, Route } from "wouter";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import BillCheck from "@/pages/bill-check";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/check/:serviceId" component={BillCheck} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </HelmetProvider>
  );
}

export default App;
