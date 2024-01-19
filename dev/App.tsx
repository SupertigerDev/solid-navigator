import { JSX, Show, createEffect } from 'solid-js'
import { A, Outlet, Route, Router, useLocation, useMatch, useSearchParams } from '../src'

const Root = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const match = useMatch(() => '/app/')

  const random = () => {
    const str = Math.random().toString()
    return str
  }

  const styles: JSX.CSSProperties = {
    display: 'flex',
    'flex-direction': 'column',
    height: '100%',
  }

  createEffect(() => {
    console.log(location.query.id)
  })
  return (
    <div style={styles}>
      Root: {Math.random()}
      <h1 onClick={() => setSearchParams({ id: random() })}>App Title</h1>
      <Outlet />
    </div>
  )
}

function App() {
  return (
    <Router root={Root}>
      <Route path="/" component={HomePage} />
      <Route path="/terms" component={Terms} />
      <Show when={true}>
        <Route
          path="/app/*"
          component={AppPage}
          components={{ drawer: AppDrawer, main: MainPage }}
        ></Route>
      </Show>
    </Router>
  )
}

const AppPage = () => {
  const pageStyles = {
    display: 'flex',
    height: '100%',
  }

  const paneStyles = {
    background: 'rgba(255,255,255,0.1)',
    'border-radius': '8px',
    margin: '8px',
  }

  return (
    <div style={pageStyles}>
      <div style={{ ...paneStyles, width: '200px' }}>
        <Outlet name="drawer" />
        App Page: {Math.random()}
      </div>
      <div style={{ ...paneStyles, flex: 1 }}>
        <Outlet name="main" />
      </div>
    </div>
  )
}

const AppDrawer = () => {
  return <div>App Drawer: {Math.random()}</div>
}
const MainPage = () => {
  return <div>Main Page: {Math.random()}</div>
}

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <A href="/app">Go to app</A>
    </div>
  )
}

const Terms = () => {
  return (
    <div>
      <h1>Terms</h1>
      <p>Please read these non-existent terms!</p>
    </div>
  )
}

export default App
