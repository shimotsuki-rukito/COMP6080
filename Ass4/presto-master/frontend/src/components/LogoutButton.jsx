import React from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Button = styled.button`
  height: 30px;
  padding: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 5px;
`;
const Logout = ({ token, setToken }) => {
  const logout = async () => {
    try {
      await axios.post('http://localhost:5005/admin/auth/logout', {}, {
        headers: {
          Authorization: token,
        }
      });
      setToken('');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Button onClick={logout}>Logout</Button>
  );
}

export default Logout;
