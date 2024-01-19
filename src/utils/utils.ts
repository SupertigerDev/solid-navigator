import { Accessor } from 'solid-js'
import { createMatcher } from './matcher'
import { RouteWithoutChildren } from 'src/Route'

export const isValidPath = (routes: Accessor<RouteWithoutChildren[]>, pathname: string) => {
  return routes().find(route => {
    const matcher = createMatcher(route.path)
    return matcher(pathname)
  })
}

export const getHashAndSearch = () => location.hash + location.search

// Code is borrowed from @solidjs/router
export function expandOptionals(pattern: string): string[] {
  let match = /(\/?\:[^\/]+)\?/.exec(pattern)
  if (!match) return [pattern]

  let prefix = pattern.slice(0, match.index)
  let suffix = pattern.slice(match.index + match[0].length)
  const prefixes: string[] = [prefix, (prefix += match[1])]

  // This section handles adjacent optional params. We don't actually want all permuations since
  // that will lead to equivalent routes which have the same number of params. For example
  // `/:a?/:b?/:c`? only has the unique expansion: `/`, `/:a`, `/:a/:b`, `/:a/:b/:c` and we can
  // discard `/:b`, `/:c`, `/:b/:c` by building them up in order and not recursing. This also helps
  // ensure predictability where earlier params have precidence.
  while ((match = /^(\/\:[^\/]+)\?/.exec(suffix))) {
    prefixes.push((prefix += match[1]))
    suffix = suffix.slice(match[0].length)
  }

  return expandOptionals(suffix).reduce<string[]>(
    (results, expansion) => [...results, ...prefixes.map(p => p + expansion)],
    [],
  )
}
