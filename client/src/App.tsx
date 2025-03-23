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
import { routes, usePrefetchRoutes } from "./lib/routes";

function Router() {
  usePrefetchRoutes();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          {routes.map(route => (
            <Route key={route.path} path={route.path} component={route.component} />
          ))}
          <Route component={notFoundRoute.component} />
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
