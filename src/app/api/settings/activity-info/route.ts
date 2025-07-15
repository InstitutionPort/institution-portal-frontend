//here we will check for user token and then if its verified then GET request wil give them all profile data,
// and PATCH will let them patch datas except contact
//data format:
import { ActivityItem } from "@/app/settings/activity-timeline"
import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { rejects } from "assert"
import { Activity } from "lucide-react"
import { type NextRequest } from "next/server"

const mockActivities = [
  {
    id: "1",
    type: "profile_update",
    description: "Updated profile information",
    timestamp: "2024-01-15T10:30:00Z",
    metadata: { fields: ["firstName", "lastName"] },
  },
  {
    id: "2",
    type: "image_upload",
    description: "Changed profile picture",
    timestamp: "2024-01-14T15:45:00Z",
  },
  {
    id: "3",
    type: "email_change",
    description: "Added new email address",
    timestamp: "2024-01-13T09:20:00Z",
    metadata: { email: "new.email@example.com" },
  },
  {
    id: "4",
    type: "phone_change",
    description: "Updated phone number",
    timestamp: "2024-01-12T14:15:00Z",
  },
  {
    id: "5",
    type: "password_change",
    description: "Changed account password",
    timestamp: "2024-01-10T11:00:00Z",
  },
  {
    id: "6",
    type: "login",
    description: "Signed in from new device",
    timestamp: "2024-01-09T08:30:00Z",
    metadata: { device: "Chrome on Windows", location: "New York, US" },
  },  //send just 6
] as ActivityItem[]



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
      message: "Successfully fetched user's recent activity.",
      data: { activities: mockActivities },
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Failed to fetched user's recent activity.",
      status: 500,
    })

  }
}

