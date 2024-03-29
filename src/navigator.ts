import { Accessor, Setter, batch } from 'solid-js'
import { useRouterContext } from './Router'
import { getHashAndSearch, isValidPath } from './utils/utils'
import { RouteWithoutChildren } from './Route'
import { reconcile } from 'solid-js/store'

export interface NavigateOptions {
  replace?: boolean
  state?: any
}

export const createNavigate = (
  routes: Accessor<RouteWithoutChildren[]>,
  pathname: Accessor<string>,
  setPathname: Setter<string>,
  setHashAndSearch: Setter<string>,
) => {
  return (path: string, options?: NavigateOptions) => {
    let newPath = path
    let currentPathname = pathname()

    if (currentPathname.endsWith('/')) {
      currentPathname = currentPathname.slice(0, -1)
    }

    if (newPath.startsWith('./')) {
      newPath = currentPathname + '/' + newPath.slice(2)
    }

    if (newPath.startsWith('../')) {
      newPath = currentPathname + '/' + newPath
    }

    if (options?.replace) {
      history.replaceState(options.state || null, '', newPath)
    } else {
      history.pushState(options?.state || null, '', newPath)
    }

    if (!isValidPath(routes, location.pathname)) {
      console.warn('Invalid path: ' + path)
    }

    batch(() => {
      setPathname(location.pathname)
      setHashAndSearch(getHashAndSearch())
    })
  }
}

export const useNavigate = () => {
  const context = useRouterContext()
  return context.navigate
}

export const Navigate = (props: { href: string }) => {
  const navigate = useNavigate()
  navigate(props.href, { replace: true })
  return null
}

export function useSearchParams<T = Record<string, string>>() {
  const context = useRouterContext()
  const navigate = useNavigate()

  const updateQuery = (query: Record<string, string>, options?: NavigateOptions) => {
    context.setQuery(reconcile(query))
    const url = new URL(window.location.href)
    const newSearch = new URLSearchParams(context.query)
    url.search = newSearch.toString()
    navigate(url.pathname + url.search + url.hash, options)
  }

  return [
    context.location.query as T,
    updateQuery as (query: T, options?: NavigateOptions) => void,
  ] as const
}
