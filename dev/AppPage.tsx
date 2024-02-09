import { onMount } from 'solid-js'
import { Outlet, matchComponent, useLocation, useSearchParams } from '../src'

const AppPage = () => {
  const component = matchComponent(() => 'drawer')
  const [params, setParams] = useSearchParams<{ id: string }>()
  const location = useLocation()

  const pageStyles = {
    display: 'flex',
    height: '100%',
  }

  const paneStyles = {
    background: 'rgba(255,255,255,0.1)',
    'border-radius': '8px',
    margin: '8px',
  }

  onMount(() => {
    console.log(location.search)
    console.log(location.pathname)



  })

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

export default AppPage
