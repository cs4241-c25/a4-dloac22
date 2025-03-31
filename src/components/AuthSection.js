import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AuthSection = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      console.log('Attempting login with:', { username, password });
      const response = await fetch('/api/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      console.log('Login response status:', response.status);
      if (!response.ok) throw new Error('Login failed');
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };
  

  const handleSignup = async () => {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const message = response.ok ? 'Sign-up successful! You can now log in.' : 'Sign-up failed. Try a different username.';
    alert(message);
    console.error('Sign-up error:', response.ok ? null : response.statusText);
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <div className="bg-white shadow p-4 rounded">
            <h2 className="text-center mb-4">Login to Your Account</h2>
            <Form onSubmit={handleLogin}>
              <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter username" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="password" className="mt-3">
                <Form.Label>Password</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="Enter password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-between mt-4">
                <Button variant="success" type="submit">Login</Button>
                <Button variant="primary" type="button" onClick={handleSignup}>Sign Up</Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default AuthSection;
