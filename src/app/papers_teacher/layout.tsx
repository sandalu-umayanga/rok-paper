import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu"
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoutes";
  
  export default function PaperLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <ProtectedRoute allowedRoles={["TEACHER", "MANAGER", "ADMIN"]}>
        <div className="h-full flex">
            {/* Left */ }
            <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4">
              <Link href="/" className="flex items-center justify-center lg:justify-start gap-2">
                <Image src="/logo.png" alt="logo" width={28} height={32} className="bg-slate-500"/>
                <span className="hidden lg:block font-bold">ROKPaperClass</span>
              </Link>
              <Menu/>
            </div>
            {/* Right */}
            <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#F7F8FA] overflow-scroll">
              <Navbar/>
              {children}
            </div>
        </div>
      </ProtectedRoute>
    );
  }