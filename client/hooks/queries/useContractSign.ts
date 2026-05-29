import { initContractSign, completeContractSign } from "@/services/contract.service";
import { useMutation } from "@tanstack/react-query";

export function useContractSign() {
  return useMutation({
    mutationFn: initContractSign,
  });
}

export function useContractComplete() {
  return useMutation({
    mutationFn: completeContractSign,
  });
}
