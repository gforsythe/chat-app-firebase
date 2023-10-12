import {Redirect} from 'react-router';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import { Container, Loader } from 'rsuite';
import { useProfileHook } from '../context/profile.context';
const PublicRoute = ({children, ...routeProps}) => {
  const {profile, isLoading} = useProfileHook();

  if(isLoading && !profile){
    return <Container>
      <Loader center vertical size="md" content="Loading" speed='slow'/>
    </Container>
  }

  if (profile && !isLoading){
    return <Redirect to="/"/>
  }

  return (
    <Route {...routeProps}>
      {children}
    </Route>
  )
}

export default PublicRoute;