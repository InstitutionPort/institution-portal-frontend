import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { checkMe } from "./use-checkme";
import { toast } from "sonner";
import { useState } from "react";
import { ExploreFilters } from "@/app/explore/explore-content";
import { apiResponseHandler, handleApiError } from "@/utils/basic-utils";
import { SUCCESS_API_RESPONSE, SUCCESS_RESPONSE } from "@/utils/types";
import { useMutationCustom } from "./use-muation-custom";

export type FollowingCredentials = {
  followId: string,
  follow: boolean,
  key: [string, any]
}
type FollowMutationError = {
  err: any,
  vars: FollowingCredentials
  context: any
}


export const useFollow = (method: "POST" | "DELETE") => {
  const queryClient = useQueryClient()
  const apiPath = 'api/follow'
  return useMutationCustom<FollowingCredentials>({
    apiRoute: apiPath,
    key: [apiPath, method],
    method: method,
    httpOnlyCookie: true,
    errorFallbackMsg: 'Action Failed.',
    successFallbackMsg: 'Action Successful.',
    onMutateCustom: async (credential: FollowingCredentials) => await beforeFollowMutation(credential, queryClient),
    onErrorSideEffect: (err, vars, context) => handelFollowError({ err, vars, context }, queryClient),
    extraOptions: { retry: false }
  })
}






async function beforeFollowMutation(credential: FollowingCredentials, queryClient: ReturnType<typeof useQueryClient>) {
  await queryClient.cancelQueries({ queryKey: credential.key })
  const previousData = queryClient.getQueryData(credential.key)
  // Optimistically update
  queryClient.setQueryData(credential.key, (old: any) => ({
    ...old,
    data: {
      ...old.data,
      ...(
        credential.key[0] === "explore" ?
          {
            results: old.data.results.map((item: any) =>
              item.id === credential.followId ? { ...item, isFollowing: credential.follow } : item
            )
          } : credential.key[1] === "institute" ? {
            topInstitutes: old.data.topInstitutes.map((item: any) =>
              item.id === credential.followId ? { ...item, isFollowing: credential.follow } : item
            )
          } : credential.key[1] === "course" ? {
            topCourses: old.data.topCourses.map((item: any) =>
              item.id === credential.followId ? { ...item, isFollowing: credential.follow } : item
            )
          } : credential.key[1] === "form" ? {
            recentForms: old.data.recentForms.map((item: any) =>
              item.id === credential.followId ? { ...item, isFollowing: credential.follow } : item
            )
          } : {}
      ),
    },
  }))
  return previousData   //we returned this so we can turn back to this data if there is error in mutation
}


function handelFollowError(data: FollowMutationError, queryClient: ReturnType<typeof useQueryClient>) {
  //reverting the optimistic update
  if (data.context)
    queryClient.setQueryData(data.vars.key, data.context)
  //we messed up so lets invalidate this // fallback
  else

    queryClient.invalidateQueries({ queryKey: data.vars.key })
}

