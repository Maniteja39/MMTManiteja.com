import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Writings from "./pages/Writings.tsx";
import WritingDetail from "./pages/WritingDetail.tsx";
import Login from "./pages/admin/Login.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import PostsList from "./pages/admin/PostsList.tsx";
import PostEditor from "./pages/admin/PostEditor.tsx";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { RequireAdmin } from "@/lib/auth/RequireAdmin";
import { Analytics } from "@/lib/analytics/Analytics";
import LiveClock from "@/components/LiveClock";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          {/* LiveClock hides itself on /admin/* — uses useLocation, so it must be
              inside BrowserRouter. */}
          <LiveClock />
          {/* Analytics listens to route changes — must be inside BrowserRouter. */}
          <Analytics>
            <Routes>
              {/* Public site */}
              <Route path="/" element={<Index />} />
              <Route path="/writings" element={<Writings />} />
              <Route path="/writings/:slug" element={<WritingDetail />} />

              {/* Admin — login is public; everything under /admin is gated. */}
              <Route path="/admin/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminLayout />
                  </RequireAdmin>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="posts" element={<PostsList />} />
                <Route path="posts/new" element={<PostEditor />} />
                <Route path="posts/:id" element={<PostEditor />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Analytics>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
