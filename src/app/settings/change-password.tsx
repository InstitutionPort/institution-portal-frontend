"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Loader2, Lock, Check, KeyRound } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"
import Link from "next/link"
import { useUpdateUserPassword } from "@/lib/queries/use-settings"
import { passwordChangeSchema, passwordChangeSchemaType } from "@/lib/validation/settings-validation"
import { PasswordInput } from "@/components/passwordinput"
import { Form } from "@/components/ui/form"



export function ChangePasswordSettings({ username }: { username: string }) {
  const [isEditing, setIsEditing] = useState(false)

  const updateUserPasswordMutation = useUpdateUserPassword(username)

  const form = useForm<passwordChangeSchemaType>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  })

  const handlePasswordSubmit = (data: passwordChangeSchemaType) => {

    updateUserPasswordMutation.mutate(data)
    form.reset()
    setIsEditing(false)
  }

  const handleCancel = () => {
    form.reset()
    setIsEditing(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Password Management
        </CardTitle>
        <CardDescription>Change your account password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" value="••••••••••••" disabled className="bg-muted" />
            </div>

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-sm text-primary hover:underline flex items-center gap-1">
                <KeyRound className="h-4 w-4" />
                Forgot Password?
              </Link>

              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                Change Password
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form} >
            <form onSubmit={form.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <PasswordInput
                form={form}
                placeholder="Enter your current password"
                label="Current Password *"
                name="currentPassword"
                id="currentPassword"
              />
              <PasswordInput
                form={form}
                placeholder="Enter new password"
                label="New Password *"
                name="newPassword"
                id="newPassword"
              />

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updateUserPasswordMutation.isPending}
                  className="flex items-center gap-2"
                >
                  {updateUserPasswordMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="h-4 w-4" />
                  )}
                  Update Password
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  )
}
