//here we will check for user token and then if its verified then GET request wil give them all profile data,
// and PATCH will let them patch datas except contact
//data format:
import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { rejects } from "assert"
import { type NextRequest } from "next/server"

// Mock complete user data - replace with actual database queries
const basicInfo = {
  firstName: "John",
  middleName: "Michael",
  lastName: "Doe",
  username: "johndoe",
  nation: "United States",
  city: "New York City",
  avatarUrl: "/placeholder.svg?height=128&width=128",
  dateOfBirth: "1990-01-15",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as const


const ACCESS_SECRET = process.env.ACCESS_SECRET

export async function POST(request: NextRequest) {
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
      message: "Got user's backup successfully.",
      data: basicInfo,
      status: 200
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCHED_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500
    })
  }
}
