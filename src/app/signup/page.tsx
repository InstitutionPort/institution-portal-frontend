"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { AlertCircle, Building2, Eye, EyeOff, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/utils/basic-utils"
import { PhoneNumberInput } from "@/components/phonenumberinput"
import { SignUpFormType, signUpSchema } from "@/lib/validation/auth-validation"
import Link from "next/link"
import { useSignUpMutation } from "@/lib/queries/use-signup"
import { useNationQuery } from "@/lib/queries/use-nation-city"
import { FullNationApiResponse } from "@/utils/types"
import { PasswordInput } from "@/components/passwordinput"
import SelectLocation from "@/components/select-location"


export default function SignUpPage() {
  const signUpMutation = useSignUpMutation();

  const signupForm = useForm<SignUpFormType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      username: "",
      nation: "",
      city: "",
      email: "",
      password: ""
    },
  })

  function onSubmit(values: SignUpFormType) {
    signUpMutation.mutate(values);
  }


  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-12">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-8 w- mr-2" />
            <h1 className="text-2xl font-bold">Institution Port</h1>
          </div>
          <CardTitle className="text-lg">Create Your Account</CardTitle>
          <CardDescription>
            Join Institution Port and start your journey with us
          </CardDescription>
        </CardHeader>
        <CardContent>


          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="middleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Middle Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Michael"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Username */}
              <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe123"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              {/* Username */}
              <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />


              {/* Country */}
              <SelectLocation
                form={{ nationName: 'nation', cityName: 'city', formEle: signupForm }}
                nationLabel="Nation *"
                cityLabel="City *"
              />

              {/* Password Field */}
              <PasswordInput form={signupForm} name="password" />

              <Button type="submit" className="w-full" disabled={signUpMutation.isPending}>
                {signUpMutation.isPending ? "Creating Account..." : "Create Account"}
              </Button>
              {signUpMutation.error && (
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="pt-1">{signUpMutation.error.message}</AlertDescription>
                </Alert>
              )}
            </form>
          </Form>

          <div className="mt-6 text-center text-xs">
            Already have an account?{" "}
            <Link href="/login" className="hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
