"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Eye, Loader2, Mail, Phone } from "lucide-react"
import {
  InputOTP, InputOTPGroup, InputOTPSlot
} from "@/components/ui/input-otp"
import { useMutationCustom } from "@/lib/queries/use-muation-custom"
import { emailType, mobileType } from "@/lib/validation/common-validation"

export type OtpDialogStateMobile = "mobile-current" | "mobile-update" | "mobile-delete" | "mobile-add"
export type OtpDialogStateEmail = "email-current" | "email-update"

type EmailOtpSend = { type: OtpDialogStateEmail; value: emailType }
type MobileOtpSend = { type: OtpDialogStateMobile; value: mobileType }
type PasswordOtpSend = {
  type: "password-email" | "password-mobile"
  value: emailType | mobileType
}
type OtpPayload = EmailOtpSend | MobileOtpSend | PasswordOtpSend

interface OtpVerificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  otpPayload: OtpPayload
  mutateDataFn: (type: OtpPayload["type"]) => void
  title?: string
  description?: string
}


export function OtpVerificationDialog({
  open,
  onOpenChange,
  mutateDataFn,
  otpPayload,
  title,
  description,
}: OtpVerificationDialogProps) {
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"send" | "verify">("send")

  const sendOtpMutation = useMutationCustom<EmailOtpSend | MobileOtpSend | PasswordOtpSend>({
    apiRoute: "/api/otp/send",
    key: ["/otp/send"],
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: "Failed to send the otp.",
    successFallbackMsg: "Otp has been sent.",
    onSuccessSideEffect: () => {
      setStep("verify")
    },
  })
  const verifyOtpMutation = useMutationCustom({
    apiRoute: "/api/otp/verify",
    key: ["/otp/verify"],
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: "Otp verification failed.",
    successFallbackMsg: "Otp verified successfully.",
    onSuccessSideEffect: () => {
      if (otpPayload.type !== 'email-current' && otpPayload.type !== 'mobile-current') {
        mutateDataFn(otpPayload.type)
      }
      handleClose()
    },
  })

  const handleClose = () => {
    onOpenChange(false)
    setStep("send")
    setOtp("")
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // stop page refresh
    if (step === "send") {
      sendOtpMutation.mutate(otpPayload)
    } else {
      verifyOtpMutation.mutate({ otp, ...otpPayload })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon(otpPayload)}
            {getTitle(otpPayload, title)}
          </DialogTitle>
          <DialogDescription>
            {step === "send"
              ? getDescription(otpPayload, description)
              : "Enter the 6‑digit code we sent to you."}
          </DialogDescription>
        </DialogHeader>

        {/* Body */}
        {step === "send" ? (
          <p className="py-4 text-sm text-muted-foreground">
            Click the button below to receive your verification code.
          </p>
        ) : (
          <div className="py-4 space-y-4">
            <Label htmlFor="otp">Verification Code</Label>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot key={i} index={i} />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        )}

        {/* Footer: ONE form, so Enter submits */}
        <form onSubmit={handleSubmit}>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={handleClose}>
              Cancel
            </Button>

            {step === "send" ? (
              <Button
                type="submit"
                disabled={sendOtpMutation.isPending}
              >
                {sendOtpMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send Code
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={verifyOtpMutation.isPending || otp.length !== 6}
              >
                {verifyOtpMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Verify
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* ——— tiny helpers you already had ——— */
const getIcon = (p: OtpPayload) =>
  p.type.includes("email") ? (
    <Mail className="h-4 w-4" />
  ) : p.type.includes("mobile") ? (
    <Phone className="h-4 w-4" />
  ) : (
    <Eye className="h-4 w-4" />
  )

const getTitle = (p: OtpPayload, custom?: string) => {
  if (custom) return custom
  switch (p.type) {
    case "email-update":
      return "Verify New Email"
    case "email-current":
      return "Verify Current Email"
    case "mobile-current":
      return "Verify Current Mobile Number"
    case "mobile-update":
      return "Verify New Mobile Number"
    case "mobile-delete":
      return "Verify The Mobile Number"
    case "mobile-add":
      return "Verify New Email"
    case "password-mobile":
      return "Verify Mobile Number"
    case "password-email":
      return "Verify Email"
  }
}

const getDescription = (p: OtpPayload, custom?: string) => {
  if (custom) return custom
  if (p.type.includes("email"))
    return `We'll send a verification code to email: ${p.value}`
  if (p.type.includes("mobile")) {

    return `We'll send a verification code to mobile: ${(p.value as mobileType).countryCode} ${(p.value as mobileType).number}`
  }
  return `We'll send a verification code to ${p.value ?? "the specified service."}`
}
