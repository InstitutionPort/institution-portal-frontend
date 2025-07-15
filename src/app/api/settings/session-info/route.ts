import { LoginRequest } from "@/app/settings/session-management"
import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { type NextRequest, NextResponse } from "next/server"

// Mock login requests data
const mockLoginRequests = [
  {
    id: "1", //unique id for each requests
    deviceName: "MacBook Pro",
    deviceType: "desktop",
    browser: "Chrome 120",
    os: "macOS 14.2",
    location: "New York, US",
    ipAddress: "192.168.1.100",
    requestedAt: "2024-01-15T10:30:00Z",
    status: "approved",
    isCurrentDevice: true,
  },
  {
    id: "2",
    deviceName: "iPhone 15",
    deviceType: "mobile",
    browser: "Safari Mobile",
    os: "iOS 17.2",
    location: "New York, US",
    ipAddress: "192.168.1.101",
    requestedAt: "2024-01-14T15:45:00Z",
    status: "approved",
    isCurrentDevice: false,
  },
  {
    id: "3",
    deviceName: "Unknown Device",
    deviceType: "desktop",
    browser: "Firefox 121",
    os: "Windows 11",
    location: "Los Angeles, US",
    ipAddress: "203.0.113.45",
    requestedAt: "2024-01-13T08:20:00Z",
    status: "pending",
    isCurrentDevice: false,
  },
] as LoginRequest[]

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

    // In a real app, fetch login requests from database
    // const requests = await getLoginRequestsForUser(userId)
    return genApiResponse({
      code: "FETCHED",
      message: "Sessions data fetched succesfully.",
      data: { sessionRequests: mockLoginRequests },
      status: 200,
    })
  } catch (error) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = checkTokenIsValid(request, "access-token", ACCESS_SECRET!)
    if (!user) {
      return genApiResponse({
        code: "AUTH_FAILED",
        message: "You are Unauthenticated, Please Login.",
        status: 401,
      })
    }
    const { requestId, action } = await request.json()


    // In a real app, update the login request status in database
    // switch (action) {
    //   case 'approve':
    //     await approveLoginRequest(requestId)
    //     break
    //   case 'deny':
    //     await denyLoginRequest(requestId)
    //if the request id is a apporoved device then remove it
    //if its just a request then revome it
    //     break

    // }
    return genApiResponse({
      code: "UPDATED",
      //don't do this, send request inside the deny or accept login fn
      message: `Session request ${action}ed successfully`,
      status: 200,
    })
  } catch (error) {
    return genApiResponse({
      code: "UPDATE_FAILED",
      message: "Sorry, Something went wrong in the server.",
      status: 500,
    })
  }
}
