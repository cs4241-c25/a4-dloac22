import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';

const InputSection = ({ addPractice }) => {
  const [practiceType, setPracticeType] = useState('');
  const [duration, setDuration] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const newRecord = {
      practiceType,
      duration,
      score,
      date: new Date().toLocaleDateString(),
    };
    addPractice(newRecord);
    setPracticeType('');
    setDuration('');
    setScore('');
  };

  return (
    <Container className="mt-4">
      <div className="p-4 rounded shadow" style={{backgroundColor: '#b3d7ff'}}>
        <h1 className="text-center mb-4 fw-bold">Pool Practice Tracker</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="practice-type" className="fw-bold">
            <Form.Label>Practice Type:</Form.Label>
            <Form.Control 
              as="select" 
              value={practiceType}
              onChange={(e) => setPracticeType(e.target.value)}
            >
              <option>Select a practice type</option>
              <option value="Straight">Straight</option>
              <option value="Right Spin">Right Spin</option>
              <option value="Left Spin">Left Spin</option>
              <option value="Backspin">Backspin</option>
              <option value="Stun Shot">Stun Shot</option>
              <option value="Easy Drill">Easy Drill</option>
              <option value="Medium Drill">Medium Drill</option>
              <option value="Hard Drill">Hard Drill</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="duration" className="mt-3 fw-bold">
            <Form.Label>Duration (minutes):</Form.Label>
            <Form.Control 
              type="number" 
              min="1" 
              required 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder='How many minutes did you practice?'
            />
          </Form.Group>
          <Form.Group controlId="score" className="mt-3 fw-bold">
            <Form.Label>Self-Score (1-10):</Form.Label>
            <Form.Control 
              type="number" 
              min="1" 
              max="10" 
              required 
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder='How would you rate your practice today?'
            />
          </Form.Group>
          <Button variant="success" type="submit" className="w-100 mt-3 fw-bold">ADD PRACTICE</Button>
        </Form>
      </div>
    </Container>
  );
};

export default InputSection;
