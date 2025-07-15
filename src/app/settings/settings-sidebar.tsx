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
} from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
      { id: "personal", label: "Personal Information", icon: User },
      { id: "education", label: "Educational Details", icon: GraduationCap },
    ],
  },
  {
    title: "Security",
    items: [
      { id: "password", label: "Change Password", icon: Lock },
      { id: "email", label: "Email Management", icon: Mail },
      { id: "phone", label: "Phone Management", icon: Phone },
      { id: "sessions", label: "Sessions & Devices", icon: Monitor },
      { id: "privacy", label: "Privacy Settings", icon: Shield },
    ],
  },
  {
    title: "Data",
    items: [
      { id: "activity_n_backup", label: "Activity & Backup", icon: Activity },
    ],
  },
]

export function SettingsSidebar({ activeSection, onSectionClick }: SettingsSidebarProps) {

  return (
    <TooltipProvider>
      <Sidebar className="hidden md:block w-64 sticky top-[53px] h-[calc(100vh-53px)] border-r">
        <SidebarHeader className="pl-4 pt-6 bg-background text-foreground">
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
                        )}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <item.icon className="h-4 w-4" />
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            <p>{item.label}</p>
                          </TooltipContent>
                        </Tooltip>
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    </TooltipProvider>
  )
}
