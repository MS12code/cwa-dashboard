import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarFooter,
} from "./ui/sidebar-simple";
import {
  LayoutDashboard,
  Stethoscope,
  Search,
  BookOpen,
  FileText,
  AlertTriangle,
  Shield,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Symptom Diagnosis",
    url: "/symptom-diagnosis",
    icon: Stethoscope,
  },
  {
    title: "CWA Lookup",
    url: "/cwa-lookup",
    icon: Search,
  },
  {
    title: "Treatment Guide",
    url: "/treatment-guide",
    icon: BookOpen,
  },
  {
    title: "Medical Report",
    url: "/medical-report",
    icon: FileText,
  },
];

export function DashboardLayout({ children }) {
  const location = useLocation();

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="border-r-0">
        <SidebarHeader className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-drdo-primary">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">CWA</h1>
              <p className="text-sm text-drdo-gray-light">Medical Management</p>
            </div>
          </div>
        </SidebarHeader>

        <SidebarContent className="px-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      className="data-[active=true]:bg-drdo-primary data-[active=true]:text-white hover:bg-drdo-primary/10 hover:text-drdo-primary text-drdo-gray-light"
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <Alert className="bg-orange-500/10 border-orange-500/20">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <AlertDescription className="text-sm text-orange-300">
              <div className="font-medium mb-1">Emergency</div>
              <div className="text-xs">
                For immediate assistance, contact emergency services.
              </div>
            </AlertDescription>
          </Alert>
          <div className="mt-2">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Emergency Protocol
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-drdo-dark">{children}</SidebarInset>
    </SidebarProvider>
  );
}
