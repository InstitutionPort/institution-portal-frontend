// File: app/settings/email-management.tsx
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { z } from "zod"
import { Mail, Edit, Shield, Loader2, Check, X } from "lucide-react"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider } from "@/components/ui/tooltip"
import { OtpDialogStateEmail, OtpVerificationDialog } from "@/components/otp-verification-dialog"
import { useUpdateUserPrivateData, useUserPrivateInfo } from "@/lib/queries/use-settings"
import { LoadingBox } from "@/components/loading-box"
import { ErrorBox } from "@/components/error-box"
import { emailChangeFormSchema, emailChangeFormType } from "@/lib/validation/settings-validation"
import { emailType } from "@/lib/validation/common-validation"
import SecurityNotice from "@/components/security-notice"
import { SecureUserMutation } from "@/utils/types"


export function EmailManagement({ username }: { username: string }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otpType, setOtpType] = useState<OtpDialogStateEmail>('email-current')
  const { data: currentEmailResponse, isPending: currentEmailIsPending, error: currentEmailError, refetch: refetchEmail } = useUserPrivateInfo(username, 'secure-info')
  const currentEmail: emailType | undefined = currentEmailResponse?.data?.email
  const emailChangeMutation = useUpdateUserPrivateData<SecureUserMutation>(username, 'secure-info')
  const form = useForm<emailChangeFormType>({
    resolver: zodResolver(emailChangeFormSchema),
    defaultValues: {
      email: "",
    },
  })
  useEffect(() => {
    if (currentEmail) {
      form.reset({
        email: currentEmail || ""
      })
    }
  }, [currentEmail, form])




  const handleSendOtpOldEmail = () => {
    setOtpType("email-current")
    setShowOtpDialog(true)
    setIsEditing(true)
  }
  const handleCancelEmailChange = () => {
    form.setValue("email", currentEmail || "");
    setIsEditing(false);
  }
  const handleEmailChangeSave = () => {
    setOtpType("email-update")
    setShowOtpDialog(true)
    setIsEditing(false)
  }

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Address
          </CardTitle>
          <CardDescription>Manage your email address and change it securely</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {//error handling
            currentEmailIsPending ? (
              <LoadingBox title="Loading Email Info..." message="Please wait while we get your email." />
            ) : currentEmailError ? (
              <ErrorBox
                title="Failed to Load Email Info"
                message={currentEmailError?.message ?? "Something went wrong."}
                onRetry={() => refetchEmail()}
              />
            ) : !currentEmail ? (
              <ErrorBox
                title="No Data"
                message="We couldn't find your account email info."
                onRetry={() => (refetchEmail as any)()}
              />
            )
              //main code
              : !isEditing ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currentEmail}</span>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Primary email address</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleSendOtpOldEmail}>
                      <Edit className="h-4 w-4 mr-1" />
                      Change
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" {...form.register("email")} placeholder="Enter email address" />
                  {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={handleCancelEmailChange}>
                      <X className="h-4 w-4 mr-1" /> Cancel
                    </Button>
                    <Button onClick={handleEmailChangeSave} disabled={emailChangeMutation.isPending || showOtpDialog}>
                      {emailChangeMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-1" />
                      ) : (
                        <Check className="h-4 w-4 mr-1" />
                      )}
                    </Button>
                  </div>
                </div>
              )
          }

          {/* Security Notice */}
          <SecurityNotice
            description=" Your email address is the main source of verification and is used for account recovery and important notifications."
          />
          {currentEmail &&
            <OtpVerificationDialog
              open={showOtpDialog}
              onOpenChange={setShowOtpDialog}
              mutateDataFn={() => emailChangeMutation.mutate({ type: 'email-update' })}
              otpPayload={{ type: otpType, value: otpType === "email-current" ? currentEmail : form.getValues("email") }}
            />
          }
        </CardContent>
      </Card>
    </TooltipProvider>
  )

}