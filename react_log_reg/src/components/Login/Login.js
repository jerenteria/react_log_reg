import React, { useState, useEffectm, useReducer } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';

// created outside of component function bc we wont need any data generated inside of component function; doesnt need to communicate
  // with component function
const emailReducer = (state, action) => {
  if(action.type === 'USER_INPUT') {
    return {value: action.val, isValid: action.val.includes('@')};
  }
  if(action.type === 'INPUT_BLUR') {
    return {value: state.val, isValid: state.value.includes('@')};
  }
  return {value: '', isValid: false};
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  // useReducer works like useState but is more helpful when you have multiple states that change together/are related; depend on each other; manage each other
  const [emailState, disptachEmail] = useReducer(emailReducer, {value: '', isValid: false});

  useEffect(() => {
    // wait 500 to see the next keystroke to check form validity to prevent too much request traffic
    const identifier = setTimeout(() => {
      // makes sure email is proper format and password is correct
      setFormIsValid(
        enteredEmail.includes('@') && enteredPassword.trim().length > 6
      ); 
    }, 500);
    
    // clears timeout after 500ms 
    return () => {
      clearTimeout(identifier);
    };

    // dependencies: rerun this function for every log in but only if enteredEmail or enteredPassword has changed
  }, [enteredEmail, enteredPassword]);

  const emailChangeHandler = (event) => {
    disptachEmail({type: 'USER_INPUT', val: event.target.value});

  };

  const passwordChangeHandler = (event) => {
    setEnteredPassword(event.target.value);

    setFormIsValid(
      emailState.isValid && event.target.value.trim().length > 6
    );
  };

  const validateEmailHandler = () => {
    disptachEmail({type: 'INPUT_BLUR'})
  };

  const validatePasswordHandler = () => {
    setPasswordIsValid(enteredPassword.trim().length > 6);
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, enteredPassword);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordIsValid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={enteredPassword}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
