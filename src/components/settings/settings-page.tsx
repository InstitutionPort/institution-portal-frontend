"use client"

import type React from "react"


import { useState, useEffect, useRef } from "react"
import { SessionManagement } from "@/app/settings/session-management"
import { PrivacySettings } from "@/app/settings/privacy-settings"
import { AccountBackup } from "@/app/settings/account-backup"
import { SettingsSidebar } from "@/app/settings/settings-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

import BasicInfo from "../../app/settings/basic-info"
import EducationalInfo from "../../app/settings/educational-info"
import { Menu } from "lucide-react"

interface SettingsPageProps {
  username: string
}

export function SettingsPage({ username }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState("personal")
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  // Intersection Observer to track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-20% 0px -70% 0px",
        threshold: 0.1,
      },
    )
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })
    return () => observer.disconnect()
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }



  return (
    <TooltipProvider>
      <div className="flex w-full">
        <div className="hidden md:block sticky top-0 h-screen overflow-y-auto shrink-0 border-r bg-white">
          <SettingsSidebar activeSection={activeSection} onSectionClick={scrollToSection} />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
            {/* Scrollable content here as before */}

            {/* Header with Edit Toggle and Mobile Menu */}
            <div className="sticky top-0 z-10 bg-white border-b px-4 py-4">
              <div className="flex items-center justify-between max-w-4xl mx-auto">
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SidebarTrigger className="md:hidden">
                        <Menu className="h-5 w-5" />
                      </SidebarTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Open navigation menu</p>
                    </TooltipContent>
                  </Tooltip>
                  <h1 className="text-3xl font-bold">Settings</h1>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
                {/* Personal Information */}
                <section id="personal" ref={(el) => { sectionRefs.current.personal = el }} className="scroll-mt-20">
                  <BasicInfo username={username} />
                </section>
                <section id="education" ref={(el) => { sectionRefs.current.education = el }} className="scroll-mt-20">
                  <EducationalInfo username={username} />
                </section>
                {/* Password Section
                <section id="password" ref={(el) => (sectionRefs.current.password = el)} className="scroll-mt-20">
                  <PasswordSection username={username} />
                </section>

                {/* Email Management */}
                {/* <section id="email" ref={(el) => (sectionRefs.current.email = el)} className="scroll-mt-20">
                  <EmailManagement currentEmail={userData?.contacts.email} username={username} />
                </section>

                {/* Phone Management */}
                {/* <section id="phone" ref={(el) => (sectionRefs.current.phone = el)} className="scroll-mt-20">
                  <PhoneManagement currentPhone={userData?.contacts.mobile} username={username} />
                </section> */}

                {/* Session Management */}
                <section id="sessions" ref={(el) => { sectionRefs.current.sessions = el }} className="scroll-mt-20">
                  <SessionManagement isEditing={false} />
                </section>

                {/* Privacy Settings */}
                <section id="privacy" ref={(el) => { sectionRefs.current.privacy = el }} className="scroll-mt-20">
                  <PrivacySettings isEditing={false} />
                </section>

                {/* Account Backup */}
                <section id="backup" ref={(el) => { sectionRefs.current.backup = el }} className="scroll-mt-20">
                  <AccountBackup />
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider >
  )
}
