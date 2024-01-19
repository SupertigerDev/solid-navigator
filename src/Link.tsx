import { JSX, createMemo } from 'solid-js'
import { useRouterContext } from './Router'
import { createMatcher } from './utils/matcher'

type LinkProps = {
  replace?: boolean
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>

export const A = (props: LinkProps) => {
  return <a sn-link {...props} />
}


export const useMatch = (path: () => string) => {
  const context = useRouterContext()
  const matcher = createMemo(() => createMatcher(path()))
  return createMemo(() => matcher()(context.location.pathname))
}