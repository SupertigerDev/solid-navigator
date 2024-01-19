import { Accessor, Setter } from 'solid-js';
import { useRouterContext } from './Router'
import { getHashAndSearch, isValidPath } from './utils/utils';
import { RouteWithoutChildren } from './Route';

export interface NavigateOptions {
  replace?: boolean
}

export const createNavigate = (routes: Accessor<RouteWithoutChildren[]>, pathname: Accessor<string>, setPathname: Setter<string>, setHashAndSearch: Setter<string>) => {
  return (path: string, options?: NavigateOptions) => {
    let newPath = path
    let currentPathname = pathname();

    if (currentPathname.endsWith('/')) {
      currentPathname = currentPathname.slice(0, -1)
    }

    if (newPath.startsWith('./')) {
      newPath = currentPathname + '/' + newPath.slice(2)
    }
    if (options?.replace) {
      history.replaceState({}, '', newPath)
    } else {
      history.pushState({}, '', newPath)
    }

    if (!isValidPath(routes, location.pathname)) {
      console.error('Invalid path: ' + path)
      return
    }
    setPathname(location.pathname)
    setHashAndSearch(getHashAndSearch())
  }
}

export const useNavigate = () => {
  const context = useRouterContext()
  return context.navigate
}
