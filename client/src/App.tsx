import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppSidebar } from "@/components/app-sidebar";
import Dashboard from "@/pages/dashboard";
import StepTracker from "@/pages/step-tracker";
import BMICalculator from "@/pages/bmi-calculator";
import HeartRate from "@/pages/heart-rate";
import BloodPressure from "@/pages/blood-pressure";
import Exercises from "@/pages/exercises";
import Foods from "@/pages/foods";
import HeartTips from "@/pages/heart-tips";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/steps" component={StepTracker} />
      <Route path="/bmi" component={BMICalculator} />
      <Route path="/heart-rate" component={HeartRate} />
      <Route path="/blood-pressure" component={BloodPressure} />
      <Route path="/exercises" component={Exercises} />
      <Route path="/foods" component={Foods} />
      <Route path="/heart-tips" component={HeartTips} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between p-4 border-b bg-background">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                  <div className="max-w-7xl mx-auto">
                    <Router />
                  </div>
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
