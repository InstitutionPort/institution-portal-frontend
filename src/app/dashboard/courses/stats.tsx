"use client"

import { BookOpen, GraduationCap, Heart, Plus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface CourseStatsProps {
  totalCourses: number
  enrolledCourses: number
  followedCourses: number
}

export function CourseStats({ totalCourses, enrolledCourses, followedCourses }: CourseStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
              <p className="text-2xl font-bold">{totalCourses}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/20">
              <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Enrolled</p>
              <p className="text-2xl font-bold">{enrolledCourses}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-red-100 p-2 dark:bg-red-900/20">
              <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Following</p>
              <p className="text-2xl font-bold">{followedCourses}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
