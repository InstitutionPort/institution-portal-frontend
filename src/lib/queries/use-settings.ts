import { useQueryClient } from "@tanstack/react-query"
import { useMutationCustom } from "./use-muation-custom"
import { useQueryCustom } from "./use-query-custom"
import { passwordChangeSchemaType } from "../validation/settings-validation"






// Fetch user public data
export function useUserPublicData(username: string) {
  return useQueryCustom({
    apiRoute: `/api/user/${username}`,
    key: ["user-public", username],
    httpOnlyCookie: false,
    enabled: !!username,
  });
}

export function useUserPrivateInfo(username: string, endpoint: string) {
  const queryKey = `user-private-${endpoint}`
  return useQueryCustom({
    apiRoute: `/api/settings/${endpoint}`,
    key: [queryKey, username],
    httpOnlyCookie: true,
    enabled: !!username,
    extraOptions: { staleTime: 1000 * 60 * 10 }, // 10 minutes
  })
}
// Update user settings
export function useUpdateUserPrivateData<TInput>(username: string, endpoint: string) {
  const queryClient = useQueryClient()
  const key = [`user-private-${endpoint}`, username]
  return useMutationCustom<TInput>({
    apiRoute: `/api/settings/${endpoint}`,
    key: key,
    method: "PATCH",
    httpOnlyCookie: true,
    errorFallbackMsg: "Failed to update.",
    successFallbackMsg: "Updated successfully.",
    onSuccessSideEffect: async () => {
      // await queryClient.invalidateQueries({ queryKey: ["me"] }) //this will not refect if staletime is big or reconnectonmount or ....
      await queryClient.refetchQueries({ queryKey: ["me"], exact: true });
      await queryClient.invalidateQueries({ queryKey: key }) //this will refect cuz not much is defined
      await queryClient.invalidateQueries({ queryKey: ['/api/settings/activity-info'] })
    },
    onMutateCustom: async (payload: TInput) => {
      const previousData = queryClient.getQueryData(key)
      await queryClient.cancelQueries({ queryKey: key })
      // Optimistically update
      if (endpoint === 'basic-info') {
        (payload as any).updatedAt = new Date()
      }
      queryClient.setQueryData(key, (old: any) => ({
        ...old,
        data: {
          ...old.data,
          ...payload,
        },
      }))
      return previousData //context
    },
    onErrorSideEffect: (err, vars, context) => {
      if (context)
        queryClient.setQueryData(key, context)
      else //we messed up so
        queryClient.invalidateQueries({ queryKey: key })
    }


  })
}


export function useUpdateUserPassword(username: string) {
  const queryClient = useQueryClient()
  const apiPath = '/api/settings/change-password'
  return useMutationCustom<passwordChangeSchemaType>({
    apiRoute: apiPath,
    key: [apiPath, username],
    method: "PATCH",
    httpOnlyCookie: true,
    errorFallbackMsg: "Failed to update user's password.",
    successFallbackMsg: "Password update failed.",
    onSuccessSideEffect: async () => {
      await queryClient.invalidateQueries({ queryKey: ['/api/settings/activity-info', username] })
    }
  })
}

export function useGetUserBackup() {
  const apiPath = '/api/settings/account-backup'
  return useMutationCustom<undefined>({
    apiRoute: apiPath,
    key: [apiPath],
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: "Failed to get user's backup.",
    successFallbackMsg: "Got user's backup successfully."
  })
}




// // Update password/email/phone
// export function useUpdateUserSensitiveData<TInput>(username: string) {
//   return useMutationCustom<TInput>({
//     apiRoute: `/api/user/${username}/change-secure`,
//     method: "POST",
//     httpOnlyCookie: true,
//     errorFallbackMsg: "Failed to update the info.",
//     successFallbackMsg: "User's info updated successfully.",
//   });
// }

