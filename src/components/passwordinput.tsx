"use client"

import type React from "react"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/utils/basic-utils"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { UseFormReturn } from "react-hook-form"
import { format } from "path"

interface PasswordInputProps {
  form: UseFormReturn<any>
  label?: string
  placeholder?: string
  className?: string
  name: string
  id?: string
}

export function PasswordInput({ form, placeholder, label, className, name, id }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label ?? "Password *"}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  id={id}
                  type={showPassword ? "text" : "password"}
                  placeholder={placeholder ?? "Password"}
                  className={className ?? "pr-1"}
                  {...field}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    </div>
  )
}