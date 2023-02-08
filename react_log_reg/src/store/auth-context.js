import React, { useState, useEffect } from 'react';

// creates context(app component wide state) object
const AuthContext = React.createContext({
    isLoggedIn: false,
    onLogOut: () => {},
    onLogIn: (email, password) => {},
});

export const AuthContextProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // runs after everything else in app has ran, then runs again if the dependencies change
    useEffect(() => {
        const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');

        if (storedUserLoggedInInformation === '1') {
            setIsLoggedIn(true);
        }
    }, []);


    const logOutHandler = () => {
        // when logging out clear isLoggedIn from localStorage in browser so user is not logged back in automatically when visitin website
        localStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    const logInHandler = () => {
        //isLoggedIn is a storage system in the browser independent of react go to application in inspect
        localStorage.setItem('isLoggedIn', '1')
        setIsLoggedIn(true);
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn: isLoggedIn,
            onLogout: logOutHandler,
            onLogIn: logInHandler
        }}
        >
            {props.children}
        </AuthContext.Provider>
    )
};

export default AuthContext;