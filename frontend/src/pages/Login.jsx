import React from 'react';
import Landing from './Landing';

/**
 * Login is now integrated directly into the Landing component.
 * This file serves as a wrapper to maintain the existing /login route.
 */
const Login = () => {
  return <Landing />;
};

export default Login;
