"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Building2, Loader2, Eye, EyeOff, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useLoginMutation } from "@/lib/queries/use-login"
import { EmailLoginForm, emailLoginSchema, UsernameLoginForm, usernameLoginSchema } from "@/lib/validation/auth-validation"
import { PasswordInput } from "@/components/passwordinput"


export default function LoginPage() {
  const idLoginMutation = useLoginMutation()

  // Forms
  const usernameForm = useForm<UsernameLoginForm>({
    resolver: zodResolver(usernameLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const emailForm = useForm<EmailLoginForm>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })

  return (
    <div className="flex items-center justify-center p-4 md:p-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-8 w-8 mr-2" />
            <h1 className="text-2xl font-bold">Institution Port</h1>
          </div>
          <CardTitle className="text-xl ">Welcome Back</CardTitle>
          <CardDescription>Log in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="username" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="username"
              >
                Username
              </TabsTrigger>
              <TabsTrigger
                value="email"
              >
                Email
              </TabsTrigger>
            </TabsList>

            <TabsContent value="username" className="space-y-4 mt-6">
              <Form {...usernameForm}>
                <form onSubmit={usernameForm.handleSubmit((data) => idLoginMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={usernameForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your username"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <PasswordInput form={usernameForm} name="password"
                    label="Password" />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={idLoginMutation.isPending}
                  >
                    {idLoginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging In...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="email" className="space-y-4 mt-6">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit((data) => idLoginMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                  <PasswordInput
                    form={emailForm}
                    name="password"
                    label="Password" />
                  {/* continue */}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={idLoginMutation.isPending}
                  >
                    {idLoginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging In...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
          {/* mutation error */}
          {idLoginMutation.error && (
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="pt-1">{idLoginMutation.error.message ?? "Something went wrong, Retry."}</AlertDescription>
            </Alert>
          )}
          {/* signup and password forgot optoons */}
          <div className="mt-6">
            <Separator className="my-4" />
            <div className="text-center space-y-2 text-xs">
              <p >
                Don't have an account?{" "}
                <Link href="/signup" className="hover:underline font-medium">
                  Sign Up
                </Link>
              </p>
              <button className=" hover:underline">Forgot password?</button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}