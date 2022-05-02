import React, {createContext, useState, useEffect} from 'react';

export const UserContext = createContext();

const UserContextProvider = (props) => {

    const [loggedIn, setLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [userId, setUserId] = useState('');

    
    const logUserIn = (email, id) => {
        console.log('email in context: ', email);
        setUserId(id)
        setUserEmail(email)
        setLoggedIn(true)
    }
    
    const logOut = () => {
        setLoggedIn(false)
        setUserEmail('')
        setUserId('')
    };

    useEffect(() => {
        console.log('(context) the user is logged in: ', loggedIn);
    }, [loggedIn])
    
        return (
          <UserContext.Provider
            value={{
              logUserIn: logUserIn,
              logOut: logOut,  
              loggedIn: loggedIn,
              userEmail: userEmail,
              userId: userId
            }}
          >
            {props.children}
          </UserContext.Provider>
        )
}
        
export const UserContextConsumer = UserContext.Consumer;
export default UserContextProvider;