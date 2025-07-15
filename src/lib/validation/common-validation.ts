// Helper: phone number transformer
import { z } from "zod"
import { parsePhoneNumberFromString } from "libphonenumber-js"


export const firstName = z
  .string()
  .min(2, "First name must be at least 2 characters")
  .max(50, "First name must not exceed 50 characters")

export const middleName = z
  .string()
  .max(50, "Middle name must not exceed 50 characters")
  .optional()

export const lastName = z
  .string()
  .min(2, "Last name must be at least 2 characters")
  .max(50, "Last name must not exceed 50 characters")


export const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password too long")
  .regex(/[A-Z]/, "Must include an uppercase letter")
  .regex(/[a-z]/, "Must include a lowercase letter")
  .regex(/[0-9]/, "Must include a number")
  .regex(/[^a-zA-Z0-9]/, "Must include a special character")


export const username = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must not exceed 30 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores")

export const mobileSchema = z.object({
  countryCode: z.string().min(1, "Country code is required"),
  number: z.string().min(4, "Phone number is required"),
}).superRefine((data, ctx) => {
  const full = `${data.countryCode}${data.number}`
  const parsed = parsePhoneNumberFromString(full)

  if (!parsed?.isValid()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid phone number",
      path: ["number"], // attaches the error to the `number` field
    })
  }
})

export const email = z.string().email("Invalid email")
export const emailsArray = z
  .array(z.string().email("Invalid email"))
  .min(1, "At least one email is required")
  .transform((arr) => [...new Set(arr.map((e) => e.trim().toLowerCase()))])




export const nation = z.string().min(1, "Country must be choosen.")
export const city = z.string().min(1, "City must be choosen.").max(100, "City must be less than 100 characters")




export const dateOfBirth = z
  .string()
  .refine(
    (date) => {
      const d = new Date(date)
      return d instanceof Date && !isNaN(d.getTime())
    },
    { message: "Invalid date format" }
  )
  .optional()


export const avatarUrl = z.string().url("Invalid URL").optional()



export const education = z
  .object({
    level: z.string().optional(),
    institution: z.string().max(200, "Institution name too long").optional(),
    fieldOfStudy: z.string().max(100, "Field too long").optional(),
    degree: z.string().max(100, "Degree too long").optional(),
    graduationYear: z
      .string()
      .optional()
      .refine(
        (val) =>
          !val ||
          (/^\d{4}$/.test(val) && parseInt(val) >= 1900 && parseInt(val) <= new Date().getFullYear() + 10),
        {
          message: "Graduation year must be a valid 4-digit year",
        }
      ),
  })
  .optional()


export const otpVerification = z.object({
  otp: z
    .string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
  type: z.enum(["email", "phone"])
})
export type OtpVerificationData = z.infer<typeof otpVerification>
export type mobileType = z.infer<typeof mobileSchema>
export type usernameType = z.infer<typeof username>
export type firstNameType = z.infer<typeof firstName>
export type middleNameType = z.infer<typeof middleName>
export type lastNameType = z.infer<typeof lastName>
export type nationType = z.infer<typeof nation>
export type cityType = z.infer<typeof city>
export type passwordType = z.infer<typeof password>
export type avatarUrlType = z.infer<typeof avatarUrl>
export type dateOfBirthType = z.infer<typeof dateOfBirth>
export type educationType = z.infer<typeof education>
export type emailType = z.infer<typeof email>

