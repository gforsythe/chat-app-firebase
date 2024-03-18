
import { Redirect } from 'react-router';
import { Route } from 'react-router';
import { Container, Loader } from 'rsuite';
import { useProfileHook } from '../context/profile.context';
const PrivateRoute = ({ children, ...routeProps }) => {
  const { profile, isLoading } = useProfileHook();

  if (isLoading && !profile) {
    return (
      <Container>
        <Loader center vertical size="md" content="Loading" speed="slow" />
      </Container>
    );
  }

  if (!profile && !isLoading) {
    return <Redirect to="/signin" />;
  }

  return <Route {...routeProps}>{children}</Route>;
};

export default PrivateRoute;
