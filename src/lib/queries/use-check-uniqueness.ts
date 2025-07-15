import { useMutation } from "@tanstack/react-query";
import { useQueryCustom } from "./use-query-custom";
import { usernameType } from "../validation/common-validation";


type CheckUniqueness = {
  username?: usernameType
  mobile?: string
}

// Check uniqueness
export function useCheckUniqueness(params: CheckUniqueness) {
  return useQueryCustom({
    apiRoute: `/api/check-uniqueness?${new URLSearchParams(params).toString()}`,
    key: ["check-uniqueness", params],
    httpOnlyCookie: false,
    enabled: !!(params.username || params.mobile)
  });
}