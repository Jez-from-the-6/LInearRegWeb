import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Router, Route, Switch } from 'react-router-dom';
import LoginPage from './skeleton/shared/components/login/loginForm';
import { history } from './skeleton/Routing/utilities/history';
import Home from "./src/pages/Home.mdx";
import Intro from "./src/pages/Intro.mdx";
import Projects from "./src/pages/Projects.mdx";
import SharedImages from "./skeleton/shared/images/imgIndex"
import Navbar from "./skeleton/shared/components/navbar";
import Sliders from "./skeleton/shared/components/landingSliders";
 
const App = () => {
  return (
    <div style={{
    width: "100%",
    height: "100%",
    backgroundImage: "url('" + SharedImages.NetGraphic + "')",
    padding: "0rem 0rem 100% 0rem !important",
    paddingBottom: "0% !important",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    position: "absolute"}}
    >
    <React.Fragment>
      <Router history={history}>
        <Navbar />
        <Switch>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route path="/intro" component={Intro} />
          <Route path="/projects" component={Projects} />
          <Route exact path="/" component={Home} />
          {/*<PrivateRoute component={MDXDocument} /> */}
        </Switch>
      </Router>
    </React.Fragment>
    </div>
  );
}

export default App;