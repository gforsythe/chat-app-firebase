import {  Alert, Button, Col,Container, Grid, Icon, Panel, Row } from "rsuite";
import { auth, db } from "../misc/firebase";
import firebase from "firebase/app";



const SignIn = () => {
  const signInWithProvider = async (provider) =>{

    try {
      const {additionalUserInfo, user} =  await  auth.signInWithPopup(provider);
      if (additionalUserInfo) {
        await db.ref(`/profiles/${user.uid}`).set({
          name: user.displayName,
          createdAt: firebase.database.ServerValue.TIMESTAMP
        })
      }
      Alert.success("BINGO BANGO BONGO YOURE IN", 4000)
    } catch (error) {
      Alert.info(error.message, 4000)
    }

  }

  const onFBSignIn = () => {
    signInWithProvider(new firebase.auth.FacebookAuthProvider())
  }
  const onGoogleSignIn = () => {
    signInWithProvider(new firebase.auth.GoogleAuthProvider())
  }
  return (

      <Container >
        <Grid className="mt-page">
          <Row>
            <Col xs={24} md={12} mdOffset={6} >
              <Panel  >
                <div className="text-center" >
                  <h2  >
                    Welcome to Chat
                  </h2>
                  <p>Progessive Chat Platform for neophytes</p>
                </div>
                <div className="mt-3">
                  <Button block color="blue" onClick={onFBSignIn}>
                    <Icon icon={"facebook"}> Continue With Facebook</Icon>
                  </Button>
                  <Button block color="green" onClick={onGoogleSignIn}>
                    <Icon icon={"google"}> Continue With Google</Icon>
                  </Button>
                </div>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </Container>

    )}

export default SignIn