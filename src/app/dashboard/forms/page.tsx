"use client"

import { useState, useEffect } from "react"
import {
  FileText,
  Building2,
  Calendar,
  Search,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  BookOpen,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormCardSkeleton } from "../skeletons"
import { Form } from "@/app/api/dashboard/forms/route"
import { useDashboardQuery } from "@/lib/queries/dashboard/use-dashboad"
import { checkMe } from "@/lib/queries/use-checkme"
import { ErrorBox } from "@/components/error-box"
import FollowButton from "@/components/follow-button"




export default function FormsPage() {
  const { data: userData, isPending, isError, error } = checkMe()
  const route = "/api/dashboard/forms"
  const { data: formsRes, isPending: formsPending, error: formsError, refetch: refetchUser } = useDashboardQuery(route, userData?.data?.user)
  const forms: undefined | Form[] = formsRes?.data?.forms
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")



  const filteredForms = forms?.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (form.course && form.course.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTab = activeTab === "all" || form.status.toLowerCase() === activeTab.toLowerCase() || (activeTab.toLowerCase() === "followed" && form.isFollowing)
    return matchesSearch && matchesTab
  }) || []

  const getStatusIcon = (status: Form["status"]) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "Saved":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "Pending":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }


  const getActionButton = (form: Form) => {
    switch (form.status) {
      case "Pending":
        return (
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Continue Form
          </Button>
        )
      default:
        return (
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View Submission
          </Button>
        )
    }
  }

  const statusCounts = {
    all: forms?.length ?? 0,
    submitted: forms?.filter((f) => f.status === "Saved").length ?? 0,
    pending: forms?.filter((f) => f.status === "Pending").length ?? 0,
    approved: forms?.filter((f) => f.status === "Approved").length ?? 0,
    rejected: forms?.filter((f) => f.status === "Rejected").length ?? 0,
  }

  return (
    <div className="space-y-6">
      {isError || (!isPending && !userData?.data?.user) ?
        <ErrorBox message={error?.message ?? "Please try to reauthenticate or refresh."
        } /> : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Forms</h1>
                <p className="text-muted-foreground">Manage your form submissions and track their status</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search forms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full  grid-cols-2 h-27  sm:border sm:h-9 sm:grid-cols-6">
                <TabsTrigger className="border rounded-none sm:border-none" value="all">All ({statusCounts.all})</TabsTrigger>
                <TabsTrigger className="border rounded-none sm:border-none" value="saved">Saved ({statusCounts.submitted})</TabsTrigger>
                <TabsTrigger className="border rounded-none sm:border-none" value="pending">Pending ({statusCounts.pending})</TabsTrigger>
                <TabsTrigger className="border rounded-none sm:border-none" value="approved">Approved ({statusCounts.approved})</TabsTrigger>
                <TabsTrigger className="border rounded-none sm:border-none" value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
                <TabsTrigger className="border rounded-none sm:border-none" value="followed">Followed ({statusCounts.rejected})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-6">
                <ScrollArea className="h-[600px]">
                  {formsPending ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <FormCardSkeleton key={i} />
                      ))}
                    </div>
                  ) : formsError ? (
                    <ErrorBox
                      title="Failed to Load Data"
                      message={formsError?.message ?? "Something went wrong."}
                      onRetry={() => refetchUser()}
                    />
                  ) : !forms ? (
                    <ErrorBox
                      title="No Data"
                      message="We couldn't find your forms info."
                      onRetry={() => (refetchUser as any)()}
                    />
                  ) : (
                    <div className="space-y-4">
                      {filteredForms.map((form) => (
                        <Card key={form.id} className="transition-all hover:shadow-md">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-2">
                                <CardTitle className="text-lg">{form.title}</CardTitle>
                              </div>
                              <Badge variant="outline" className="flex items-center gap-1">
                                {getStatusIcon(form.status)}
                                {form.status}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Building2 className="mr-2 h-4 w-4" />
                                {form.institution}
                              </div>
                              {form.course && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <BookOpen className="mr-2 h-4 w-4" />
                                  {form.course}
                                </div>
                              )}
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Calendar className="mr-2 h-4 w-4" />
                                  Submitted {new Date(form.submissionDate).toLocaleDateString()}
                                </div>
                                <div className="flex gap-2">
                                  {getActionButton(form)}
                                  {
                                    <FollowButton idToFollow={form.id}
                                      isFollowing={form.isFollowing}
                                      queryKey={[route, userData?.data?.user]}
                                    />
                                  }
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {!isPending && filteredForms.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-semibold">No forms found</h3>
                      <p className="text-muted-foreground">
                        {searchTerm ? "Try adjusting your search terms" : "You haven't submitted any forms yet"}
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>)}
    </div >
  )
}
