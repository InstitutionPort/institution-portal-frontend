// File: app/settings/layout.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { SettingsSidebar } from "@/app/settings/settings-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { createContext } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Menu } from "lucide-react"
// import { navBarHeight } from "@/components/navbar/navbar"
import { cn } from "@/utils/basic-utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

interface SettingsScrollSectionContextType {
  activeSection: string
  scrollToSection: (id: string) => void
  sectionRefs: React.MutableRefObject<{ [key: string]: HTMLElement | null }>
}

export const SettingsScrollSectionContext = createContext<SettingsScrollSectionContextType>({
  activeSection: "Personal Information",
  scrollToSection: () => { },
  sectionRefs: { current: {} },
})


export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("Personal Information")
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  // const sidebarTopMargin = `mt-${navBarHeight}`1

  const scrollToSection = (id: string) => {
    const el = sectionRefs.current[id]
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)

        if (visibleSections.length > 0) {
          setActiveSection(visibleSections[0].target.id)
        }
        // Optional: if nothing is intersecting (user scrolled past all),
        // manually set the last section (good fallback for long bottom sections)
        else {
          const bottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 20
          if (bottom) setActiveSection("Activity & Backup")
        }
      },
      {
        rootMargin: "0px 0px -60% 0px", // bottom margin increased so lower sections still trigger
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    )
    const refs = Object.values(sectionRefs.current)
    refs.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return <SidebarProvider>
    <SettingsScrollSectionContext.Provider value={{ activeSection, scrollToSection, sectionRefs }}>
      <SettingsSidebar activeSection={activeSection} onSectionClick={scrollToSection} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/settings">Settings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{activeSection}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <main className="p-6">{children}</main>
          </div>
        </div>
      </SidebarInset>
    </SettingsScrollSectionContext.Provider>
  </SidebarProvider >
}

