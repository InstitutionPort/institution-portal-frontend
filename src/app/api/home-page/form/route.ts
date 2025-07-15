import { genApiResponse } from "@/utils/gen-api-response"

const recentForms = [
  {
    id: "1",
    title: "Stanford CS Application",
    link: "/",
    institute: "Kathmandu University",
    description: "Computer Science Master's Program Application",
    lastOpened: "2 hours ago",
    deadline: "Dec 15",
    isFollowing: false
  },
  {
    id: "2",
    link: "/",
    institute: "Kathmandu University",
    title: "Merit Scholarship Form",
    description: "Academic Excellence Scholarship Application",
    lastOpened: "1 day ago",
    deadline: "Jan 10",
    isFollowing: true
  },
  {
    id: "3",
    link: "/",
    institute: "Kathmandu University",
    title: "Data Science Bootcamp",
    description: "Full-Stack Data Science Program Enrollment",
    lastOpened: "3 days ago",
    deadline: "Nov 30",
    isFollowing: false
  },
  {
    id: "4",
    link: "/",
    institute: "Kathmandu University",
    title: "AB Merit Scholarship Form",
    description: "Academic Excellence Scholarship Application",
    lastOpened: "1 day ago",
    deadline: "Jan 10",
    isFollowing: true
  },
  {
    id: "5",
    link: "/",
    institute: "Kathmandu University",
    title: "CD Data Science Bootcamp",
    description: "Full-Stack Data Science Program Enrollment",
    lastOpened: "3 days ago",
    deadline: "Nov 30",
    isFollowing: false
  },
  {
    id: "6",
    link: "/",
    institute: "Kathmandu University",
    title: "CD Data Science Bootcamp",
    description: "Full-Stack Data Science Program Enrollment",
    lastOpened: "3 days ago",
    deadline: "Nov 30",
    isFollowing: false
  },

]

export async function GET() {
  try {
    return genApiResponse({
      code: "FETCHED",
      message: "Successfully fetched form home page data.",
      data: { recentForms: recentForms },
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Failed to fetched form home page data.",
      status: 500,
    })
  }
}