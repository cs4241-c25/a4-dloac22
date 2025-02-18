import React, { useState } from 'react';
import { Table, Container, Button, Modal, Form } from 'react-bootstrap';

const OutputSection = ({ records, editPractice, deletePractice }) => {
  const [show, setShow] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (record) => {
    setCurrentRecord(record);
    setShow(true);
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    const updatedRecord = {
      ...currentRecord,
      practiceType: event.target['edit-practice-type'].value,
      duration: event.target['edit-duration'].value,
      score: event.target['edit-score'].value
    };
    editPractice(currentRecord._id, updatedRecord);
    handleClose();
  };

  return (
    <Container className="mt-4">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-center fw-bold mb-4 text-primary bg-warning">Practice Records</h2>
        <Table striped bordered hover>
          <thead>
            <tr className="bg-primary text-black">
              <th>Practice Type</th>
              <th>Duration (minutes)</th>
              <th>Self-score</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record._id}>
                <td>{record.practiceType}</td>
                <td>{record.duration}</td>
                <td>{record.score}</td>
                <td>{record.date}</td>
                <td>
                  <Button variant="warning" onClick={() => handleShow(record)} className="me-2">Edit</Button>
                  <Button variant="danger" onClick={() => deletePractice(record._id)} className="m2-2">Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {currentRecord && (
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Practice</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId="edit-practice-type">
                <Form.Label>Practice Type:</Form.Label>
                <Form.Control as="select" defaultValue={currentRecord.practiceType}>
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
              <Form.Group controlId="edit-duration" className="mt-3">
                <Form.Label>Duration (minutes):</Form.Label>
                <Form.Control type="number" min="1" defaultValue={currentRecord.duration} required />
              </Form.Group>
              <Form.Group controlId="edit-score" className="mt-3">
                <Form.Label>Self-Score (1-10):</Form.Label>
                <Form.Control type="number" min="1" max="10" defaultValue={currentRecord.score} required />
              </Form.Group>
              <Button variant="primary" type="submit" className="mt-4">Save Changes</Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default OutputSection;
