"use client"

import * as React from "react"
import Link from "next/link"
import { Heart, Smartphone, MoreHorizontal, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const navItems = [
  { title: "Nhà đất bán", href: "/nha-dat-ban" },
  { title: "Nhà đất cho thuê", href: "/nha-dat-cho-thue" },
  { title: "Dự án", href: "/du-an" },
  { title: "Tin tức", href: "/tin-tuc" },
  { title: "Wiki BĐS", href: "/wiki" },
]

export default function NavigationBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* --- LEFT: Logo & Desktop Nav --- */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-[#E03C31]">RealEstatePro</span>
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.title}>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    <Link href={item.href} className="font-semibold text-[14px]">
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* --- RIGHT: Actions & Mobile Menu --- */}
        <div className="flex items-center gap-2">
          {/* Icons (Desktop) */}
          <div className="hidden items-center gap-1 sm:flex border-r pr-2">
            <Button variant="ghost" size="icon"><Smartphone className="h-5 w-5" /></Button>
            <Button variant="ghost" size="icon"><Heart className="h-5 w-5" /></Button>
          </div>

          {/* Auth & Post (Desktop) */}
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" className="text-[14px]">
              <Link href="/login">Đăng nhập</Link>
            </Button>
            <Separator orientation="vertical" className="h-4" />
            <Button variant="ghost" className="text-[14px]">
              <Link href="/register">Đăng ký</Link>
            </Button>
            <Button className="ml-2 font-semibold bg-[#E03C31] hover:bg-[#c0322a] text-white">Đăng tin</Button>
          </div>

          {/* --- MOBILE MENU (SHEET) --- */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-75 px-4">
                <div className="mt-6 flex flex-col gap-4">
                  {/* Auth Buttons inside Mobile Menu */}
                  <div className="flex flex-col gap-2 border-b pb-4">
                    <Button className="w-full justify-start" variant="ghost">
                      <Link href="/login">Đăng nhập</Link>
                    </Button>
                    <Button className="w-full justify-start" variant="ghost">
                      <Link href="/register">Đăng ký</Link>
                    </Button>
                    <Button className="w-full font-semibold bg-[#E03C31] hover:bg-[#c0322a] text-white">
                      Đăng tin
                    </Button>
                  </div>

                  {/* Nav Links inside Mobile Menu */}
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link 
                        key={item.title} 
                        href={item.href}
                        className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md"
                      >
                        {item.title}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}