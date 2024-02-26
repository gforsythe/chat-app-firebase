import { RoomsProvider } from "../../context/rooms.context";
import { Col, Grid, Row } from "rsuite";
import Sidebar from "../../components/Sidebar";
import Chat from "./Chat";
import { Switch, Route, useRouteMatch } from "react-router";
import { useMediaQuery } from "../../misc/custom-hooks";

const Home = () => {
  const isDesktop = useMediaQuery(`(min-width: 992px)`);
  const {isExact} = useRouteMatch();

  const canRenderSideBar = isDesktop || isExact;
  return (
    <RoomsProvider>
      <Grid fluid className="h-100">
        <Row className="h-100">
          {canRenderSideBar &&  <Col xs={24} md={8} className="h-100" >
            <Sidebar />
          </Col>}
         
          <Switch>
            <Route exact path="/chat/:chatId">
              <Col xs={24} md={16} className="h-100">
                <Chat />
              </Col>
            </Route>
            <Route>
              {isDesktop && <Col xs={24} md={8} className="h-100" >
                <h6 className="text-center mt-page">Please Select Chat</h6>
                </Col>}
            </Route>
          </Switch>
        </Row>
      </Grid>
    </RoomsProvider>
  );
};

export default Home;