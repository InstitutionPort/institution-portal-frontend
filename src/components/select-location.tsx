"use client"

import { useEffect, useState } from "react"
import { useCityQuery, useNationQuery } from "@/lib/queries/use-nation-city"
import SingleSelectDropdown from "@/components/single-select-dropdown"
import { UseFormReturn } from "react-hook-form"
import { useDebounce } from "@/utils/basic-utils"

type locationFormProps = {
  nationName: string
  cityName: string
  formEle: UseFormReturn<any>
}

type Nation = {
  name: string,
  code: string,
  flag: string
}

export type SelectLocationProps = {
  nation?: string
  city?: string
  nationLabel?: string
  cityLabel?: string
  onChange?: (field: "nation" | "city", value: string | undefined) => void
  disabled?: boolean
  form?: locationFormProps
}

export default function SelectLocation({
  nation,
  city,
  nationLabel,
  cityLabel,
  onChange,
  disabled = false,
  form
}: SelectLocationProps) {
  const [citySearchTerm, setCitySearchTerm] = useState("")
  const debouncedCitySearchTerm = useDebounce(citySearchTerm, 300)
  const { data: nationsRes, isLoading: nationIsPending, isError: nationIsError, isSuccess: nationIsSuccess } =
    useNationQuery()
  const nations = nationsRes?.data?.nations?.map((nation: Nation, _i: any) => nation.name)
  const { data: cities, isLoading: citiesIsPending, isError: citiesIsError, isSuccess: citiesIsSuccess } =
    useCityQuery(form ? form.formEle.watch(form.nationName) : nation, debouncedCitySearchTerm)

  const handleNationChange = (value: string | undefined) => {
    if (form) {
      form.formEle.setValue(form.nationName, value)
      form.formEle.setValue(form.cityName, undefined)
      setCitySearchTerm("")
    } else {
      onChange?.("nation", value)
      onChange?.("city", undefined)
      setCitySearchTerm("")

    }
  }

  const handleCityChange = (value: string | undefined) => {
    if (form) {
      form.formEle.setValue(form.cityName, value)
    } else {
      onChange?.("city", value)
    }
  }

  return (
    <>
      <SingleSelectDropdown
        label={nationLabel ?? "Nation"}
        form={form ? { name: form.nationName, formEle: form.formEle } : undefined}
        value={form ? form.formEle.watch(form.nationName) : nation}
        options={nations ?? []}
        loading={nationIsPending}
        error={nationIsError}
        onChange={handleNationChange}
        placeholder="Select nation"
        disabled={disabled}
      />

      <SingleSelectDropdown
        label={cityLabel ?? "City"}
        form={form ? { name: form.cityName, formEle: form.formEle } : undefined}
        value={form ? form.formEle.watch(form.cityName) : city}
        options={cities?.data?.cities ?? []}
        loading={citiesIsPending}
        error={citiesIsError}
        onChange={handleCityChange}
        placeholder="Select city"
        addFetchOnSearch={true}
        onSearch={(q) => setCitySearchTerm(q)}
        disabled={disabled
          || (!form && !nation)
          || (form && !form?.formEle.watch(form.nationName))
        }
      />
    </>
  )
}
