import { QueryProvider } from "./tanstackquery";

interface Props {
  children: React.ReactNode
}

export function Providers({
  children,
}: Props) {
  return (
    <QueryProvider>
          {children}
    </QueryProvider>
  )
}