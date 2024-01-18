import { createMemo } from "solid-js";
import { useRouterContext } from "./Router";

const Fragment = () => <></>


export const Outlet = (props: { children?: string, name?: string; }) => {
  const context = useRouterContext();

  const matched = () => context.matched();

  const getName = () => props.name || props.children;

  const component = createMemo(() => {
    const name = getName();
    if (!name) {
      const rootComponent = matched()?.route.component;
      if (!rootComponent) {
        console.warn("Outlet: No component for root.")
        return Fragment;
      }
      return rootComponent;
    }
    const components = context.matched()?.route.components || context.matched()?.route.mergedComponents || {};
    const component = components[name];

    if (!component) {
      console.warn("Outlet: No component for " + name)
      return Fragment;
    }
    return component;
  })
  
  return <>{component}</>;
}