"use client"

import { useState, useEffect } from "react"
import { BookOpen, Building2, Calendar, Clock, Plus, Search, Filter, ExternalLink } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CourseCardSkeleton } from "../skeletons"
import { CourseStats } from "./stats"
import FollowButton from "@/components/follow-button"
import { Course } from "@/app/api/dashboard/courses/route"
import { useDashboardQuery } from "@/lib/queries/dashboard/use-dashboad"
import { checkMe } from "@/lib/queries/use-checkme"
import { ErrorBox } from "@/components/error-box"
import Link from "next/link"

export default function CoursesPage() {
  const { data: userData, isPending, isError, error } = checkMe()
  const route = "/api/dashboard/courses"
  const { data: coursesRes, isPending: coursesPending, error: coursesError, refetch: refetchUser } = useDashboardQuery(route, userData?.data?.user)
  const courses: undefined | Course[] = coursesRes?.data?.courses
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [relationshipFilter, setRelationshipFilter] = useState<string>("all")



  const filteredCourses = courses?.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.institution.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || course.status.toLowerCase() === activeTab.toLowerCase()
    const matchesRelationship =
      relationshipFilter === "all" || (course.isEnrolled && relationshipFilter.toLowerCase() === "enrolled") || (course.isFollowing && relationshipFilter.toLowerCase() === "following")
    return matchesSearch && matchesTab && matchesRelationship
  }) || []

  const getStatusColor = (status: Course["status"]) => {
    switch (status) {
      case "Ongoing":
        return "default"
      case "Completed":
        return "secondary"
      case "Upcoming":
        return "outline"
      default:
        return "secondary"
    }
  }


  return (
    <div className="space-y-6">
      {isError || (!isPending && !userData?.data?.user) ?
        <ErrorBox message={error?.message ?? "Please try to reauthenticate or refresh."} /> : (
          <>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
              <p className="text-muted-foreground">Courses you're enrolled in or following</p>
            </div>

            <CourseStats
              totalCourses={courses?.length ?? 0}
              enrolledCourses={courses?.filter((c) => c.isEnrolled).length ?? 0}
              followedCourses={courses?.filter((c) => c.isFollowing).length ?? 0}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={relationshipFilter} onValueChange={setRelationshipFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="enrolled">Enrolled</SelectItem>
                  <SelectItem value="following">Following</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full border grid-cols-2 h-18 sm:h-9 sm:grid-cols-4 ">
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                {coursesPending ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <CourseCardSkeleton key={i} />
                    ))}
                  </div>
                ) : coursesError ? (
                  <ErrorBox
                    title="Failed to Load Data"
                    message={coursesError?.message ?? "Something went wrong."}
                    onRetry={() => refetchUser()}
                  />
                ) : !courses ? (
                  <ErrorBox
                    title="No Data"
                    message="We couldn't find your courses info."
                    onRetry={() => (refetchUser as any)()}
                  />
                ) : (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredCourses.map((course) => (
                      <Card key={course.id} className="relative transition-all hover:shadow-lg">
                        <Link href={course.link}>
                          <CardHeader className="pb-3">
                            <div className="space-y-2 ">
                              <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Building2 className="mr-2 h-4 w-4" />
                                {course.institution}
                              </div>

                            </div>
                          </CardHeader>
                          {
                            <FollowButton classNames={"absolute bottom-2 right-2"} idToFollow={course.id}
                              isFollowing={course.isFollowing}
                              queryKey={[route, userData?.data?.user]}
                            />
                          }
                          <CardContent className="pt-0">
                            <div className="space-y-3 rounded">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="mr-2 h-4 w-4" />
                                  {course.duration}
                                </div>
                                <Badge variant={getStatusColor(course.status)}>{course.status}</Badge>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4" />
                                Started {new Date(course.startDate).toLocaleDateString()}
                              </div>

                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                )}

                {!coursesPending && !coursesError && filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No courses found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || relationshipFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Get started by enrolling in, following, or creating your first course"}
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>)
      }
    </div >
  )
}
