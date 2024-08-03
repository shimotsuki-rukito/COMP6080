import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import ErrorModal from '../components/ErrorModal';

const LoginLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
  color: #007bff;
`;

const RegisterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: rgb(220, 220, 220);
  font-family: Arial;
`;

const Title = styled.h2`
  font-size: 40px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormField = styled.div`
  margin-bottom: 15px;
  width: 100%;
  max-width: 300px;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
`;

const FormInput = styled.input`
  width: calc(100% - 10px);
  padding: 5px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  width: calc(100% - 10px);
  padding: 5px;
  font-size: 16px;
  margin-top: 10px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
`;

const SmallText = styled.p`
  font-size: 14px;
`;
const Register = ({ token, setTokenFunction }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const navigate = useNavigate();

  if (token !== '') {
    return <Navigate to="/dashboard" />;
  }

  const submit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      setErrorModalOpen(true);
      return;
    }

    if (!email) {
      setErrorMessage('Email cannot be empty.');
      setErrorModalOpen(true);
      return;
    }

    if (!isValidEmail(email)) {
      setErrorMessage('Invalid email format.');
      setErrorModalOpen(true);
      return;
    }

    if (!password) {
      setErrorMessage('Password cannot be empty.');
      setErrorModalOpen(true);
      return;
    }

    if (!name) {
      setErrorMessage('Name cannot be empty.');
      setErrorModalOpen(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5005/admin/auth/register', {
        email,
        password,
        name
      });
      setTokenFunction(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setErrorMessage(err.response.data.error);
      setErrorModalOpen(true);
    }
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.com/.test(email);
  };

  const goToLogin = () => {
    navigate('/login');
  };

  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  return (
    <RegisterContainer>
      <Title>Register</Title>
      <Form onSubmit={submit} noValidate>
        <FormField>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <FormInput
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="password">Password:</FormLabel>
          <FormInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="confirmPassword">Confirm Password:</FormLabel>
          <FormInput
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormField>
        <FormField>
          <FormLabel htmlFor="name">Name:</FormLabel>
          <FormInput
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormField>
        <SubmitButton type="submit">Submit</SubmitButton>
      </Form>
      <SmallText>
        Already have an account? Go to {' '}
        <LoginLink onClick={goToLogin}>Login</LoginLink>.
      </SmallText>
      <ErrorModal isOpen={errorModalOpen} onClose={closeErrorModal}>
        <p>{errorMessage}</p>
      </ErrorModal>
    </RegisterContainer>
  );
}

export default Register;
