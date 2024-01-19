import {
  Accessor,
  JSX,
  Setter,
  children,
  createContext,
  createMemo,
  createSignal,
  onCleanup,
  onMount,
  useContext,
} from 'solid-js'
import { RouteObject, RouteWithMergedComponents, RouteWithoutChildren } from './Route'
import { createStore, reconcile } from 'solid-js/store'
import { PathMatch, createMatcher } from './utils/matcher'
import { createLocation } from './createLocation'
import { NavigateOptions, createNavigate } from './navigator'
import { getHashAndSearch } from './utils/utils'

export interface RouterProps {
  children?: JSX.Element
  root?: () => JSX.Element
}

export interface RouterContext {
  routes: () => RouteWithoutChildren[]
  navigate: (path: string, options?: NavigateOptions) => void
  params: Record<string, string>
  location: ReturnType<typeof createLocation>

  setPathname: Setter<string>
  setHashAndSearch: Setter<string>

  matched: Accessor<
    | {
        match: PathMatch
        route: RouteWithMergedComponents
      }
    | undefined
  >
}

export const RouterContext = createContext<RouterContext>()

export function Router(props: RouterProps) {
  const childRoutes = children(() => props.children).toArray as unknown as () => RouteObject[]

  const routes = createMemo(() => flattenedRoutes(childRoutes()))

  if (!props.children) {
    throw new Error('Router: No children provided.')
  }

  const [pathname, setPathname] = createSignal(location.pathname)
  const [hashAndSearch, setHashAndSearch] = createSignal(getHashAndSearch())

  const [params, setParams] = createStore({})

  const pathnameWithHashAndSearch = createMemo(() => pathname() + hashAndSearch())

  const loc = createLocation(pathnameWithHashAndSearch)

  const matched = createMemo(() => {
    if (!routes()) return
    let pathMatch: PathMatch | null = null
    let matchedRoute: RouteWithMergedComponents | undefined

    for (const route of routes()) {
      const matcher = createMatcher(route.path)
      const match = matcher(pathname())
      if (match) {
        pathMatch = match
        matchedRoute = route
        break
      }
    }

    setParams(reconcile(pathMatch?.params || {}))

    if (!matchedRoute || !pathMatch) {
      return undefined
    }
    return { match: pathMatch, route: matchedRoute }
  })

  const navigate = createNavigate(routes, pathname, setPathname, setHashAndSearch)

  const onPopState = (_event: PopStateEvent) => {
    setPathname(location.pathname)
    setHashAndSearch(getHashAndSearch())
  }

  const onClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (target.tagName !== 'A') return
    if (!target.hasAttribute('sn-link')) return
    event.preventDefault()
    const href = target.getAttribute('href') || ''
    navigate(href, {
      replace: target.hasAttribute('replace'),
    })
  }

  onMount(() => {
    window.addEventListener('popstate', onPopState)
    document.addEventListener('click', onClick)
    onCleanup(() => {
      window.removeEventListener('popstate', onPopState)
      document.removeEventListener('click', onClick)
    })
  })

  return (
    <RouterContext.Provider
      value={{ routes, matched, navigate, params, location: loc, setHashAndSearch, setPathname }}
    >
      {props.root?.()}
    </RouterContext.Provider>
  )
}

export const useRouterContext = () => {
  const context = useContext(RouterContext)
  if (!context) {
    throw new Error('Router: cannot find a RouterContext')
  }
  return context
}

export function useParams<T = Record<string, string>>() {
  const context = useRouterContext()
  return context.params as T
}

export const useLocation = () => useRouterContext().location

const flattenedRoutes = (routes: RouteObject[]) => {
  return routes.map(route => flattenedRoute(route)).flat()
}

const flattenedRoute = (route: RouteWithMergedComponents | RouteObject) => {
  const routes: RouteWithMergedComponents[] = []
  const components = route.components || {}

  let lastComponent: undefined | (() => JSX.Element) = undefined

  if (route.component) {
    lastComponent = route.component
  }

  routes.push({
    ...route,
    components: { ...components },
    mergedComponents: components,
    component: route.component || lastComponent,
  })

  if (!route.children) return routes

  for (let i = 0; i < route.children.length; i++) {
    const child = route.children[i]
    if (!child) continue

    if (child.components) {
      Object.assign(components, child.components)
    }

    if (child.component) {
      lastComponent = child.component
    }

    if (!child.path.startsWith('/')) {
      if (!child.component) {
        throw new Error('Route: No component for ' + child.path)
      }
      components[child.path] = child.component
      continue
    }

    routes.push(
      ...flattenedRoute({
        ...child,
        path: route.path + child.path,
        components: { ...components },
        mergedComponents: components,
        component: child.component || lastComponent,
      }),
    )
  }

  return routes
}
