"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Monitor, Smartphone, Tablet, Trash2, MapPin, Clock, Shield, Loader2, CheckCircle, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import SecurityNotice from "@/components/security-notice"
import { useUpdateUserPrivateData, useUserPrivateInfo } from "@/lib/queries/use-settings"
import { formatDate } from "@/utils/basic-utils"
import { ErrorBox } from "@/components/error-box"
import { LoadingBox } from "@/components/loading-box"

export interface LoginRequest {
  id: string
  deviceName: string
  deviceType: "desktop" | "mobile" | "tablet"
  browser: string
  os: string
  location: string
  ipAddress: string
  requestedAt: string
  status: "pending" | "approved"
  isCurrentDevice?: boolean
}

type SessionMutationPayload = {
  requestId: string;
  action: "approve" | "deny"
}


export function SessionManagement({ username }: { username: string }) {
  const { data: sessionRequestsRes, isPending: sessionRequestIsPending, error: sessionRequestIsError, refetch: refetchSessionRequest } = useUserPrivateInfo(username, 'session-info')
  const sessionRequests: LoginRequest[] | undefined = sessionRequestsRes?.data?.sessionRequests
  const sessionChangeMutation = useUpdateUserPrivateData<SessionMutationPayload>(username, 'session-info')


  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "mobile":
        return <Smartphone className="h-5 w-5" />
      case "tablet":
        return <Tablet className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  const getStatusBadge = (status: string, isCurrentDevice?: boolean) => {
    if (isCurrentDevice) {
      return <Badge variant="default" className="bg-foreground text-background">Current Device</Badge>
    }

    switch (status) {
      case "approved":
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-foreground text-background">
            <CheckCircle className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="flex items-center gap-1 bg-foreground text-background">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
      case "denied":
        return (
          <Badge variant="destructive" className="flex items-center gap-1 bg-foreground text-background">
            <X className="h-3 w-3" />
            Denied
          </Badge>
        )
      default:
        return null
    }
  }

  const handleApprove = (requestId: string) => {
    sessionChangeMutation.mutate({ requestId, action: "approve" })

  }

  const handleDeny = (requestId: string) => {
    sessionChangeMutation.mutate({ requestId, action: "deny" })

  }



  const pendingRequests = sessionRequests?.filter((req) => req.status === "pending")
  const approvedRequests = sessionRequests?.filter((req) => req.status === "approved")


  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Monitor className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Session & Device Management</p>
              </TooltipContent>
            </Tooltip>
            Session & Device Management
          </CardTitle>
          <CardDescription>Manage login requests and active sessions for your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {
            sessionRequestIsPending ? (
              <LoadingBox title="Loading Session Info..." message="Please wait while we get your session requests." />
            ) : sessionRequestIsError ? (
              <ErrorBox
                title="Failed to Load Session Info"
                message={sessionRequestIsError?.message ?? "Something went wrong."}
                onRetry={() => refetchSessionRequest()}
              />
            ) : !sessionRequests ? (
              <ErrorBox
                title="No Data"
                message="We couldn't find your account session info."
                onRetry={() => (refetchSessionRequest as any)()}
              />
            )
              : <>
                {pendingRequests && pendingRequests.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium">Pending Login Requests({pendingRequests.length})</h4>
                    </div>
                    <div className="space-y-3">
                      {pendingRequests.map((request) => (
                        <div key={request.id} className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="p-2 bg-yellow-100 rounded-md text-yellow-600">
                                    {getDeviceIcon(request.deviceType)}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{request.deviceType.charAt(0).toUpperCase() + request.deviceType.slice(1)} device</p>
                                </TooltipContent>
                              </Tooltip>
                              <div className="flex-1 text-slate-700">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium ">{request.deviceName}</h5>
                                  {getStatusBadge(request.status, request.isCurrentDevice)}
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p>
                                    {request.browser} • {request.os}
                                  </p>
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <MapPin className="h-3 w-3" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Location</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      {request.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Clock className="h-3 w-3" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Last activity</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      {formatDate(request.requestedAt)}
                                    </span>
                                  </div>
                                  <p className="text-xs">IP: {request.ipAddress}</p>
                                </div>
                              </div>
                            </div>

                            {/* {isEditing && ( */}
                            <div className="flex items-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleApprove(request.id)}
                                    disabled={sessionChangeMutation.isPending}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Approve login request</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeny(request.id)}
                                    disabled={sessionChangeMutation.isPending}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Deny login request</p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                            {/* )} */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {approvedRequests && approvedRequests.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Approved Devices ({approvedRequests.length})</h4>
                    </div>
                    <div className="space-y-3">
                      {approvedRequests.map((request) => (
                        <div key={request.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className="p-2 bg-green-50 rounded-md text-green-600">
                                    {getDeviceIcon(request.deviceType)}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{request.deviceType.charAt(0).toUpperCase() + request.deviceType.slice(1)} device</p>
                                </TooltipContent>
                              </Tooltip>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h5 className="font-medium">{request.deviceName}</h5>
                                  {getStatusBadge(request.status, request.isCurrentDevice)}
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p>
                                    {request.browser} • {request.os}
                                  </p>
                                  <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <MapPin className="h-3 w-3" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Location</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      {request.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Clock className="h-3 w-3" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>Last activity</p>
                                        </TooltipContent>
                                      </Tooltip>
                                      {formatDate(request.requestedAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* {isEditing && !request.isCurrentDevice && ( */}
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeny(request.id)}
                                  disabled={sessionChangeMutation.isPending}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove device access</p>
                              </TooltipContent>
                            </Tooltip>
                            {/* )} */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {sessionRequests.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No login requests found</p>
                  </div>
                )}
              </>

          }

          {/* Security Notice */}
          <SecurityNotice
            description="Review all login requests carefully. Only approve devices you recognize and trust. Deny any suspicious
                  requests immediately."
          />

        </CardContent >
      </Card >
    </TooltipProvider >
  )
}
