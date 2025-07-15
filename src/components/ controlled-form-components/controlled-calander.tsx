
"use client"

import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { cn } from "@/utils/basic-utils"
import { UseFormReturn } from "react-hook-form"
import { Label } from "../ui/label"

interface ControlledCalendarProps {
  form: UseFormReturn<any>
  name: string
  label: string
  hidden: Record<any, any>
  disabled?: boolean
}

export function ControlledCalendar({
  form,
  name,
  label,
  hidden,
  disabled,
}: ControlledCalendarProps) {
  return (
    <div className="space-y-2">
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => {
          const date = field.value ? new Date(field.value) : undefined

          return (
            <FormItem>
              <Label>{label}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      disabled={disabled}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                        disabled && "bg-muted cursor-default"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    className="cursor-pointer"
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        field.onChange(format(selectedDate, "yyyy-MM-dd"))
                      }
                    }}
                    captionLayout="dropdown"
                    hidden={hidden as any}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>
              <FormMessage className="text-red-400" />
            </FormItem>
          )
        }}
      />
    </div>
  )
}
