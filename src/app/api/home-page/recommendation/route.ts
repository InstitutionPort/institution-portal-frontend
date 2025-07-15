import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { NextRequest } from "next/server"

const userLocationBasedRecommendation = [
  {
    id: "1",
    title: "Local Tech Meetup Scholarship",
    description: "Full scholarship for Bay Area residents",
    type: "scholarship",
    location: "San Francisco, CA",
    isFollowing: false

  },
  {
    id: "2",
    title: "UC Berkeley Extension",
    description: "Professional development courses nearby",
    type: "institute",
    location: "Berkeley, CA",
    isFollowing: false

  },
  {
    id: "3",
    title: "Silicon Valley Coding Bootcamp",
    description: "Intensive 12-week program with job guarantee",
    type: "course",
    location: "San Jose, CA",
    isFollowing: false


  },
  {
    id: "4",
    title: "Silicon Valley Coding Bootcamp",
    description: "Intensive 12-week program with job guarantee",
    type: "course",
    location: "San Jose, CA",
    isFollowing: false


  },
]

const ACCESS_SECRET = process.env.ACCESS_SECRET

export async function GET(request: NextRequest) {
  try {
    // const user = checkTokenIsValid(request, "access-token", ACCESS_SECRET!)
    //get user's location and then send the recommandation based on that
    return genApiResponse({
      code: "FETCHED",
      message: "Successfully fetched recommandation home page data.",
      data: { recommendation: userLocationBasedRecommendation },
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Failed to fetched form course page data.",
      status: 500,
    })
  }
}