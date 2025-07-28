import { ExploreFilters, ExploreMode, ExploreResponse } from "@/app/explore/explore-content"
import { apiResponseHandler, setQueryParams } from "@/utils/basic-utils"
import { useQuery } from "@tanstack/react-query"
import { SUCCESS_RESPONSE } from "@/utils/types";
import { useQueryCustom } from "../use-query-custom";



export function useDashboardQuery(route: string, username?: string) {
  return useQueryCustom({
    apiRoute: route,
    key: [route, username],
    httpOnlyCookie: true,
    enabled: !!username,
    extraOptions: { placeholderData: (previousData) => previousData, }
  });
}

