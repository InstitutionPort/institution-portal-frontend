//here we will check for user token and then if its verified then GET request wil give them all profile data,
// and PATCH will let them patch datas except contact
//data format:
import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { type NextRequest } from "next/server"

// Mock complete user data - replace with actual database queries
export interface Course {
  id: string
  title: string
  institution: string
  isFollowing: boolean
  isEnrolled: boolean
  startDate: string
  link: string
  duration: string
  status: "Ongoing" | "Completed" | "Upcoming"
}

const mockCourses: Course[] = [
  {
    id: "1",
    title: "Advanced Machine Learning",
    institution: "Stanford University",
    isFollowing: true,
    link: "/",
    isEnrolled: true,
    startDate: "2024-01-15",
    duration: "12 weeks",
    status: "Ongoing",
  },
  {
    id: "2",
    title: "Web Development Fundamentals",
    institution: "MIT OpenCourseWare",
    startDate: "2023-11-01",
    isFollowing: true,
    link: "/",

    isEnrolled: false,
    duration: "8 weeks",
    status: "Completed",
  },
  {
    id: "3",
    title: "Data Structures & Algorithms",
    institution: "Berkeley Online",
    startDate: "2024-02-01",
    link: "/",

    duration: "10 weeks",
    isFollowing: false,
    isEnrolled: false,
    status: "Upcoming",
  },
  {
    id: "4",
    title: "Digital Marketing Strategy",
    institution: "Harvard Extension",
    startDate: "2024-01-08",
    duration: "6 weeks",
    link: "/",

    isFollowing: true,
    isEnrolled: true,
    status: "Ongoing",
  },
]
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
      message: "Successfully fetched user's courses data.",
      data: { courses: mockCourses },
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Successfully fetched user's courses data.",
      status: 500,
    })

  }
}


