import React, { memo } from 'react';
import { Navigate, Route, Routes, useMatch } from 'react-router-dom';
import { ROUTES } from './Constants';
import '../css/index.scss';
import Home from './components/routes/Home';
import Layout from './components/Layout';
import usePlayFab from './hooks/usePlayFab';
import Login from './components/routes/Login';
import useRealtime from './hooks/useRealtime';
import useInventoryExpiration from './hooks/useInventoryExpiration';
import useHeartbeat from './hooks/useHeartbeat';
import useRouteEvents from './hooks/useRouteEvents';
import Notifications from './components/Notifications';
import Debug from './components/Debug';
import '../css/globals.css';

function App() {
  const { playerId } = usePlayFab();

  useRealtime();
  useInventoryExpiration();
  useHeartbeat();
  useRouteEvents();

  const isLogin = useMatch(ROUTES.ROOT + ROUTES.LOGIN);

  return (
    <>
      {!isLogin && !playerId && <Navigate to={ROUTES.LOGIN} replace={true} />}
      <Debug />
      <Routes>
        <Route path={ROUTES.ROOT} element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
        </Route>
      </Routes>
      <Notifications />
    </>
  );
}

export default App;
