import 'rsuite/dist/styles/rsuite-default.css';
import './styles/main.scss';
import PrivateRoute from './components/PrivateRoute';
import { Switch, BrowserRouter } from 'react-router-dom';
import Home from './pages/Home';
import PublicRoute from './components/PublicRoute';
import SignIn from './pages/SignIn';
import { ProfileProvider } from './context/profile.context';

function App() {
  return (
    <BrowserRouter>
      <ProfileProvider>
        <Switch>
          <PublicRoute path="/signin">
            {' '}
            Welcome to the SignIn Flow!
            <SignIn />
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
