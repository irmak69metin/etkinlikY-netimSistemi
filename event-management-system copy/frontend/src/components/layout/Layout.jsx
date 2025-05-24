import React from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import InactiveUserNotice from '../auth/InactiveUserNotice';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {currentUser && <InactiveUserNotice />}
      <main className="flex-grow relative">
        {children}
      </main>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout; 