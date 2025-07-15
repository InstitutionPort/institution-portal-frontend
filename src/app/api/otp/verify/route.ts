import { checkTokenIsValid, genToken } from "@/utils/authtoken";
import { genApiResponse } from "@/utils/gen-api-response"
import { type NextRequest } from "next/server"
import { v4 } from "uuid";
import bcrypt from 'bcryptjs'
import { OtpTokenPayload } from "@/utils/types";
import { email } from "@/lib/validation/common-validation";


const OTP_SECRET = process.env.OTP_SECRET

const ACCESS_SECRET = process.env.ACCESS_SECRET
export async function POST(req: NextRequest) {
  try {
    //middleware part
    const user = checkTokenIsValid(req, "access-token", ACCESS_SECRET!)
    if (!user) {
      return genApiResponse({
        code: "AUTH_FAILED",
        message: "You are Unauthenticated, Please Login.",
        status: 401,
      })
    }

    const { otp, type, value } = await req.json()
    //type is mobile or email,
    // In a real app, verify OTP against stored value
    // const isValid = await verifyOTP(type, value, otp)

    // Mock verification - accept "123456" as valid OTP
    const realDummyOtp = (type === "email-update" || type === "mobile-update") ? 123456 : 654321
    const isValid = Number(otp) === realDummyOtp
    //if not valid:
    if (!isValid) {
      return genApiResponse({
        code: "VERIFICATION_FAILED",
        message: "OTP verification failed, please enter the correct OTP.",
        status: 401,
      })
    }

    // the password salting putting it in cookie
    let saltedValue = value
    if (type === 'password') {
      const saltRounds = 10;
      const salted = await bcrypt.hash(value, saltRounds);
      if (salted) saltedValue = salted
      else {
        return genApiResponse({
          code: "CONFLICT",
          message: 'Sorry, problems during password encryption.',
          status: 409,
        })

      }
    }
    //adding otp to the token name so that we can diff between a old email otp and new email otp
    const otpCookie = genToken({ type: type, value: saltedValue } as OtpTokenPayload, `otp-token-${type}`, 300, OTP_SECRET!)
    const res = genApiResponse({
      code: "VERIFIED",
      message: 'OTP was succesfully verified.',
      status: 200,
    })
    res.headers.append("Set-Cookie", otpCookie)
    return res



  } catch (err) {
    return genApiResponse({
      code: "VERIFICATION_FAILED",
      message: "Sorry,Something went wrong in the server.",
      status: 500,
    })
  }
}
