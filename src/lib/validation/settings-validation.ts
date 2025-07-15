import { z } from "zod"
import { avatarUrl, city, dateOfBirth, email, firstName, lastName, middleName, nation, password, username } from "./common-validation"

export const passwordChangeSchema = z
  .object({
    currentPassword: password,
    newPassword: password
    // confirmPassword: z.string(),
  })
// .refine((data) => data.newPassword === data.confirmPassword, {
// message: "Passwords do not match",
// path: ["confirmPassword"],
// })
export const settingsSchema = z
  .object({

  })

export const userBasicInfoSchema = z.object({
  firstName: firstName,
  middleName: middleName,
  lastName: lastName,
  username: username,
  city: city,
  nation: nation,
  dateOfBirth: dateOfBirth,
  avatarUrl: avatarUrl
})
export const userPrivacyInfoSchema = z.object({
  showEmail: z.boolean().optional(),
  showPhone: z.boolean().optional(),
  showLocation: z.boolean().optional(),
  showEducation: z.boolean().optional(),
  dataCollection: z.boolean().optional(),
  marketingEmails: z.boolean().optional(),
  securityNotifications: z.boolean().optional(),
})

export const userEducationalInfoSchema = z.object({
  level: z.string().optional(),
  institution: z.string().optional(),
  fieldOfStudy: z.string().optional(),
  graduationYear: z.string().optional(),
  degree: z.string().optional()
})

export const emailChangeFormSchema = z.object({
  email: email
})

export type emailChangeFormType = z.infer<typeof emailChangeFormSchema>
export type userBasicInfoSchemaType = z.infer<typeof userBasicInfoSchema>
export type userPrivacyInfoSchemaType = z.infer<typeof userPrivacyInfoSchema>
export type userEducationalInfoSchemaType = z.infer<typeof userEducationalInfoSchema>
export type passwordChangeSchemaType = z.infer<typeof passwordChangeSchema>

