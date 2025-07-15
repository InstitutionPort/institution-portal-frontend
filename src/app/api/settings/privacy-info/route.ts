//here we will check for user token and then if its verified then GET request wil give them all profile data,
// and PATCH will let them patch datas except contact
//data format:
import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { type NextRequest } from "next/server"

// Mock complete user data - replace with actual database queries
const privacyInfo = {
  showEmail: false,
  showPhone: false,
  showLocation: true,
  showEducation: false,
  dataCollection: true,
  marketingEmails: false,
  securityNotifications: true,
}


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
    return genApiResponse({
      code: "FETCHED",
      message: "Successfully fetched user's privacy data.",
      data: privacyInfo,
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Successfully fetched user's privacy data.",
      status: 500,
    })

  }
}

//query the data here
//send it back
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
    const data = await request.json()
    await new Promise((rejects, resolve) => setTimeout(() => { resolve(() => console.log(1)) }, 3000))
    //CHANGE THE PERSONAL DATA
    //basically:
    // Validates the JWT access token
    // Optionally checks for data correctness(username, and so on)
    // Updates fields in the DB
    // Returns a success response, not the updated data, we will query again for that even thogh its ineffective


    return genApiResponse({
      code: "UPDATED",
      message: "Privacy information updated successfully.",
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
