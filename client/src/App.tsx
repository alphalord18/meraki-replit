import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { queryClient } from "./lib/queryClient";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/home";
import Events from "@/pages/events";
import Speakers from "@/pages/speakers";
import Blog from "@/pages/blog";
import Sponsors from "@/pages/sponsors";
import Register from "@/pages/register";
import Contact from "@/pages/contact";
import NotFound from "@/pages/not-found";
import CombinedTable from "@/pages/registeredschoolsdata";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/events" component={Events} />
          <Route path="/speakers" component={Speakers} />
          <Route path="/blog" component={Blog} />
          <Route path="/sponsors" component={Sponsors} />
          <Route path="/register" component={Register} />
          <Route path="/contact" component={Contact} />
          <Route path="/registeredschoolsdata" component={CombinedTable} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
