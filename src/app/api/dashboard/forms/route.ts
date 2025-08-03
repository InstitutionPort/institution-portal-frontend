//here we will check for user token and then if its verified then GET request wil give them all profile data,
// and PATCH will let them patch datas except contact
//data format:
import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { type NextRequest } from "next/server"

// Mock complete user data - replace with actual database queries

export interface Form {
  id: string
  link: string
  title: string
  isFollowing: boolean
  institution: string
  course?: string
  submissionDate: string
  status: "Pending" | "Saved" | "Rejected" | "Approved"
}

const mockforms: Form[] = [
  {
    id: "1",
    title: "Course Enrollment Application",
    institution: "Stanford University",
    course: "Advanced Machine Learning",
    link: "",
    isFollowing: false,
    status: "Pending",
    submissionDate: "2024-01-10",
  },
  {
    id: "2",
    title: "Financial Aid Request",
    institution: "MIT OpenCourseWare",
    submissionDate: "2024-01-15",
    link: "",
    isFollowing: true,
    status: "Approved",
  },
  {
    id: "3",
    title: "Transfer Credit Evaluation",
    institution: "Berkeley Online",
    course: "Data Structures & Algorithms",
    submissionDate: "2024-01-20",
    link: "",
    isFollowing: false,
    status: "Saved",
  },
  {
    id: "4",
    title: "Grade Appeal Form",
    institution: "Harvard Extension",
    course: "Digital Marketing Strategy",
    submissionDate: "2024-01-05",
    link: "",
    isFollowing: false,
    status: "Rejected",
  },
  {
    id: "5",
    title: "Course Withdrawal Request",
    institution: "Stanford University",
    course: "Advanced Machine Learning",
    submissionDate: "2024-01-25",
    link: "",
    isFollowing: true,
    status: "Pending",
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
      message: "Successfully fetched user's forms data.",
      data: { forms: mockforms },
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Successfully fetched user's forms data.",
      status: 500,
    })

  }
}


