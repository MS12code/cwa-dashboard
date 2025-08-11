import { Link, useLocation, useNavigate } from "react-router-dom";
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
  MonitorDotIcon
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Anatomy Navigator", url: "/anatomy-navigator", icon: MonitorDotIcon },
  { title: "Symptoms", url: "/symptoms", icon: Stethoscope },
  { title: "Diagnosis", url: "/diagnosis", icon: Stethoscope },
  { title: "Medical Report", url: "/medical-report", icon: FileText },
  { title: "CWA Lookup", url: "/cwa-lookup", icon: Search },
  { title: "Treatment Guide", url: "/treatment-guide", icon: BookOpen },
];

export function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="bg-white border-r border-gray-200 min-h-screen">
        <SidebarHeader className="p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">CWA</h1>
              <p className="text-sm text-gray-500">Medical Management</p>
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
                      className="data-[active=true]:bg-blue-600 data-[active=true]:text-white hover:bg-blue-100 hover:text-blue-600 rounded-md px-2 py-1 transition"
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
          <Alert className="bg-red-50 border border-red-200">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-sm text-red-600">
              <div className="font-semibold mb-1">Emergency</div>
              <div className="text-xs">
                For immediate assistance, contact emergency services.
              </div>
            </AlertDescription>
          </Alert>
          <div className="mt-3">
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              onClick={() => navigate("/emergency-protocol")}
            >
              Emergency?
            </button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-gray-50 min-h-screen p-6 overflow-y-auto">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
