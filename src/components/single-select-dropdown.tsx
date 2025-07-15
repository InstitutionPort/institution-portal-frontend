"use client"

import { useState } from "react"
import { Ban, Check, ChevronDown, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import { UseFormReturn } from "react-hook-form"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { cn } from "@/utils/basic-utils"

type FormProps = {
  name: string
  formEle: UseFormReturn<any>
}

interface SingleSelectDropdownProps {
  label: string
  value?: string
  id?: string
  form?: FormProps
  classNameInput?: string
  options: string[]
  loading: boolean
  error: boolean
  onChange: (value: string | undefined) => void
  placeholder: string
  disabled?: boolean
  //for search based fetching
  addFetchOnSearch?: boolean
  onSearch?: (query: string) => void
}

export default function SingleSelectDropdown({
  label,
  value,
  classNameInput,
  id,
  form,
  options,
  loading,
  error,
  onChange,
  placeholder,
  disabled = false,
  addFetchOnSearch,
  onSearch
}: SingleSelectDropdownProps) {
  const [open, setOpen] = useState(false)

  const renderDropdown = (selectedValue: string | undefined, setValue: (v: string | undefined) => void) => (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} className="cursor-pointer" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          id={id}
          className={cn('w-full justify-between text-left', classNameInput)}
        >
          <span className="truncate">
            {selectedValue || <span className="text-muted-foreground">{placeholder}</span>}
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${label.toLowerCase().replace(/\s*\*$/, "")}...`}
            // value={searchTerm}
            onValueChange={(val) => {
              if (addFetchOnSearch && onSearch) onSearch(val)
            }}
            disabled={error} />
          <CommandList>
            {loading ? (
              <div className="flex items-center justify-center py-5 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-3 animate-spin mr-2" />
                Loading...
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-5 text-sm text-muted-foreground">
                <Ban className="w-4 h-3 mr-2" />
                Error
              </div>
            ) : (
              <>
                <CommandEmpty>No {label.toLowerCase().replace(/\s*\*$/, "")} found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {options && options.map((data) => (
                    <CommandItem
                      className="cursor-pointer"
                      value={data}
                      key={data}
                      onSelect={() => {
                        const newVal = data === selectedValue ? undefined : data
                        setValue(newVal)
                        setOpen(false)
                      }}
                    >
                      <Check className={cn("mr-2 h-4 w-4", selectedValue === data ? "opacity-100" : "opacity-0")} />
                      {data}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )

  // Form Mode
  if (form) {
    return (
      <div className="space-y-2">
        <FormField
          control={form.formEle.control}
          name={form.name}
          render={({ field }) => (
            <FormItem>
              <Label>{label}</Label>
              <FormControl>
                {renderDropdown(field.value, (v) => {
                  field.onChange(v)
                  onChange(v)
                })}
              </FormControl>
              <FormMessage className="text-red-400" />
            </FormItem>
          )}
        />
      </div>
    )
  }

  // Non-form mode
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {renderDropdown(value, onChange)}
    </div>
  )
}
