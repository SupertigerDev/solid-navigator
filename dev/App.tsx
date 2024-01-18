import { createEffect, lazy } from 'solid-js'
import { Outlet, Route, useNavigate, Router, useLocation } from '../src'



const Root = () => {
  return (
  <div>
    <h1>App Title</h1>
    <Outlet/>
  </div>
  )
}

function App() {
  return (
   <Router root={Root}>
      <Route path='/' component={HomePage}  />
      <Route path='/terms' component={Terms}/>

      <Route path='/app' component={AppPage} components={{drawer: AppDrawer, main: MainPage}}>

      </Route>
   </Router>
  )
}

const AppPage = () => {
  return (
    <div>
      <div class="drawer"><Outlet name='drawer'/></div>
      <div class="drawer"><Outlet name='main'/></div>
    </div>
  )
}


const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
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
