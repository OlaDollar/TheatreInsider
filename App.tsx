import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import News from "@/pages/news";
import Reviews from "@/pages/reviews";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Admin from "@/pages/admin";
import Performers from "@/pages/performers";
import PerformerDetail from "@/pages/performer-detail";
import Newsletter from "@/pages/newsletter";
import Theatres from "@/pages/theatres";

import DailyCrossword from "@/pages/daily-crossword";
import DailyFacts from "@/pages/daily-facts";
import WhatsOn from "@/pages/whats-on";
import ArtsEducation from "@/pages/arts-education";
import Awards from "@/pages/awards";
import NotFound from "@/pages/not-found";
import Header from "@/components/header";
import Footer from "@/components/footer";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/news" component={News} />
          <Route path="/reviews" component={Reviews} />
          <Route path="/whats-on" component={WhatsOn} />
          <Route path="/theatres" component={Theatres} />
          <Route path="/crossword" component={DailyCrossword} />
          <Route path="/facts" component={DailyFacts} />
          <Route path="/performers" component={Performers} />
          <Route path="/performers/:slug" component={PerformerDetail} />
          <Route path="/arts-education" component={ArtsEducation} />
          <Route path="/awards" component={Awards} />
          <Route path="/newsletter" component={Newsletter} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/admin" component={Admin} />
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
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
