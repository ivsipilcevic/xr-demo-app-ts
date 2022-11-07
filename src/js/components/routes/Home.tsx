import React, { memo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { CSSTransition } from 'react-transition-group';
import usePlayFab from '../../hooks/usePlayFab';

function Home() {
  const page = useRef<HTMLDivElement>(null);

  const { playerId } = usePlayFab();

  //@ts-ignore
  const playerPolls = useSelector((state) => state?.playerPolls?.playerPolls);

  return (
    <CSSTransition nodeRef={page} key='home' timeout={1200} in={true} appear>
      <div className='page home' ref={page}>
        <h1 className='title'>Home Page</h1>
        <p>Here is your PlayFabId: {playerId}</p>
      </div>
    </CSSTransition>
  );
}

export default Home;
