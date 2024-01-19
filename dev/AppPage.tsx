import { Outlet } from '../src'

const AppPage = () => {
  console.log('mounted')
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

export default AppPage
