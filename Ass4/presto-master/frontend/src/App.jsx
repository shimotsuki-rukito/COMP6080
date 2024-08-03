import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import EditPresentation from './pages/EditPresentation';
import Preview from './pages/Preview';

function App () {
  let lsToken = '';
  if (sessionStorage.getItem('token')) {
    lsToken = sessionStorage.getItem('token');
  }

  // console.log(lsToken)

  const [token, setToken] = React.useState(lsToken);
  const setTokenAbstract = (token) => {
    setToken(token);
    sessionStorage.setItem('token', token);
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/dashboard" element={<Dashboard token={token} setTokenFunction={setTokenAbstract} />} />
          <Route path="/register" element={<Register token={token} setTokenFunction={setTokenAbstract} pet="dog" food="pasta" />} />
          <Route path="/login" element={<Login token={token} setTokenFunction={setTokenAbstract} />} />
          <Route path="/presentation/:id/:slideID" component={EditPresentation} element={<EditPresentation token={token} />} />
          <Route path="/preview/:id/:slideID" component={Preview} element={<Preview token={token} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
