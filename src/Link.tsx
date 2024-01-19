import { JSX, createMemo } from 'solid-js'
import { useLocation, useRouterContext } from './Router'
import { createMatcher } from './utils/matcher'
import { expandOptionals } from './utils/utils'

type LinkProps = {
  replace?: boolean
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>

export const A = (props: LinkProps) => {
  return <a sn-link {...props} />
}

export const useMatch = (path: () => string) => {
  const location = useLocation();
  
  const matchers = createMemo(() => {
    return expandOptionals(path()).map(path => createMatcher(path))
  })
  return createMemo(() => {
    for (let i = 0; i < matchers().length; i++) {
      const matcher = matchers()[i];
      const match = matcher(location.pathname);
      if (match) {
        return match;
      }
    }
  })
}
