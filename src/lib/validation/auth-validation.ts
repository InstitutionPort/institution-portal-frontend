import { z } from "zod"
import { city, email, firstName, lastName, middleName, nation, password, username, } from "./common-validation"


export const signUpSchema = z
  .object({
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    username: username,
    nation: nation,
    city: city,
    email: email,
    password: password,
  })
// .refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"],
// })



export const usernameLoginSchema = z.object({
  username: username,
  password: password
})

export const emailLoginSchema = z
  .object({
    email: email,
    password: password
  })

export type SignUpFormType = z.infer<typeof signUpSchema>
export type UsernameLoginForm = z.infer<typeof usernameLoginSchema>
export type EmailLoginForm = z.infer<typeof emailLoginSchema>
