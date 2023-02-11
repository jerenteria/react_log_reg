import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';
import Input from '../UI/Input/Input';

// created outside of component function bc we wont need any data generated inside of component function; doesnt need to communicate
// with component function
// reducer takes last state snapshot and action that was passed
const emailReducer = (state, action) => {
  // check if the value stored in the type is the string with the content 'USER_INPUT'
  if (action.type === 'USER_INPUT') {
    // if yes return a state snapshot and action value has @
    return { value: action.val, isValid: action.val.includes('@') };
  }
  if (action.type === 'INPUT_BLUR') {
    // check what the last email input was 
    return { value: state.value, isValid: state.value.includes('@') };
  }
  return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return { value: action.val, isValid: action.val.trim().length > 6 };
  }
  if (action.type === 'INPUT_BLUR') {
    return { value: state.value, isValid: state.value.trim().length > 6 };
  }
  return { value: '', isValid: false };
};

const Login = (props) => {
  // const [enteredEmail, setEnteredEmail] = useState('');
  // const [emailIsValid, setEmailIsValid] = useState();
  // const [enteredPassword, setEnteredPassword] = useState('');
  // const [passwordIsValid, setPasswordIsValid] = useState();
  const [formIsValid, setFormIsValid] = useState(false);

  // useReducer works like useState but is more helpful when you have multiple states that change together/are related; depend on each other; manage each other
  const [emailState, disptachEmail] = useReducer(emailReducer, { value: '', isValid: null });

  const [passwordState, dispatchPassword] = useReducer(passwordReducer, { value: '', isValid: null });

  const authCtx = useContext(AuthContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  useEffect(() => {
    console.log('EFFECT RUNNING');

    return () => {
      console.log('EFFECT CLEANUP');
    };
  }, []);

  const { isValid: emailIsValid } = emailState;
  const { isValid: passwordIsValid } = passwordState;

  useEffect(() => {
    // wait 500 to see the next keystroke to check form validity to prevent too much request traffic
    const identifier = setTimeout(() => {
      console.log('checking form validity');
      // makes sure email is proper format and password is correct
      setFormIsValid(emailIsValid && passwordIsValid);
    }, 500);

    // clears timeout after 500ms 
    return () => {
      console.log('CLEANUP')
      clearTimeout(identifier);
    };
    // dependencies: rerun this function for every log in but only if enteredEmail or enteredPassword has changed
  }, [emailIsValid, passwordIsValid]);

  const emailChangeHandler = (event) => {
    // object with type field that describes what happened and extra payload(value that user entered)   
    disptachEmail({ type: 'USER_INPUT', val: event.target.value });

    // setFormIsValid(
    //   // event.target.value.includes('@') && passwordState.isValid
    // );

  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({ type: 'USER_INPUT', val: event.target.value })

    // setFormIsValid(
    //   // emailState.isValid && event.target.value.trim().length > 6
    // );
  };

  const validateEmailHandler = () => {
    disptachEmail({ type: 'INPUT_BLUR' });
  };

  const validatePasswordHandler = () => {
    dispatchPassword({ type: 'INPUT_BLUR' })
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formIsValid) {
      authCtx.onLogin(emailState.value, passwordState.value);
    } else if (!emailIsValid) {
      emailInputRef.current.focus();
    } else {
      passwordInputRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailInputRef}
          id="email"
          label="E-Mail"
          type="email"
          isValid={emailIsValid}
          value={emailState.value}
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
        />
        <Input
          ref={passwordInputRef}
          id="password"
          label="Password"
          type="password"
          isValid={passwordIsValid}
          value={passwordState.value}
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
        />
        <div
          className={`${classes.control} ${
            passwordState.isValid === false ? classes.invalid : ''
            }`}
        >
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
