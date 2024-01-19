import { Component, JSX, children, createMemo, mergeProps } from 'solid-js'
import { useRouterContext } from './Router'

export interface RouteObject {
  path: string
  children?: RouteObject[]
  component?: () => JSX.Element
  components?: Record<string, () => JSX.Element | undefined>
}

export type RouteWithMergedComponents = RouteObject & {
  mergedComponents: Record<string, () => JSX.Element>
}
export type RouteWithoutChildren = Omit<RouteObject, 'children'>

export const Route = (props: Omit<RouteObject, 'children'> & { children?: JSX.Element }) => {
  const childRoutes = children(() => props.children).toArray

  return mergeProps(props, {
    get children() {
      return childRoutes()
    },
  }) as unknown as JSX.Element
}


export const matchComponent = (name: () => string) => {
  const context = useRouterContext()
  const matched = () => context.matched()

  const component = createMemo(() => {
    const components = context.matched()?.route.components || context.matched()?.route.mergedComponents || {}
    return components[name()]
  })

  return createMemo(() => {
    return component()()
  }) as Component
}
