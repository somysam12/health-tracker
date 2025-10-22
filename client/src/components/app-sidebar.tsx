import {
  Activity,
  Heart,
  Footprints,
  Calculator,
  Droplet,
  Dumbbell,
  Apple,
  Info,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Activity,
    testId: "nav-dashboard",
  },
  {
    title: "Step Tracker",
    url: "/steps",
    icon: Footprints,
    testId: "nav-steps",
  },
  {
    title: "BMI Calculator",
    url: "/bmi",
    icon: Calculator,
    testId: "nav-bmi",
  },
  {
    title: "Heart Rate",
    url: "/heart-rate",
    icon: Heart,
    testId: "nav-heart-rate",
  },
  {
    title: "Blood Pressure",
    url: "/blood-pressure",
    icon: Droplet,
    testId: "nav-blood-pressure",
  },
  {
    title: "Exercises",
    url: "/exercises",
    icon: Dumbbell,
    testId: "nav-exercises",
  },
  {
    title: "Healthy Foods",
    url: "/foods",
    icon: Apple,
    testId: "nav-foods",
  },
  {
    title: "Heart Tips",
    url: "/heart-tips",
    icon: Info,
    testId: "nav-heart-tips",
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Heart className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Health Monitor</h2>
            <p className="text-xs text-muted-foreground">Track your wellness</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url} data-testid={item.testId}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
