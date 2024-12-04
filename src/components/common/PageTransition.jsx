import React from 'react';
import { useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        timeout={300}
        classNames="page"
        unmountOnExit
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default PageTransition; 