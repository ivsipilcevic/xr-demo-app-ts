import React, { memo, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { ROUTES } from '../../Constants';
import useLogin from '../../hooks/useLogin';
import usePlayFab from '../../hooks/usePlayFab';
import Loading from '../ui/Loading';

function Login() {
  const { IsLoggingIn, OnClickNewUser } = useLogin();
  const page = useRef<HTMLDivElement>(null);

  const { playerId } = usePlayFab();

  console.log('PLAYER ID: ', playerId);

  return (
    <CSSTransition nodeRef={page} key='login' timeout={1200} in={true} appear>
      <div className='page login' ref={page}>
        {playerId && <Navigate to={ROUTES.ROOT} replace={true} />}
        <div className='page-content'></div>

        <div className='sidebar'>
          <div className='title'>Login Page</div>

          <Loading isLoading={IsLoggingIn} />

          <div className='league'>
            <div className='users'>
              <div className='user new' onClick={OnClickNewUser}>
                <button className='text'>New User</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}

export default memo(Login);
