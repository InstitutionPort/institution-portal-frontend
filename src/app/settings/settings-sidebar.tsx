"use client"

// import { navBarHeight } from "@/components/navbar/navbar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/utils/basic-utils"
import { User, Mail, Phone, Lock, Monitor, Shield, Activity, GraduationCap } from "lucide-react"

interface SettingsSidebarProps {
  activeSection: string
  onSectionClick: (sectionId: string) => void
}

const settingsSections = [
  {
    title: "Profile",
    items: [
      { id: "Personal Information", icon: User },
      { id: "Educational Details", icon: GraduationCap },
    ],
  },
  {
    title: "Security",
    items: [
      { id: "Change Password", icon: Lock },
      { id: "Email Management", icon: Mail },
      { id: "Phone Management", icon: Phone },
      { id: "Sessions & Devices", icon: Monitor },
      { id: "Privacy Settings", icon: Shield },
    ],
  },
  {
    title: "Data",
    items: [
      { id: "Activity & Backup", icon: Activity },
    ],
  },
]

export function SettingsSidebar({ activeSection, onSectionClick }: SettingsSidebarProps) {

  return (
    <Sidebar>
      <SidebarHeader className="pl-4 pt-6 bg-background md:mt-12 text-foreground">
        <h2 className="text-lg font-semibold">Settings</h2>
      </SidebarHeader>
      <SidebarContent className="bg-background text-foreground">
        {settingsSections.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      onClick={() => onSectionClick(item.id)}
                      isActive={activeSection === item.id}
                      className={cn(
                        "w-full justify-start cursor-pointer",
                        activeSection === item.id && "bg-muted"
                      )}>
                      <item.icon />
                      <span>{item.id}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />

    </Sidebar >
  )
}
