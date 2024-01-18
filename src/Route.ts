import { JSX, children, mergeProps } from "solid-js";

export interface RouteObject {
  path: string;
  children?: RouteObject[];
  component?: () => JSX.Element;
  components?: Record<string, () =>JSX.Element>;
}

export type RouteWithMergedComponents = (RouteObject & { mergedComponents: Record<string, () => JSX.Element> })
export type RouteWithoutChildren = Omit<RouteObject, "children">;


export const Route = (props: Omit<RouteObject, "children"> & {children?: JSX.Element}) => {
  const childRoutes = children(() => props.children).toArray;

  return mergeProps(props, {
    get children() {
      return childRoutes()
    }
  }) as unknown as JSX.Element
}