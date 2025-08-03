

"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  BookOpen,
  Users,
  Star,
  MapPin,
  Clock,
  GraduationCap,
  Building2,
  FileText,
  Award,
  Play,
  Calendar,
  Zap,
  Heart,
  ChevronRight,
  BookMarked,
  School,
  LogIn,
} from "lucide-react"
import { checkMe } from "@/lib/queries/use-checkme"
import { useQueryCustom } from "@/lib/queries/use-query-custom"
import { useHomePage } from "@/lib/queries/use-home-page"
import { LoadingBox } from "@/components/loading-box"
import { ErrorBox } from "@/components/error-box"
import Link from "next/link"
import { cn } from "@/utils/basic-utils"
import FollowButton from "@/components/follow-button"

interface Form {
  id: string
  link: string
  institute: string
  title: string
  description: string
  lastOpened: string
  deadline: string
  isFollowing: boolean
}

interface Course {
  id: string
  title: string
  link: string
  instructor: string
  rating: number
  students: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  price: number
  originalPrice?: number
  category: string
  isFollowing: boolean

}

interface Institute {
  id: string
  students: number
  name: string
  link: string
  logo: string
  location: string
  description: string
  rating: number
  badges: string[]
  type: "University" | "College" | "Institute"
  established: number
  featured: boolean
  isFollowing: boolean
}

interface RecommendationHomePage {
  id: string
  link: string
  title: string
  description: string
  type: "course" | "institute" | "scholarship"
  location: string
  relevanceScore: number
  isFollowing: boolean
}

interface HomeData {
  recentForms: Form[]
  topCourses: Course[]
  topInstitutes: Institute[]
  locationBasedRecommendation: RecommendationHomePage[]
}

interface User {
  id: string
  name: string
  email: string
}


function HeroSection() {
  return (
    <div className="relative  py-20 px-4 border-b ">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-6">
          <div className="space-y-4">
            <Badge variant="secondary" className="mx-auto w-fit">
              <Users className="w-4 h-4 mr-2" />
              Trusted by 50,000+ students
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Learn new skills
              <span className="text-blue-600 block">anytime, anywhere</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Access world-class courses from top institutions and industry experts. Build the skills you need to
              advance your career.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <Button size="lg" className="text-lg px-8 py-6">
                <BookOpen className="w-5 h-5 mr-2" />
                Browse Courses
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
                <LogIn className="w-5 h-5 mr-2" />
                Get Started
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold  mb-1">50K+</div>
              <div className="text-sm text-slate-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold  mb-1">1,200+</div>
              <div className="text-sm text-slate-600">Expert Courses</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold  mb-1">95%</div>
              <div className="text-sm text-slate-600">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
function RecommendationHomePage({ username }: { username: string }) {
  const { data: recommandationRes, isPending, error, refetch } = useHomePage("recommendation", username)
  const recommandationData: RecommendationHomePage[] | undefined = recommandationRes?.data?.recommendation.slice(0, 6) as any

  return (<>

    <Card className="mt-10 p-4">
      <CardHeader>
        <div className="flex gap-4">
          <MapPin className="w-5 h-5 text-emerald-500" />
          <div>
            <CardTitle className="font-semibold  mb-1">Recommended for Your Location</CardTitle>
            <CardDescription className=" text-sm mb-3">
              Based on your location, here are some popular opportunities in your area
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {
          isPending ? (
            <LoadingBox title="Loading data..." message="Please wait while we get your data." />
          ) :
            error ? (
              <ErrorBox
                title="Failed to Load Data"
                message={error?.message ?? "Something went wrong."}
                onRetry={() => refetch()
                }
              />
            ) : !recommandationData ? (
              <ErrorBox
                title="No Data"
                message="We couldn't find the data."
                onRetry={() => (refetch as any)()}
              />
            ) : (

              <div className="grid md:grid-cols-2 gap-2">
                {recommandationData.slice(0, 4).map((rec) => (
                  <Link key={rec.id} href={rec.link ?? "/"}>
                    <div className="flex items-center gap-2 p-2  rounded-lg border">
                      <div className="p-1  rounded">
                        {rec.type === "course" && <BookOpen className="w-3 h-3 text-emerald-600" />}
                        {rec.type === "institute" && <School className="w-3 h-3 text-emerald-600" />}
                        {rec.type === "scholarship" && <Award className="w-3 h-3 text-emerald-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium  text-xs truncate">{rec.title}</p>
                        <p className="text-xs text-slate-600 truncate">{rec.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
        }
      </CardContent >
    </Card>
  </>
  )
}
function FormHomePage() {
  const { data: FormRes, isPending, error, refetch } = useHomePage("form")
  const formData: Form[] | undefined = FormRes?.data?.recentForms as any
  const optimisticUpdateKey: [string, any] = ["home-page", "form"]


  return (<>

    <div className="mt-5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Recent Forms</h2>
            <p className="text-slate-600 text-sm">Froms that have opened up recently</p>
          </div>
        </div>
        <Link href="/explore?mode=Form&sortBy=Recent&page=1">
          <Button variant="outline" className="hidden sm:flex bg-transparent text-sm">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div>
        {isPending ? (
          <RecentFormsSkeleton />
        ) : (
          error ? (
            <ErrorBox
              title="Failed to Load Data"
              message={error?.message ?? "Something went wrong."}
              onRetry={() => refetch()
              }
            />
          ) : !formData ? (
            <ErrorBox
              title="No Data"
              message="We couldn't find the data."
              onRetry={() => (refetch as any)()}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {formData.map((form) => (
                <Card
                  key={form.id}
                  className="group cursor-pointer hover:shadow-md transition-all duration-300"
                >
                  <Link href={form.link ?? "/"}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="line-clamp-1">
                          {form.title}
                        </CardTitle>
                        <FollowButton variant="outline" isFollowing={form.isFollowing || false} idToFollow={form.id} queryKey={optimisticUpdateKey} />

                      </div>
                      <CardDescription className="flex items-center gap-1 text-xs">
                        <Building2 className="w-3 h-3" />
                        {form.institute}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4 text-xs">
                      <CardDescription className="line-clamp-2 ">{form.description}</CardDescription>
                      <div className="flex gap-2 justify-start">
                        <Badge variant="secondary" className={getLevelColor("green")}>
                          <Clock className="w-3 h-3 mr-2" />
                          {form.lastOpened}
                        </Badge>
                        <Badge variant="secondary" className={getLevelColor("red")}>
                          <Calendar className="w-3 h-3 mr-2" />
                          {form.deadline}
                        </Badge>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )
        )}
      </div>
    </div >
  </>
  )
}
function CourseHomePage() {
  const { data: courseRes, isPending, error, refetch } = useHomePage("course")
  const courseData: Course[] | undefined = courseRes?.data?.topCourses as any
  const optimisticUpdateKey: [string, any] = ["home-page", "course"]

  return (<>

    <div className="mt-10 flex flex-col gap-6">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg">
            <BookOpen className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Popular Courses</h2>
            <p className="text-slate-600 text-sm">Trending courses this week</p>
          </div>
        </div>
        <Link href="/explore?mode=Course&sortBy=Popularity&page=1">
          <Button variant="outline" className="hidden sm:flex bg-transparent text-sm">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div>
        {isPending ? (
          <CoursesSkeleton />
        ) :
          error ? (
            <ErrorBox
              title="Failed to Load Data"
              message={error?.message ?? "Something went wrong."}
              onRetry={() => refetch()
              }
            />
          ) : !courseData ? (
            <ErrorBox
              title="No Data"
              message="We couldn't find the data."
              onRetry={() => (refetch as any)()}
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courseData.map((course) => (
                <Card
                  key={course.id}
                  className="group cursor-pointer hover:shadow-md transition-all duration-300 "
                >
                  <Link href={course.link ?? "/"}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="line-clamp-1">
                          {course.title}
                        </CardTitle>
                        <FollowButton isFollowing={course.isFollowing || false} idToFollow={course.id} queryKey={optimisticUpdateKey} />
                      </div>


                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src="/placeholder.svg?height=20&width=20" />
                          <AvatarFallback className="text-xs">
                            {course.instructor
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <CardDescription className="text-xs">{course.instructor}</CardDescription>
                      </div>

                    </CardHeader>

                    <CardContent className="space-y-5">
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{course.rating}</span>
                          <span className="text-slate-500">({course.students.toLocaleString()})</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pb-3 border-b">
                        <Badge variant="secondary" className={getLevelColor(course.level === "Beginner" ? "green" : course.level === "Intermediate" ? "yellow" : "red")}>
                          <Clock className="w-3 h-3 mr-2" />
                          {course.level}
                        </Badge>


                        {
                          course.originalPrice && (
                            <Badge variant="secondary" className={getLevelColor("red")}>
                              <Calendar className="w-3 h-3 mr-2" />
                              {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% off
                            </Badge>
                          )
                        }

                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold ">${course.price}</span>
                          {course.originalPrice && (
                            <span className="text-xs text-slate-500 line-through">${course.originalPrice}</span>
                          )}
                        </div>
                        <Button size="sm" variant="outline" className="text-xs px-3 py-1">
                          Enroll Now
                        </Button>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          )
        }
      </div>
    </div >

  </>
  )
}
function InstituteHomePage() {
  const { data: instituteRes, isPending, error, refetch } = useHomePage("institute")
  const instituteData: Institute[] | undefined = instituteRes?.data?.topInstitutes as any
  const optimisticUpdateKey: [string, any] = ["home-page", "institute"]
  return (<>

    <div className="mt-10 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg">
            <Building2 className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Top Institutions</h2>
            <p className="text-slate-600 text-sm">Learn from the best universities worldwide</p>
          </div>
        </div>
        <Link href="/explore?mode=Institution&sortBy=Popularity&page=1">
          <Button variant="outline" className="hidden sm:flex bg-transparent text-sm">
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
      <div >
        {
          isPending ? (
            <InstituteSkeleton />
          ) :
            error ? (
              <ErrorBox
                title="Failed to Load Data"
                message={error?.message ?? "Something went wrong."}
                onRetry={() => refetch()
                }
              />
            ) : !instituteData ? (
              <ErrorBox
                title="No Data"
                message="We couldn't find the data."
                onRetry={() => (refetch as any)()}
              />
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {instituteData.map((institute) => (
                  <Card key={institute.id} className="group cursor-pointer hover:shadow-md  transition-all duration-300 text-center">
                    <Link href={institute.link ?? "/"}>
                      <CardHeader className="relative pb-2">
                        <div className="relative mx-auto mb-3">
                          <Avatar className="h-12 w-12 mx-auto  border shadow-md">
                            <AvatarImage src={institute.logo} alt={`${institute.name} logo`} />
                            <AvatarFallback className="text-sm font-bold">
                              {institute.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {institute.rating && <div className="absolute top-[0px] right-[-20px] flex items-center justify-center text-xs gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{institute.rating}</span>
                          </div>}
                        </div>
                        <FollowButton classNames="absolute top-1 right-2" isFollowing={institute.isFollowing || false} idToFollow={institute.id} queryKey={optimisticUpdateKey} />
                        <CardTitle className="line-clamp-1">
                          {institute.name}
                        </CardTitle>
                        <CardDescription className="flex flex-col gap-1 text-xs">
                          <p className="flex items-center justify-center ">
                            <MapPin className="w-3 h-3" />
                            {institute.location}
                          </p>
                          <p>
                            {institute.type} • Est. {institute.established}
                          </p>
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <CardDescription>{institute.description}</CardDescription>
                        <div className="flex gap-2 justify-center items-center">
                          {institute.badges && institute.badges.slice(0, 3).map((badge) => {
                            return <Badge key={badge} variant="secondary">
                              {badge}
                            </Badge>
                          })}
                        </div>
                      </CardContent>

                    </Link>
                  </Card>
                ))}
              </div>
            )
        }
      </div >
    </div >
  </>
  )
}



function RecentFormsSkeleton() {
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
function CoursesSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-6 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
function InstituteSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="text-center">
          <CardHeader className="pb-2">
            <Skeleton className="w-12 h-12 rounded-full mx-auto" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-3 w-1/2 mx-auto" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3 mx-auto" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const getLevelColor = (level: string) => {
  switch (level) {
    case "green":
      return "bg-green-100 text-green-800 border-green-200 border hover:bg-green-50"
    case "yellow":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 border hover:bg-yellow-50"
    case "red":
      return "bg-red-100 text-red-800 border-red-200 border hover:bg-red-50"
    case "blue":
      return "bg-blue-100 text-blue-800 border-blue-200 border hover:bg-blue-50"
    default:
      return "bg-slate-100 text-slate-800 border-slate-200 border hover:bg-slate-50"
  }
}

export default function HomePage() {
  const { data: userAuthData = null, isLoading: authLoading, isError: authError } = checkMe()
  const noUser = !userAuthData?.data?.user
  const isLoggedIn = userAuthData?.data?.user && !authLoading && !authError





  return (
    <main className="min-h-screen">
      {/* Hero Section */}

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4 py-6 flex flex-col gap-6">
        {noUser &&
          <HeroSection />
        }
        <FormHomePage />
        <InstituteHomePage />
        <CourseHomePage />
        {isLoggedIn &&
          <RecommendationHomePage username={userAuthData?.data?.user} />
        }

      </div>
    </main >
  )
}
