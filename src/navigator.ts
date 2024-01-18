import { useRouterContext } from "./Router";

export interface NavigateOptions {
  replace?: boolean
}

export const useNavigate = () => {
  const context = useRouterContext();
  return context.navigate;
}
