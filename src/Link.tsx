import { JSX } from 'solid-js'

type LinkProps = {
  replace?: boolean
} & JSX.AnchorHTMLAttributes<HTMLAnchorElement>

export const A = (props: LinkProps) => {
  return <a sn-link {...props} />
}
