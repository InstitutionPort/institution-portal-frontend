// File: app/settings/page.tsx
"use client"

import { useContext } from "react"
import { SettingsScrollSectionContext } from "./layout"
import BasicInfo from "./basic-info"
import EducationalInfo from "./educational-info"
import { SessionManagement } from "./session-management"
import { PrivacySettings } from "./privacy-settings"
import { AccountBackup } from "./account-backup"
import { checkMe } from "@/lib/queries/use-checkme"
import { ChangePasswordSettings } from "./change-password"
import { ErrorBox } from "@/components/error-box"
import { EmailManagement } from "./email-management"
import { PhoneManagement } from "./phone-management"
import { ActivityTimeline } from "./activity-timeline"

export default function SettingsPage() {
  const { data: userData, isPending, isError, error } = checkMe()
  const { sectionRefs } = useContext(SettingsScrollSectionContext)

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-8"> {/* 👈 Add pb-60 */}
      {isError || (!isPending && !userData?.data?.user) ?
        <ErrorBox message={error?.message ?? "Please try to reauthenticate or refresh."} /> : (
          <>
            {/* Sections */}
            <section id="Personal Information" ref={(el) => { sectionRefs.current.personal = el }} className="scroll-mt-20">
              <BasicInfo username={userData?.data?.user} />
            </section>
            <section id="Educational Details" ref={(el) => { sectionRefs.current.education = el }} className="scroll-mt-20">
              <EducationalInfo username={userData?.data?.user} />
            </section>
            <section id="Change Password" ref={(el) => { sectionRefs.current.password = el }} className="scroll-mt-20">
              <ChangePasswordSettings username={userData?.data?.user} />
            </section>
            <section id="Email Management" ref={(el) => { sectionRefs.current.email = el }} className="scroll-mt-20">
              <EmailManagement username={userData?.data?.user} />
            </section>
            <section id="Phone Management" ref={(el) => { sectionRefs.current.phone = el }} className="scroll-mt-20">
              <PhoneManagement username={userData?.data?.user} />
            </section>
            <section id="Sessions & Devices" ref={(el) => { sectionRefs.current.sessions = el }} className="scroll-mt-20">
              <SessionManagement username={userData?.data?.user} />
            </section>
            <section id="Privacy Settings" ref={(el) => { sectionRefs.current.privacy = el }} className="scroll-mt-20">
              <PrivacySettings username={userData?.data?.user} />
            </section>
            <section id="Activity & Backup" ref={(el) => { sectionRefs.current.activity_n_backup = el }} className="scroll-mt-20 space-y-8">
              <ActivityTimeline username={userData?.data?.user} />
              <AccountBackup />
            </section>

          </>
        )
      }
    </div >
  )

}
