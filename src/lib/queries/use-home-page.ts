import { useQueryCustom } from "./use-query-custom";

export function useHomePage(apiPath: string, username?: string) {
  return useQueryCustom({
    apiRoute: `/api/home-page/${apiPath}`,
    key: ["home-page", apiPath],
    httpOnlyCookie: true,
    extraOptions: {
      staleTime: 1000 * 60 * 5 //5min
    }
  })
}