import { genApiResponse } from "@/utils/gen-api-response"

const topCourses = [
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
]

export async function GET() {
  try {
    return genApiResponse({
      code: "FETCHED",
      message: "Successfully fetched course home page data.",
      data: { topCourses: topCourses },
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