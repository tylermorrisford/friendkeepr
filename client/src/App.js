import React, {useContext} from 'react'
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import FriendsTable from './components/FriendsTable';
import Login from './components/Login'
import { UserContext } from './context/UserContextProvider';

function App() {

  const {loggedIn} = useContext(UserContext)

  // function PrivateRoute({ component: Component, ...rest }) {
  
  //   return (
  //     <Route
  //       {...rest}
  //       render={props => {
  //         if  (loggedIn) {
  //           return <Component {...props}/>
  //         } else {

  //           return <Redirect to={{
  //               pathname: "/",
  //               state: {
  //                 from: props.location
  //               }
  //             }}
  //             />
  //           }}}
  //     />
  //   );
  // }

  const friendkeepr = '<FriendKeepr />'
  // TODO: install router, setup private routes, login page, signup page, error page
  return (
      <div className="container">
        <div className="columns mt-3">
          <div className="column is-full has-text-centered">
          {loggedIn ? <small>Hello! Welcome to {friendkeepr}</small> : ''}
            <Router>
              <Switch>
                <Route path="/">
                  {loggedIn ? <FriendsTable/> : <Login/>}
                </Route>
              </Switch>
            </Router>
          </div>
        </div>
      </div>
  );
}

export default App;
