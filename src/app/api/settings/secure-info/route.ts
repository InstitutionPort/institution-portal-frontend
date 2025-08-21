import { type NextRequest } from "next/server"
import { checkTokenIsValid } from "@/utils/authtoken";
import { genApiResponse } from "@/utils/gen-api-response";
import { OtpTokenPayload, SecureUserMutation } from "@/utils/types";
import { parsePhoneNumberWithError } from 'libphonenumber-js'
import { number } from "zod";



const OTP_SECRET = process.env.OTP_SECRET
const ACCESS_SECRET = process.env.ACCESS_SECRET

export async function GET(request: NextRequest) {
  try {

    //make middleware do this stuff:
    const user = checkTokenIsValid(request, "access-token", ACCESS_SECRET!)
    if (!user) {
      return genApiResponse({
        code: "AUTH_FAILED",
        message: "You are Unauthenticated, Please Login.",
        status: 401,
      })
    }

    const raw = "+9779842467080"
    const phoneNumber = parsePhoneNumberWithError(raw)

    if (phoneNumber && phoneNumber.isValid()) {
      const countryCode = `+${phoneNumber.countryCallingCode}` // e.g., '977'
      const nationalNumber = phoneNumber.nationalNumber   // e.g., '9842467080'

      const response: any = {
        email: "sworup0178@gmail.com", //email is mandatory when signup so no need
        mobile:
        {
          countryCode: countryCode,
          number: nationalNumber
        }
        // mobile: "no-mobile" //if user has not set up mobile auth
      }
      return genApiResponse({
        code: "FETCHED",
        message: "Successfully fetched user's contact data.",
        data: response,
        status: 200,
      })
    }


  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Successfully fetched user's contact data.",
      status: 500,
    })

  }
}


export async function PATCH(request: NextRequest) {

  try {
    //user authentication
    const user = checkTokenIsValid(request, "access-token", ACCESS_SECRET!)
    if (!user) {
      return genApiResponse({
        code: "AUTH_FAILED",
        message: "You are Unauthenticated, Please Login.",
        status: 401,
      })
    }
    const { type: updateType } = await request.json()
    //like wise for all types: TYPES ARE IN TYPES.TS FILE NAMED SecureUserMutation={type:....}
    if (updateType === 'mobile-delete') {
      const mobileDelete = checkTokenIsValid(request, "otp-token-mobile-delete", OTP_SECRET!)
      if (mobileDelete) {
        const res = genApiResponse({
          code: "UPDATED",
          message: "Phone number deleted successfully.",
          status: 200,
        })
        res.cookies.delete('otp-token-mobile-delete')
        return res
      }
      else return genApiResponse({
        code: "UPDATED FAILED",
        message: "Veficiation of user's phone no deletion action failed.",
        status: 401
      })
    }
    //



    const emailNew = checkTokenIsValid(request, "otp-token-email-update", OTP_SECRET!)
    const emailCurrent = checkTokenIsValid(request, "otp-token-email-current", OTP_SECRET!)

    if (!(emailCurrent && emailNew)) {
      const res = genApiResponse({
        code: "VERIFICATION_FAILED",
        message: "Please recieve and verify OTP. OTP verification is needed befor any change.",
        status: 401,
      })
      res.cookies.delete("otp-token-email-new")
      res.cookies.delete("otp-token-email-current")
      return res
    }




    //if password:
    //store the value directly as password,its already in salted/hashed form;


    //NOTE: UNIQUESNESS WILL BE CHECKED BY ANOTHER API TOO BUT SHOULD STILL BE CHECKED HERE.
    // SAME EMAIL CAN BE VERIFIED BY MANY USERS SINCE MAIL IS NOT MAIN SOURCE OF 2FA
    // BUT PHONE NO SHOULD BE COMPLETELY UNIQIE


    // if (type as any === 'moblie') {
    //   // Mock uniqueness check
    //   const takenPhones = ["+1111111111", "+9779746358434"]
    //   if (takenPhones.includes(value))
    //     return genApiResponse({
    //       code: "CONFLICT",
    //       message: "A account has already been registered using this phone no.",
    //       metaData: { errorField: "mobile" },
    //       status: 409,
    //     })
    // }

    // In a real app, update the secure field in database
    // switch (type) {
    //   case 'email':
    //     await updateUserEmail(username, value)
    //     break
    //   case 'phone':
    //     await updateUserPhone(username, value)
    //     break
    //   case 'password':
    //     await updateUserPassword(username, value)
    //     break
    // }

    // Clear the OTP token
    const response = genApiResponse({
      code: "UPDATED",
      message: 'Updated successfully',
      status: 200,
    })
    response.cookies.delete("otp-token-email-update")
    response.cookies.delete("otp-token-email-current")

    return response
  } catch (error) {
    return genApiResponse({
      code: "UPDATE_FAILED",
      message: "Sorry,Something went wrong in the server.",
      status: 500,
    })
  }
}

