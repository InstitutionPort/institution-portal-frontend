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
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormCardSkeleton } from "../skeletons"

interface Form {
  id: string
  title: string
  institution: string
  course?: string
  submissionDate: string
  status: "Submitted" | "Pending" | "Rejected" | "Approved"
}

const mockForms: Form[] = [
  {
    id: "1",
    title: "Course Enrollment Application",
    institution: "Stanford University",
    course: "Advanced Machine Learning",
    submissionDate: "2024-01-10",
    status: "Approved",
  },
  {
    id: "2",
    title: "Financial Aid Request",
    institution: "MIT OpenCourseWare",
    submissionDate: "2024-01-15",
    status: "Pending",
  },
  {
    id: "3",
    title: "Transfer Credit Evaluation",
    institution: "Berkeley Online",
    course: "Data Structures & Algorithms",
    submissionDate: "2024-01-20",
    status: "Submitted",
  },
  {
    id: "4",
    title: "Grade Appeal Form",
    institution: "Harvard Extension",
    course: "Digital Marketing Strategy",
    submissionDate: "2024-01-05",
    status: "Rejected",
  },
  {
    id: "5",
    title: "Course Withdrawal Request",
    institution: "Stanford University",
    course: "Advanced Machine Learning",
    submissionDate: "2024-01-25",
    status: "Pending",
  },
]

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setForms(mockForms)
      setLoading(false)
    }

    fetchForms()
  }, [])

  const filteredForms = forms.filter((form) => {
    const matchesSearch =
      form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.institution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (form.course && form.course.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesTab = activeTab === "all" || form.status.toLowerCase() === activeTab.toLowerCase()
    return matchesSearch && matchesTab
  })

  const getStatusIcon = (status: Form["status"]) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "Rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "Pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "Submitted":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Form["status"]) => {
    switch (status) {
      case "Approved":
        return "default"
      case "Rejected":
        return "destructive"
      case "Pending":
        return "secondary"
      case "Submitted":
        return "outline"
      default:
        return "secondary"
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
    all: forms.length,
    submitted: forms.filter((f) => f.status === "Submitted").length,
    pending: forms.filter((f) => f.status === "Pending").length,
    approved: forms.filter((f) => f.status === "Approved").length,
    rejected: forms.filter((f) => f.status === "Rejected").length,
  }

  return (
    <div className="space-y-6">
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
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({statusCounts.submitted})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({statusCounts.approved})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <ScrollArea className="h-[600px]">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FormCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredForms.map((form) => (
                  <Card key={form.id} className="transition-all hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-lg">{form.title}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Building2 className="mr-2 h-4 w-4" />
                            {form.institution}
                            {form.course && (
                              <>
                                <span className="mx-2">•</span>
                                {form.course}
                              </>
                            )}
                          </div>
                        </div>
                        <Badge variant={getStatusColor(form.status)} className="flex items-center gap-1">
                          {getStatusIcon(form.status)}
                          {form.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="mr-2 h-4 w-4" />
                          Submitted {new Date(form.submissionDate).toLocaleDateString()}
                        </div>
                        {getActionButton(form)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {!loading && filteredForms.length === 0 && (
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
    </div>
  )
}
