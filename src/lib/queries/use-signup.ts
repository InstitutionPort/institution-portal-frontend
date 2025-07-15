'use client'

import { apiResponseHandler, handleApiError } from "@/utils/basic-utils";
import { SUCCESS_RESPONSE } from "@/utils/types";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { useMutationCustom } from "./use-muation-custom";
import { SignUpFormType } from "../validation/auth-validation";




export function useSignUpMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutationCustom<SignUpFormType>({
    apiRoute: '/api/signup',
    key: ['api/signup'],
    method: "POST",
    httpOnlyCookie: true,
    errorFallbackMsg: 'SignUp Failed.',
    successFallbackMsg: "Signed Up Successfully.",
    onSuccessSideEffect: async () => {
      await queryClient.refetchQueries({ queryKey: ["me"], exact: true });
      router.push('/dashboard');
    }
  });
}