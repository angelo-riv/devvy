import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import Problems from './pages/Problems';
import Explore from './pages/Explore';
import Events from './pages/Events';
import Profile from './pages/Profile';
import ProblemInfo from './pages/ProblemInfo';

//Components
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className = "App">
        <Navbar />
        <div className = "content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/problems">
              <Problems />
            </Route>
            <Route path="/problemsinfo/:problemId">
              <ProblemInfo />
            </Route>
            <Route path="/explore">
              <Explore />
            </Route>
            <Route path="/events">
              <Events />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
