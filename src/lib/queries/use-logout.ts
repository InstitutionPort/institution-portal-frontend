'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMutationCustom } from './use-muation-custom';


export function useLogoutMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutationCustom({
    key: ["/api/logout"],
    apiRoute: '/api/logout',
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: 'Logout Failed.',
    successFallbackMsg: "Logged out successfully.",
    onSuccessSideEffect: async () => {
      //sets the value to null, no need to call this me api
      queryClient.setQueryData(['me'], null);
    },
    onMutateCustom: () => {
      router.push('/login')
    },
    onErrorSideEffect: () => {
      router.push('/dashboard')
    }
  });
}