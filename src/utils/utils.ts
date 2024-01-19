import { Accessor } from "solid-js"
import { createMatcher } from "./matcher"
import { RouteWithoutChildren } from "src/Route"

export const isValidPath = (routes: Accessor<RouteWithoutChildren[]>, pathname: string) => {
  return routes().find(route => {
    const matcher = createMatcher(route.path)
    return matcher(pathname)
  })
}

export const getHashAndSearch = () => location.hash + location.search
