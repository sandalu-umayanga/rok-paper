import NavbarPaper from "./components/NavbarPaper";
import { ApplicationProvider } from "./components/ApplicationContext";
import ProtectedRoute from "@/components/ProtectedRoutes";

export default function PaperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN", "STUDENT"]}>
        <ApplicationProvider>
          <div className="h-full flex flex-col md:flex-row">
            {/* Right */}
            <div className="w-full">
              <NavbarPaper />
              {children}
            </div>
          </div>
        </ApplicationProvider>
      </ProtectedRoute>
  );
}
