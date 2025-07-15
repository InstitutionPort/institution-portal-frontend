// // "use client"

// // import { useState } from "react"
// // import { useForm } from "react-hook-form"
// // import { zodResolver } from "@hookform/resolvers/zod"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Badge } from "@/components/ui/badge"
// // import { Phone, Shield, Plus, Trash2, Edit, Loader2, Check, X } from "lucide-react"
// // import { TooltipProvider } from "@/components/ui/tooltip"

// // interface PhoneManagementProps {
// //   currentPhone?: mobileSchemaType
// //   username: string
// // }

// // export function PhoneManagement({ currentPhone, username }: PhoneManagementProps) {

// //   return (
// //     <TooltipProvider>
// //       <Card>
// //         <CardHeader>
// //           <CardTitle className="flex items-center gap-2">
// //             <Phone className="h-5 w-5" />
// //             Phone Number
// //             <Badge variant="outline" className="ml-2">
// //               Optional
// //             </Badge>
// //           </CardTitle>
// //           <CardDescription>Manage your phone number for account security and notifications</CardDescription>
// //         </CardHeader>
// //         <CardContent className="space-y-6">
// //           {!isEditing ? (
// //             <div className="space-y-4">
// //               {currentPhone ? (
// //                 <div className="p-4 border rounded-lg">
// //                   <div className="flex items-center justify-between">
// //                     <div className="flex-1">
// //                       <div className="flex items-center gap-2">
// //                         <span className="font-medium">{formatPhoneNumber(currentPhone)}</span>
// //                         <Badge variant="secondary" className="flex items-center gap-1">
// //                           <Shield className="h-3 w-3" />
// //                           Verified
// //                         </Badge>
// //                       </div>
// //                       <p className="text-sm text-muted-foreground">Primary phone number</p>
// //                     </div>
// //                     <div className="flex gap-2">
// //                       <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
// //                         <Edit className="h-4 w-4 mr-1" />
// //                         Change
// //                       </Button>
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         onClick={handleRemovePhone}
// //                         className="text-destructive hover:text-destructive bg-transparent"
// //                       >
// //                         <Trash2 className="h-4 w-4 mr-1" />
// //                         Remove
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="text-center py-8">
// //                   <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
// //                   <p className="text-muted-foreground mb-4">No phone number added</p>
// //                   <Button onClick={() => setIsEditing(true)}>
// //                     <Plus className="h-4 w-4 mr-1" />
// //                     Add Phone Number
// //                   </Button>
// //                 </div>
// //               )}
// //             </div>
// //           ) : (
// //             <div className="space-y-4">
// //               <div className="grid grid-cols-3 gap-2">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="countryCode">Country Code</Label>
// //                   <Input id="countryCode" {...form.register("countryCode")} placeholder="+1" />
// //                   {form.formState.errors.countryCode && (
// //                     <p className="text-sm text-destructive">{form.formState.errors.countryCode.message}</p>
// //                   )}
// //                 </div>
// //                 <div className="space-y-2 col-span-2">
// //                   <Label htmlFor="number">Phone Number</Label>
// //                   <Input id="number" {...form.register("number")} placeholder="1234567890" />
// //                   {form.formState.errors.number && (
// //                     <p className="text-sm text-destructive">{form.formState.errors.number.message}</p>
// //                   )}
// //                 </div>
// //               </div>

// //               <div className="flex justify-end gap-2">
// //                 <Button type="button" variant="outline" onClick={handleCancel}>
// //                   <X className="h-4 w-4 mr-1" />
// //                   Cancel
// //                 </Button>
// //                 <Button onClick={handleAddOrChangePhone} disabled={sendOtpMutation.isPending}>
// //                   {sendOtpMutation.isPending ? (
// //                     <Loader2 className="h-4 w-4 animate-spin mr-1" />
// //                   ) : (
// //                     <Check className="h-4 w-4 mr-1" />
// //                   )}
// //                   Verify & {currentPhone ? "Change" : "Add"}
// //                 </Button>
// //               </div>
// //             </div>
// //           )}

// //           {/* Security Notice */}
// //           <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
// //             <div className="flex items-start gap-2">
// //               <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
// //               <div className="text-sm">
// //                 <p className="font-medium text-blue-800">Security Notice</p>
// //                 <p className="text-blue-700 mt-1">
// //                   Adding a phone number enhances your account security and enables two-factor authentication. It
// //                   requires verification before being activated.
// //                 </p>
// //               </div>
// //             </div>
// //           </div>
// //         </CardContent>

// //         <OtpVerificationDialog
// //           open={showOtpDialog}
// //           onOpenChange={setShowOtpDialog}
// //           type="phone"
// //           value={newPhone}
// //           username={username}
// //           onVerified={handleOtpVerified}
// //           title={`Verify ${currentPhone ? "New" : ""} Phone Number`}
// //           description={`We'll send a verification code to ${newPhone}`}
// //         />
// //       </Card>
// //     </TooltipProvider>
// //   )
// // }
// // File: app/settings/mobile-management.tsx
// "use client"

// import { useEffect, useState } from "react"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { toast } from "sonner"
// import { number, z } from "zod"
// import { Mail, Edit, Shield, Loader2, Check, X } from "lucide-react"

// import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { TooltipProvider } from "@/components/ui/tooltip"
// import { OtpVerificationDialog } from "@/components/otp-verification-dialog"
// import { useUpdateUserPrivateData, useUserPrivateInfo } from "@/lib/queries/use-settings"
// import { LoadingBox } from "@/components/loading-box"
// import { ErrorBox } from "@/components/error-box"
// import { mobileType, mobileSchema } from "@/lib/validation/common-validation"
// import SecurityNotice from "@/components/security-notice"

// export type otpDialogState = 'mobile-current' | 'mobile-new' | 'no-mobile'

// export function MobileManagement({ username }: { username: string }) {
//   const [isEditing, setIsEditing] = useState(false)
//   const [showOtpDialog, setShowOtpDialog] = useState(false)
//   const [otpType, setOtpType] = useState<otpDialogState>('no-mobile')
//   const { data: mobileDataResponse, isPending: mobileIsPending, error: mobileError, refetch: refetchMobile } = useUserPrivateInfo(username, 'secure-info')
//   const mobileData: mobileType | undefined | 'no-mobile' = mobileDataResponse?.data?.mobile
//   const mobileChangeMutation = useUpdateUserPrivateData<undefined>(username, 'secure-info')
//   const form = useForm<mobileType>({
//     resolver: zodResolver(mobileSchema),
//     defaultValues: {
//       number: "",
//       countryCode: ""

//     },
//   })
//   useEffect(() => {
//     if (mobileData === 'no-mobile') {
//       setOtpType('no-mobile')
//     }
//     else if (mobileData && mobileData.number && mobileData.countryCode) {
//       form.reset({
//         number: mobileData.number,
//         countryCode: mobileData.countryCode
//       })
//       setOtpType('mobile-current')
//     }
//   }, [mobileData, form])




//   const handleSendOtpOldMobile = () => {
//     setOtpType("mobile-current")
//     setShowOtpDialog(true)
//     setIsEditing(true)
//   }
//   const handleCancelMobileChange = () => {
//     form.setValue("", mobile || "");
//     setIsEditing(false);
//   }
//   const handleEmailChangeSav = () => {
//     setOtpType("mobile-new")
//     setShowOtpDialog(true)
//     setIsEditing(false)
//   }

//   return (
//     <TooltipProvider>
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Mail className="h-5 w-5" />
//             mobile Address
//           </CardTitle>
//           <CardDescription>Manage your mobile address and change it securely</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">

//           {//error handling
//             mobileIsPending ? (
//               <LoadingBox title="Loading mobile Info..." message="Please wait while we get your mobile." />
//             ) : mobileError ? (
//               <ErrorBox
//                 title="Failed to Load mobile Info"
//                 message={mobileError?.message ?? "Something went wrong."}
//                 onRetry={() => mobile()}
//               />
//             ) : !mobile ? (
//               <ErrorBox
//                 title="No Data"
//                 message="We couldn't find your account info."
//                 onRetry={() => (mobile as any)()}
//               />
//             )
//               //main code
//               : !isEditing ? (
//                 <div className="space-y-4">
//                   <div className="p-4 border rounded-lg flex items-center justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2">
//                         <span className="font-medium">{mobile}</span>
//                         <Badge variant="secondary" className="flex items-center gap-1">
//                           <Shield className="h-3 w-3" />
//                           Verified
//                         </Badge>
//                       </div>
//                       <p className="text-sm text-muted-foreground">Primary mobile address</p>
//                     </div>
//                     <Button variant="outline" size="sm" onClick={mobile}>
//                       <Edit className="h-4 w-4 mr-1" />
//                       Change
//                     </Button>
//                   </div>
//                 </div>
//               ) : (

//                 <div className="space-y-4">
//                   <Label htmlFor="mobile">mobile Address *</Label>
//                   <Input id="mobile" {...form.register("mobile")} placeholder="Enter mobile address" />
//                   {form.formState.errors.mobile && (
//                     <p className="text-sm text-destructive">{form.formState.errors.mobile.message}</p>
//                   )}
//                   <div className="flex justify-end gap-2">
//                     <Button type="button" variant="outline" onClick={mobileChange}>
//                       <X className="h-4 w-4 mr-1" /> Cancel
//                     </Button>
//                     <Button onClick={mobileChangeSave} disabled={mobileChangeMutation.isPending || showOtpDialog}>
//                       {mobileChangeMutation.isPending ? (
//                         <Loader2 className="h-4 w-4 animate-spin mr-1" />
//                       ) : (
//                         <Check className="h-4 w-4 mr-1" />
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               )
//           }

//           {/* Security Notice */}
//           <SecurityNotice
//             description=" Your mobile address is the main source of verification and is used for account recovery and important notifications."
//           />
//           {mobile &&
//             <OtpVerificationDialog
//               open={showOtpDialog}
//               onOpenChange={setShowOtpDialog}
//               mutateDataFn={() => mobileChangeMutation.mutate(undefined)}
//               otpPayload={{ type: otpType, value: otpType === "mobile-current" ? mobile : form.getValues("mobile") }}
//             />
//           }
//         </CardContent>
//       </Card>
//     </TooltipProvider>
//   )

// }
"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Loader2,
  Mail,
  Edit,
  Shield,
  X,
  Check,
  PlusCircle,
  Delete,
  DeleteIcon,
} from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TooltipProvider } from "@/components/ui/tooltip"
import { OtpDialogStateMobile, OtpVerificationDialog } from "@/components/otp-verification-dialog"
import { LoadingBox } from "@/components/loading-box"
import { ErrorBox } from "@/components/error-box"
import SecurityNotice from "@/components/security-notice"

// import { PhoneNumberInput } from "@/components/phone-number-input"

import {
  useUpdateUserPrivateData,
  useUserPrivateInfo,
} from "@/lib/queries/use-settings"
import { mobileSchema, mobileType } from "@/lib/validation/common-validation"
import { useNationQuery } from "@/lib/queries/use-nation-city"
import { PhoneNumberInput } from "@/components/phonenumberinput"
import { FullNationApiResponse, SecureUserMutation } from "@/utils/types"
import { Form } from "@/components/ui/form"
import { isAbsolute } from "path/posix"

/**
 * ──────────────────────────────────────────────────────────
 * Types & constants
 * ──────────────────────────────────────────────────────────
 */


/**
 * ──────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────
 */
export function PhoneManagement({ username }: { username: string }) {
  /**
   * Data fetching – secure user info
   */

  const [isEditing, setIsEditing] = useState(false)

  const {
    data: privateInfo,
    isPending: isUserInfoLoading,
    error: userInfoError,
    refetch: refetchUserInfo,
  } = useUserPrivateInfo(username, "secure-info")

  const currentMobile: mobileType | 'no-mobile' | undefined = privateInfo?.data?.mobile

  /**
   * Data fetching – country / calling codes
   */
  const {
    data: nationData,
    isPending: isNationLoading,
    isError: isNationError,
  } = useNationQuery()

  /**
   * Local state & form
   */
  // const [uiStep, setUiStep] = useState<
  //   | "view" // show current mobile / add button
  //   | "edit-new" // user entering a new number (either adding or changing)
  //   | "verify-current" // verify current mobile before editing
  // >(currentMobile ? "view" : "edit-new")

  const [showOtpDialog, setShowOtpDialog] = useState(false)
  const [otpType, setOtpType] = useState<OtpDialogStateMobile>("mobile-current")

  const form = useForm<mobileType>({
    resolver: zodResolver(mobileSchema),
    defaultValues: { countryCode: "", number: "" },
  })

  /** Sync form with current mobile (if present) */
  useEffect(() => {
    if (currentMobile && currentMobile !== 'no-mobile') {
      form.reset(currentMobile)
    } else {
      form.reset({ countryCode: "", number: "" })
    }
  }, [currentMobile, form])

  /**
   * Mutations
   */
  const mobileChangeMutation = useUpdateUserPrivateData<SecureUserMutation>(
    username,
    "secure-info",
  )

  /**
   * Handlers
   */
  const handleAddMobileClick = () => {
    // No current mobile → user can just type new number & verify once
    setOtpType('mobile-add')
    setIsEditing(true)

  }

  const handleSendOtpOldMobile = () => {
    setOtpType("mobile-current")
    setShowOtpDialog(true)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    if (currentMobile && currentMobile !== 'no-mobile') {
      form.reset(currentMobile)

    } else {
      form.reset({ countryCode: "", number: "" })
    }
    setIsEditing(false)
  }

  const handleMobileAddOrChangeSave = () => {
    if (otpType !== 'mobile-add') {
      setOtpType("mobile-update")
    }
    setShowOtpDialog(true)
    setIsEditing(false)
  }


  const handelDeleteMobile = () => {
    setOtpType("mobile-delete")
    setShowOtpDialog(true)
  }
  /**
   * Render branches
   */
  const renderViewMode = () => {
    if (currentMobile === 'no-mobile') {
      return (
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            You don't have a mobile number linked to your account.
          </p>
          <Button onClick={handleAddMobileClick}>
            <PlusCircle className="h-4 w-4 mr-1" /> Add mobile number
          </Button>
        </div>
      )
    }
    else if (currentMobile)
      return (
        <div className="space-y-4">
          <div className="p-4 border rounded-lg flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {currentMobile.countryCode} {currentMobile.number}
                </span>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Verified
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Primary mobile number</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSendOtpOldMobile}>
                <Edit className="h-4 w-4 mr-1" /> Change
              </Button>
              <Button variant="default" size="sm" onClick={handelDeleteMobile}>
                <DeleteIcon className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        </div >
      )
  }

  const renderEditMode = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleMobileAddOrChangeSave)} className="space-y-4">
        {/* Phone number composite input */}
        <PhoneNumberInput
          nationData={nationData?.data?.nations as FullNationApiResponse[]}
          nameNation="number"
          nameCountryCode="countryCode"
          isLoading={isNationLoading}
          isError={isNationError}
          form={form}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={cancelEdit}>
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
          <Button type="submit" disabled={mobileChangeMutation.isPending}>
            {mobileChangeMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <Check className="h-4 w-4 mr-1" />
            )}
            {otpType === 'mobile-add' ? "Add" : "Update"}
          </Button>
        </div>
      </form>
    </Form>
  )

  /**
   * Content renderer – handles loading / error / main flow
   */
  const renderContent = () => {
    if (isUserInfoLoading)
      return <LoadingBox title="Loading mobile info" message="Fetching your mobile number…" />

    if (userInfoError || !currentMobile)
      return (
        <ErrorBox
          title="Failed to load"
          message={userInfoError?.message ?? "We couldn't find your account phone info."}
          onRetry={refetchUserInfo}
        />
      )


    if (!isEditing) return renderViewMode()
    return renderEditMode()
  }

  /**
   * JSX
   */
  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" /> Mobile Number
          </CardTitle>
          <CardDescription>
            Manage your mobile number and change it securely.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderContent()}

          <SecurityNotice description="Your mobile number is optional but if added it can be used for account recovery." />

          {/* OTP dialog – shown in verify steps */}

          <OtpVerificationDialog
            open={showOtpDialog}
            onOpenChange={setShowOtpDialog}
            mutateDataFn={(type) => mobileChangeMutation.mutate({ type: type as any })}
            otpPayload={{
              type: otpType,
              value:
                (otpType === "mobile-current" || otpType === "mobile-delete") && currentMobile && currentMobile !== 'no-mobile'
                  ? currentMobile
                  : { countryCode: form.getValues('countryCode'), number: form.getValues('number') }
              ,
            }}
          />

        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
2