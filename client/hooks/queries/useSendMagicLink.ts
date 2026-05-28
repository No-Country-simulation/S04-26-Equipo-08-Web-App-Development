import { sendMagicLink } from "@/services/invitation.service";
import { useMutation } from "@tanstack/react-query";

export function useSendMagicLink() {
  return useMutation({
    mutationFn: sendMagicLink,
  });
}
