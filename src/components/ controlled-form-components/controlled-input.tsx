"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { ControllerRenderProps, UseFormReturn } from "react-hook-form"

interface ControlledInputProps {
  form: UseFormReturn<any>
  name: string
  id: string
  label: string
  disabled?: boolean
  placeholder?: string
  classNameInput: string
}

export const ControlledInput = ({
  form,
  name,
  id,
  label,
  disabled,
  placeholder,
  classNameInput
}: ControlledInputProps) => {
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <Label>{label}</Label>
            <FormControl>
              <Input {...field} id={id} disabled={disabled} placeholder={placeholder} className={classNameInput} />
            </FormControl>
            <FormMessage className="text-red-400" />
          </FormItem>
        )}
      />
    </div>
  )
}
