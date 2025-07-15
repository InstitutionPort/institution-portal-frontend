import { checkTokenIsValid } from "@/utils/authtoken"
import { genApiResponse } from "@/utils/gen-api-response"
import { NextRequest } from "next/server"


const ACCESS_SECRET = process.env.ACCESS_SECRET

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
]
const data: any = {
  recentForms: [
    {
      id: "1",
      title: "Stanford CS Application",
      description: "Computer Science Master's Program Application",
      lastOpened: "2 hours ago",
      deadline: "Dec 15",
      isFollowing: false
    },
    {
      id: "2",
      title: "Merit Scholarship Form",
      description: "Academic Excellence Scholarship Application",
      lastOpened: "1 day ago",
      deadline: "Jan 10",
      isFollowing: true
    },
    {
      id: "3",
      title: "Data Science Bootcamp",
      description: "Full-Stack Data Science Program Enrollment",
      lastOpened: "3 days ago",
      deadline: "Nov 30",
      isFollowing: false
    },
    {
      id: "4",
      title: "AB Merit Scholarship Form",
      description: "Academic Excellence Scholarship Application",
      lastOpened: "1 day ago",
      deadline: "Jan 10",
      isFollowing: true
    },
    {
      id: "5",
      title: "CD Data Science Bootcamp",
      description: "Full-Stack Data Science Program Enrollment",
      lastOpened: "3 days ago",
      deadline: "Nov 30",
      isFollowing: false
    },
  ],
  topCourses: [
    {
      id: "1",
      title: "Machine Learning Fundamentals",
      instructor: "Dr. Sarah Chen",
      rating: 4.9,
      students: 15420,
      duration: "12 weeks",
      level: "Beginner",
      price: 89,
      originalPrice: 149,
      isFollowing: false,
      category: "Data Science",
    },
    {
      id: "2",
      title: "Advanced React & Next.js",
      instructor: "Mike Rodriguez",
      rating: 4.8,
      students: 12890,
      duration: "10 weeks",
      level: "Advanced",
      price: 129,
      originalPrice: 199,
      isFollowing: false,
      category: "Web Development",
    },
    {
      id: "3",
      title: "Digital Marketing Mastery",
      instructor: "Emma Thompson",
      rating: 4.7,
      students: 18650,
      duration: "8 weeks",
      level: "Intermediate",
      price: 79,
      isFollowing: false,
      category: "Marketing",
    },
    {
      id: "4",
      title: "Python for Data Analysis",
      instructor: "Prof. David Kim",
      rating: 4.9,
      students: 14230,
      duration: "14 weeks",
      level: "Intermediate",
      thumbnail: "/placeholder.svg?height=200&width=300",
      price: 99,
      isFollowing: false,
      originalPrice: 159,
      category: "Programming",
    },
    {
      id: "5",
      title: "UX Design Principles",
      instructor: "Lisa Wang",
      rating: 4.8,
      students: 9870,
      duration: "6 weeks",
      level: "Beginner",
      thumbnail: "/placeholder.svg?height=200&width=300",
      price: 69,
      category: "Design",
    },
    {
      id: "6",
      title: "Blockchain Development",
      instructor: "Alex Johnson",
      rating: 4.6,
      students: 6540,
      duration: "16 weeks",
      level: "Advanced",
      isFollowing: true,
      thumbnail: "/placeholder.svg?height=200&width=300",
      price: 199,
      originalPrice: 299,
      category: "Blockchain",
    },
  ],
  topInstitutes: [
    {
      id: "1",
      name: "Stanford University",
      logo: "/placeholder.svg?height=64&width=64",
      location: "California, USA",
      rating: 4.9,
      isFollowing: true,
      programs: 180,
      type: "University",
      established: 1885,
      featured: true,
    },
    {
      id: "2",
      name: "MIT",
      logo: "/placeholder.svg?height=64&width=64",
      location: "Massachusetts, USA",
      rating: 4.9,
      programs: 150,
      isFollowing: false,
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
      isFollowing: true,
      programs: 95,
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
      programs: 25,
      isFollowing: false,
      type: "Institute",
      established: 2018,
      featured: false,
    },
  ],
}
export async function GET(request: NextRequest) {


  try {

    //make middleware do this stuff:
    const user = checkTokenIsValid(request, "access-token", ACCESS_SECRET!)
    if (user) data.recommandation = userLocationBasedRecommendation

    return genApiResponse({
      code: "FETCHED",
      message: "Successfully fetched home page data.",
      data: data,
      status: 200,
    })
  } catch (err) {
    return genApiResponse({
      code: "FETCH_FAILED",
      message: "Successfully fetched user's private data.",
      status: 500,
    })

  }

}
