import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { loadUser } from './redux/actions/auth';
import ScrollIntoTop from './hooks/ScrollIntoTop';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Contact from "./components/chat/Contact";
import Chat from './components/chat/Chat';
import NotFound from './components/base/NotFound';


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  return (
    <div className="App">
      <Router>
        <ScrollIntoTop>
          <Switch>
            <Route exact path='/' component={Contact} />
            <Route path='/register/' component={Register} />
            <Route path='/login/' component={Login} />
            <Route exact path='/chat/:pk/' component={Chat} />
            <Route component={NotFound} />
          </Switch>
        </ScrollIntoTop>
      </Router>
    </div>
  );
}

export default App;
