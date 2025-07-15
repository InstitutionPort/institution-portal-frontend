"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Shield } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { userPrivacyInfoSchemaType } from "@/lib/validation/settings-validation"
import { useUpdateUserPrivateData, useUserPrivateInfo } from "@/lib/queries/use-settings"
import { ErrorBox } from "@/components/error-box"
import { LoadingBox } from "@/components/loading-box"



export function PrivacySettings({ username }: { username: string }) {
  const { data: userPrivacySettingsResposne, isPending: userPending, error: userError, refetch: refetchUser } = useUserPrivateInfo(username, 'privacy-info')
  const userPrivacySettings = userPrivacySettingsResposne?.data as any
  const updatePrivacySettingsMutation = useUpdateUserPrivateData<userPrivacyInfoSchemaType>(username, 'privacy-info')



  const handleSettingChange = (key: keyof userPrivacyInfoSchemaType, value: boolean) => {
    updatePrivacySettingsMutation.mutate({ [key]: value })
  }




  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Shield className="h-5 w-5" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Privacy & Security Settings</p>
              </TooltipContent>
            </Tooltip>
            Privacy & Security
          </CardTitle>
          <CardDescription>Control who can see your information and how your data is used</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {userPending ? (
            <LoadingBox title="Loading Privacy Info..." message="Please wait while we get your data." />
          ) : userError ? (
            <ErrorBox
              title="Failed to Load Privacy Data"
              message={userError?.message ?? "Something went wrong."}
              onRetry={() => refetchUser()}
            />
          ) : !userPrivacySettings ? (
            <ErrorBox
              title="No Data"
              message="Sorry, we couldn't find your privacy info."
              onRetry={() => (refetchUser as any)()}
            />
          ) : (<>

            {/* Contact Information Visibility */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Contact Information</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showEmail">Show Email Address</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your email address</p>
                  </div>
                  <Switch
                    id="showEmail"
                    checked={userPrivacySettings.showEmail}
                    onCheckedChange={(checked) => handleSettingChange("showEmail", checked)}
                    disabled={updatePrivacySettingsMutation.isPending}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showPhone">Show Phone Number</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your phone number</p>
                  </div>
                  <Switch
                    id="showPhone"
                    checked={userPrivacySettings.showPhone || true}
                    onCheckedChange={(checked) => handleSettingChange("showPhone", checked)}
                    disabled={updatePrivacySettingsMutation.isPending}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showLocation">Show Location</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your city and country</p>
                  </div>
                  <Switch
                    id="showLocation"
                    checked={userPrivacySettings.showLocation}
                    onCheckedChange={(checked) => handleSettingChange("showLocation", checked)}
                    disabled={updatePrivacySettingsMutation.isPending}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showEducation">Show Education</Label>
                    <p className="text-sm text-muted-foreground">Allow others to see your education details</p>
                  </div>
                  <Switch
                    id="showEducation"
                    checked={userPrivacySettings.showEducation}
                    onCheckedChange={(checked) => handleSettingChange("showEducation", checked)}
                    disabled={updatePrivacySettingsMutation.isPending}
                  />
                </div>
              </div>
            </div>

            {/* Data & Privacy */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Data & Privacy</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dataCollection">Analytics & Improvement</Label>
                    <p className="text-sm text-muted-foreground">Help improve our service with usage analytics</p>
                  </div>
                  <Switch
                    id="dataCollection"
                    checked={userPrivacySettings.dataCollection}
                    onCheckedChange={(checked) => handleSettingChange("dataCollection", checked)}
                    disabled={updatePrivacySettingsMutation.isPending}
                  />
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Email Notifications</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketingEmails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about new features and promotions</p>
                  </div>
                  <Switch
                    id="marketingEmails"
                    checked={userPrivacySettings.marketingEmails}
                    onCheckedChange={(checked) => handleSettingChange("marketingEmails", checked)}
                    disabled={updatePrivacySettingsMutation.isPending}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="securityNotifications">Security Notifications</Label>
                    <p className="text-sm text-muted-foreground">Important security alerts and login notifications</p>
                  </div>
                  <Switch
                    id="securityNotifications"
                    checked={userPrivacySettings.securityNotifications}
                    onCheckedChange={(checked) => handleSettingChange("securityNotifications", checked)}
                    disabled={updatePrivacySettingsMutation.isPending}
                  />
                </div>
              </div>
            </div>
          </>)}
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
