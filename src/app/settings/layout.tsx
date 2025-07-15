// File: app/settings/layout.tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { SettingsSidebar } from "@/app/settings/settings-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { createContext } from "react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Menu } from "lucide-react"
// import { navBarHeight } from "@/components/navbar/navbar"
import { cn } from "@/utils/basic-utils"
import { Button } from "@/components/ui/button"

interface SettingsScrollSectionContextType {
  activeSection: string
  scrollToSection: (id: string) => void
  sectionRefs: React.MutableRefObject<{ [key: string]: HTMLElement | null }>
}

export const SettingsScrollSectionContext = createContext<SettingsScrollSectionContextType>({
  activeSection: "personal",
  scrollToSection: () => { },
  sectionRefs: { current: {} },
})


export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("personal")
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
          if (bottom) setActiveSection("activity_n_backup")
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
      <div className="flex w-full" >
        {/* Sidebar (only desktop) */}
        <SettingsSidebar activeSection={activeSection} onSectionClick={scrollToSection} />

        {/* Main Content */}
        <main className="flex-1">
          {/* Sticky Header for Mobile */}
          <div className="max-w-4xl mx-auto p-4 md:p-6 border-b flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger className="md:hidden">
                  <Menu className="h-8 w-8" />
                </SidebarTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Menu</p>
              </TooltipContent>
            </Tooltip>
            <h1 className="text-3xl font-bold text-center">Settings</h1>
          </div>

          {children}
        </main>
      </div>
    </SettingsScrollSectionContext.Provider>
  </SidebarProvider >
}

