import { Accessor, Setter, createEffect, createMemo, on } from 'solid-js'
import { SetStoreFunction, createStore, reconcile } from 'solid-js/store'

export const createLocation = (
  path: Accessor<string>,
  query: Record<string, string>,
  setQuery: SetStoreFunction<Record<string, string>>,
) => {
  const url = createMemo(() => {
    return new URL(path(), 'http://owo')
  })

  createEffect(
    on(url, () => {
      const newQuery: Record<string, string> = {}
      url().searchParams.forEach((value, key) => {
        newQuery[key] = value
      })
      setQuery(reconcile(newQuery))
    }),
  )

  const search = createMemo(() => url().search)
  const pathname = createMemo(() => url().pathname)
  const hash = createMemo(() => url().hash)
  const state = createMemo(on([hash, pathname, search], () => history.state))

  return {
    query,
    get search() {
      return search()
    },
    get pathname() {
      return pathname()
    },
    get hash() {
      return hash()
    },
    get state() {
      return state()
    },
  }
}
