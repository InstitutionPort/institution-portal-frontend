"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, Lock, ImageIcon, Clock, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useUserPrivateInfo } from "@/lib/queries/use-settings"
import { LoadingBox } from "@/components/loading-box"
import { ErrorBox } from "@/components/error-box"
import { AccountBackup } from "./account-backup"

export type ActivityItem = {
  id: string
  type: "profile_update" | "email_change" | "phone_change" | "password_change" | "image_upload" | "login"
  description: string
  timestamp: string
  metadata?: Record<string, any>
}


export function ActivityTimeline({ username }: { username: string }) {


  const {
    data: activityDataRes,
    isPending: activityDataLoading,
    error: activityDataError,
    refetch: refetchActivityData,
  } = useUserPrivateInfo(username, "activity-info")

  const activityData: ActivityItem[] | undefined = activityDataRes?.data?.activities

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "profile_update":
        return <User className="h-4 w-4" />
      case "email_change":
        return <Mail className="h-4 w-4" />
      case "phone_change":
        return <Phone className="h-4 w-4" />
      case "password_change":
        return <Lock className="h-4 w-4" />
      case "image_upload":
        return <ImageIcon className="h-4 w-4" />
      case "login":
        return <Clock className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: ActivityItem["type"]) => {
    switch (type) {
      case "profile_update":
        return "bg-blue-100 text-blue-600"
      case "email_change":
        return "bg-green-100 text-green-600"
      case "phone_change":
        return "bg-purple-100 text-purple-600"
      case "password_change":
        return "bg-red-100 text-red-600"
      case "image_upload":
        return "bg-orange-100 text-orange-600"
      case "login":
        return "bg-gray-100 text-gray-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`
    return date.toLocaleDateString()
  }


  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Clock className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Recent Activity Timeline</p>
              </TooltipContent>
            </Tooltip>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activityDataLoading ? (
            <LoadingBox title="Loading Activity Timeline..." message="Please wait while we get your activity timeline." />
          ) : activityDataError ? (
            <ErrorBox
              title="Failed to Load Activity Timeline"
              message={activityDataError?.message ?? "Something went wrong."}
              onRetry={() => refetchActivityData()}
            />
          ) : !activityData ? (
            <ErrorBox
              title="No Data"
              message="We couldn't find your account email info."
              onRetry={() => (refetchActivityData as any)()}
            />
          ) :
            (<>{
              activityData.slice(0, 6).map((activity, index) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{activity.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</p>
                    </TooltipContent>
                  </Tooltip>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium`">{activity.description}</p>
                    {activity.metadata && (
                      <div className="mt-1 space-y-1">
                        {activity.metadata.fields && (
                          <p className="text-xs text-muted-foreground">Fields: {activity.metadata.fields.join(", ")}</p>
                        )}
                        {activity.metadata.email && (
                          <p className="text-xs text-muted-foreground">Email: {activity.metadata.email}</p>
                        )}
                        {activity.metadata.device && (
                          <p className="text-xs text-muted-foreground">Device: {activity.metadata.device}</p>
                        )}
                        {activity.metadata.location && (
                          <p className="text-xs text-muted-foreground">Location: {activity.metadata.location}</p>
                        )}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(activity.timestamp)}</p>
                  </div>
                </div>
              ))
            }

              {activityData.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                </div>
              )}
              <div className="pt-4 border-t text-muted-foreground flex gap-2 items-center">
                <Info className="w-4 h-4 " />
                <p className="text-sm ">For more data on your recent activity timeline, download the account backup.</p>
              </div>

            </>)}
        </CardContent>
      </Card>
    </TooltipProvider >
  )
}
