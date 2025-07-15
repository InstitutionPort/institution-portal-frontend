"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Phone, Edit, Loader2, Shield } from "lucide-react"
import { OtpVerificationDialog } from "@/components/otp-verification-dialog"
import { useUpdateField, useCheckUniqueness, useChangeSecureInfo } from "@/hooks/use-settings"
import { toast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const phoneSchema = z.object({
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits"),
})

interface PhoneManagementProps {
  currentPhoneNumber: string
  isEditing: boolean
  username: string
}

export function PhoneManagement({ currentPhoneNumber = "+1234567890", isEditing, username }: PhoneManagementProps) {
  const [isChangingPhone, setIsChangingPhone] = useState(false)
  const [otpDialog, setOtpDialog] = useState<{
    open: boolean
    type: "phone_change_old" | "phone_change_new"
    value: string
    newPhoneNumber?: string
  }>({
    open: false,
    type: "phone_change_old",
    value: "",
  })

  const updateFieldMutation = useUpdateField()
  const checkUniquenessMutation = useCheckUniqueness()
  const changeSecureInfoMutation = useChangeSecureInfo(username)

  const form = useForm({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  })

  const handleChangePhone = async () => {
    const newPhoneNumber = form.getValues("phoneNumber")
    if (!newPhoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a new phone number",
        variant: "destructive",
      })
      return
    }

    if (newPhoneNumber === currentPhoneNumber) {
      toast({
        title: "Info",
        description: "This is already your current phone number",
      })
      return
    }

    // Check uniqueness
    try {
      const result = await checkUniquenessMutation.mutateAsync({ field: "phoneNumber", value: newPhoneNumber })
      if (!result.isUnique) {
        toast({
          title: "Error",
          description: "Phone number is already in use by another account",
          variant: "destructive",
        })
        return
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check phone number uniqueness",
        variant: "destructive",
      })
      return
    }

    // Start dual verification process - first verify current phone
    setOtpDialog({
      open: true,
      type: "phone_change_old",
      value: currentPhoneNumber,
      newPhoneNumber,
    })
  }

  const handleOtpVerified = async () => {
    if (otpDialog.type === "phone_change_old") {
      // Verified current phone, now verify new phone
      setOtpDialog({
        open: true,
        type: "phone_change_new",
        value: otpDialog.newPhoneNumber!,
        newPhoneNumber: otpDialog.newPhoneNumber,
      })
      return
    }

    // Both verifications complete, update phone number
    try {
      await changeSecureInfoMutation.mutateAsync({
        type: "phone",
        value: otpDialog.newPhoneNumber!,
      })

      toast({
        title: "Success",
        description: "Phone number updated successfully",
      })

      form.reset()
      setIsChangingPhone(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update phone number",
        variant: "destructive",
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <TooltipProvider>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Phone className="h-5 w-5" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Phone Number Management</p>
                </TooltipContent>
              </Tooltip>
              Phone Number Management
            </CardTitle>
            <CardDescription>Manage your phone number for account security and notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Phone Number */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Current Phone Number</h4>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{currentPhoneNumber}</span>
                      <Badge variant="default">Primary</Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Shield className="h-3 w-3" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified phone number</p>
                          </TooltipContent>
                        </Tooltip>
                        Verified
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Added on {formatDate("2024-01-01T00:00:00Z")}</p>
                  </div>

                  {isEditing && !isChangingPhone && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsChangingPhone(true)}
                          className="flex items-center gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Change
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Change your current phone number</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>

            {/* Change Phone Number */}
            {isEditing && isChangingPhone && (
              <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center justify-between">
                  <Label htmlFor="newPhone">New Phone Number</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsChangingPhone(false)
                      form.reset()
                    }}
                  >
                    Cancel
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="newPhone"
                    {...form.register("phoneNumber")}
                    placeholder="Enter new phone number"
                    className="flex-1"
                  />
                  <Button
                    onClick={handleChangePhone}
                    disabled={updateFieldMutation.isPending || checkUniquenessMutation.isPending}
                    className="flex items-center gap-2"
                  >
                    {(updateFieldMutation.isPending || checkUniquenessMutation.isPending) && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Verify & Change
                  </Button>
                </div>
                {form.formState.errors.phoneNumber && (
                  <p className="text-sm text-destructive">{form.formState.errors.phoneNumber.message}</p>
                )}
                <div className="text-xs text-muted-foreground">
                  <p>You'll need to verify both your current and new phone numbers to complete this change.</p>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Security Notice</p>
                  <p className="text-blue-700 mt-1">
                    Your phone number is used for account recovery and two-factor authentication. Changing it requires
                    verification of both your current and new phone numbers.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>

      <OtpVerificationDialog
        open={otpDialog.open}
        onOpenChange={(open) => setOtpDialog((prev) => ({ ...prev, open }))}
        type={otpDialog.type}
        value={otpDialog.value}
        username={username}
        onVerified={handleOtpVerified}
      />
    </>
  )
}
