import 'rsuite/dist/styles/rsuite-default.css';
import './styles/main.scss';
import { Suspense, lazy } from 'react';
import PrivateRoute from './components/PrivateRoute';
import { Switch, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import PublicRoute from './components/PublicRoute';
import { ProfileProvider } from './context/profile.context';

const SignIn = lazy(()=>import('./pages/SignIn'))

function App() {
  return (
    <BrowserRouter>
      <ProfileProvider>
        <Switch>
          <PublicRoute path="/signin">
            {' '}
            Welcome to the SignIn Flow!
            <Suspense fallback={<div>Loading...</div>}>
            <SignIn />
            </Suspense>
          </PublicRoute>
          <PrivateRoute path="/">
            <Home />
          </PrivateRoute>
        </Switch>
      </ProfileProvider>
    </BrowserRouter>
  );
}

export default App;
