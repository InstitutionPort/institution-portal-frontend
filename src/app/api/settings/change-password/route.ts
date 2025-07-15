//here we will check for user token and then if its verified then GET request wil give them all profile data,
// and PATCH will let them patch datas except contact
//data format:
import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { type NextRequest } from "next/server"

// Mock complete user data - replace with actual database queries
const educationInfo = {
  level: "University",
  institution: "MIT",
  fieldOfStudy: "Computer Science",
  graduationYear: "2012",
  degree: "Bachelor's",
}


const ACCESS_SECRET = process.env.ACCESS_SECRET

export async function PATCH(request: NextRequest) {
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
    //the data to change
    const data = await request.json()
    //data={currentPassword="abcd@!#1A", newPassword="abcd#@!1B"}
    // hash the current password, if it matches with the current password then hash the new and store
    //if it does not then send the error message accordingly


    return genApiResponse({
      code: "UPDATED",
      message: "Password updated successfully",
      status: 200
    })
  } catch (err) {
    return genApiResponse({
      code: "UPDATE_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500
    })
  }
}
