import { setQueryParams } from "@/utils/basic-utils"

import { useQueryCustom } from "./use-query-custom"
import { SUCCESS_API_RESPONSE, SUCCESS_RESPONSE } from "@/utils/types"
import { v4 } from "uuid"


export function useNationQuery() {
  return useQueryCustom({
    apiRoute: `/api/nations`,
    key: ["nations"],
    httpOnlyCookie: false,
    extraOptions: { meta: { persist: true } }
  });
}

export function useCityQuery(nation?: string | undefined, search?: string) {
  const params = setQueryParams({ nation, search })
  return useQueryCustom({
    key: ["cities", nation, search],
    apiRoute: `/api/city?${params.toString()}`,
    enabled: !!nation && (search?.length ?? 0) > 0, // only fetch if typing
  })
}
