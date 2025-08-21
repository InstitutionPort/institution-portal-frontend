import { createContext } from "react"

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