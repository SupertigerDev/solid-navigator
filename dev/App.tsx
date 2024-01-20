import { JSX, Show, createEffect, lazy } from 'solid-js'
import {
  A,
  Outlet,
  Route,
  Router,
  useLocation,
  useMatch,
  useNavigate,
  useParams,
  useSearchParams,
} from '../src'
const AppPage = lazy(() => import('./AppPage'))

const Root = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const match = useMatch(() => '/app/:id?')
  const params = useParams()

  createEffect(() => {
    console.log(match())
    console.log(params.id)
  })

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
    console.log(location.query)
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
          path="/app/:id?"
          component={AppPage}
          components={{ drawer: AppDrawer, main: MainPage, test: undefined }}
        ></Route>
      </Show>
    </Router>
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
