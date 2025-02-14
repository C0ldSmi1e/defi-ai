"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const routes = [
  {
    href: "/",
    label: "Home",
  },
  {
    href: "/chat",
    label: "Chat",
  },
];

const Navbar = () => {
  const pathname = usePathname();

  return (
    <header className="sticky top-2 left-[5%] z-50 w-[90%] border border-gray-800 rounded-lg bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 hover:from-blue-500 hover:to-purple-700 transition-all">
              ⚡ NGMG
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "transition-colors hover:text-blue-400",
                  pathname === route.href
                    ? "text-purple-400 font-bold"
                    : "text-gray-400"
                )}
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" className="-ml-4 h-auto p-2 text-gray-400 hover:text-blue-400">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-gray-900/95 border-gray-800">
            <SheetHeader>
              <SheetTitle className="text-left text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                ⚡ NGMG
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col space-y-4 mt-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "block px-2 py-1 text-lg transition-colors hover:text-blue-400",
                    pathname === route.href
                      ? "text-purple-400 font-bold"
                      : "text-gray-400"
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Add search or other elements here */}
          </div>
          <nav className="flex items-center">
            <Button 
              variant="outline" 
              className="ml-2 border-gray-700 hover:border-blue-500 text-gray-300 hover:text-blue-400 transition-all"
              disabled
            >
              Login
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
