import { useEffect } from "react"

const useAsyncEffect = (
  effect: () => Promise<void>,
  deps: React.DependencyList
) =>
  useEffect(() => {
    effect()
  }, deps)

export default useAsyncEffect
