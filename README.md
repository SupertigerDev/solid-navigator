<p>
  <img width="100%" src="https://assets.solidjs.com/banner?type=solid-navigator&background=tiles&project=%20" alt="solid-navigator">
</p>

# solid-navigator

[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-cc00ff.svg?style=for-the-badge&logo=pnpm)](https://pnpm.io/)

Solid Navigator is a library that is inspired by vue-router and @solidjs/router.


## Quick start

Install it:

```bash
npm i solid-navigator
# or
pnpm add solid-navigator
```

Use it:

```tsx
import { useNavigate, Outlet, Route, Router, useLocation, useParams, A } from 'solid-navigator'
```


## Methods

### `useNavigate`
```js
const navigate = useNavigate();
navigate("/app", {replace: true})
```

### `useLocation`  
```js
// path: /app?id=1
const location = useLocation();
{
  query: {id: string} 
  search: string
  pathname: string
  hash: string
}
```

### `useParams`
```js
// path: /chats/:id
const params = useParams<{id: string}>();
{
  id: string
}
```

### `useMatch`
```js
// path: /chats/1234
const match = useMatch(() => "/chats/1234");
{
  path: "/chats/1234"
  params: {}
} | null
```

## Components

### `Router`  
```jsx
const Root = () => {
  return (
    <div>
      <h1>Header</h1>
      <Outlet/>
    </div>
  )
}

const Main = () => {
  return (
    <Router root={Root}>
      // Routes go here
    </Router>
  )
}
```

### `Outlet`
```jsx
const Main = () => {

  const AppComponent = () => {
    return (
      <div>
        <div><Outlet name="drawer"/></div>
        <div><Outlet name="content"/></div>
      </div>
    )
  }

  return (
    <Router root={Root}>
      <Route path="/" component={AppComponent}>
        <Route 
          components={{
            drawer: Drawer,
            content: Content
          }} 
        />
      </Route>
    </Router>
  )
}
```

### `A` 
```tsx
const App = () => {
  return (
    <A href="/" replace />
  )
}
```

### `Navigate` 
```tsx
const App = () => {
  return (
    <Navigate to="/" />
  )
}

