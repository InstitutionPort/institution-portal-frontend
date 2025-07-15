import { genApiResponse } from "@/utils/gen-api-response"

const topInstitutes = [
  {
    id: "1",
    name: "Stanford University",
    logo: "/placeholder.svg?height=64&width=64",
    location: "California, USA",
    description: "What the hell this institution is greate as fuck I could fuck with it all the time.",
    rating: 4.9,
    isFollowing: true,
    type: "University",
    badges: ["Online", "Research", "Computer Science"],

    established: 1885,
    featured: true,
  },
  {
    id: "2",
    name: "MIT",
    description: "What the hell this institution is greate as fuck I could fuck with it all the time.",
    logo: "/placeholder.svg?height=64&width=64",
    location: "Massachusetts, USA",
    rating: 4.9,
    isFollowing: false,
    badges: ["Online", "Research", "Computer Science"],

    type: "University",
    established: 1861,
    featured: true,
  },
  {
    id: "3",
    name: "Harvard Business School",
    logo: "/placeholder.svg?height=64&width=64",
    location: "Massachusetts, USA",
    rating: 4.8,
    description: "What the hell this institution is greate as fuck I could fuck with it all the time.",
    isFollowing: true,
    badges: ["Online", "Research", "Computer Science"],
    type: "College",
    established: 1908,
    featured: true,
  },
  {
    id: "4",
    name: "Google Career Certificates",
    logo: "/placeholder.svg?height=64&width=64",
    location: "Online",
    rating: 4.7,
    description: "What the hell this institution is greate as fuck I could fuck with it all the time.",
    badges: ["Online", "Research", "Computer Science"],
    isFollowing: false,
    type: "Institute",
    established: 2018,
    featured: false,
  },
  {
    id: "6",
    name: "Google Career Certificates",
    logo: "/placeholder.svg?height=64&width=64",
    location: "Online",
    rating: 4.7,
    description: "What the hell this institution is greate as fuck I could fuck with it all the time.",
    badges: ["Online", "Research", "Computer Science"],
    isFollowing: false,
    type: "Institute",
    established: 2018,
    featured: false,
  },
  {
    id: "5",
    name: "Google Career Certificates",
    logo: "/placeholder.svg?height=64&width=64",
    location: "Online",
    rating: 4.7,
    description: "What the hell this institution is greate as fuck I could fuck with it all the time.",
    badges: ["Online", "Research", "Computer Science"],
    isFollowing: false,
    type: "Institute",
    established: 2018,
    featured: false,
  },
]

export async function GET() {
  try {
    return genApiResponse({
      code: "FETCHED",
      message: "Successfully fetched institute home page data.",
      data: { topInstitutes: topInstitutes },
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Failed to fetched institute home page data.",
      status: 500,
    })
  }
}