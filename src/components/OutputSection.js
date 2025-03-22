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
    <Container fluid className="px-0 px-md-3">
      <div className="bg-white p-3 p-md-4 rounded shadow">
        <h2 className="text-center fw-bold mb-3 mb-md-4 text-primary bg-warning fs-3 fs-md-2">Practice Records</h2>
        <div className="table-responsive">
          <Table striped bordered hover className="mb-0">
            <thead>
              <tr className="bg-primary text-black">
                <th>Practice Type</th>
                <th>Duration</th>
                <th>Score</th>
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
                    <div className="d-flex flex-column flex-md-row gap-2">
                      <Button variant="warning" onClick={() => handleShow(record)} className="w-100 w-md-auto">Edit</Button>
                      <Button variant="danger" onClick={() => deletePractice(record._id)} className="w-100 w-md-auto">Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      {currentRecord && (
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Edit Practice</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleEditSubmit}>
              <Form.Group controlId="edit-practice-type">
                <Form.Label>Practice Type:</Form.Label>
                <Form.Control as="select" defaultValue={currentRecord.practiceType} className="form-select">
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
                <Form.Control type="number" min="1" defaultValue={currentRecord.duration} required className="form-control" />
              </Form.Group>
              <Form.Group controlId="edit-score" className="mt-3">
                <Form.Label>Self-Score (1-10):</Form.Label>
                <Form.Control type="number" min="1" max="10" defaultValue={currentRecord.score} required className="form-control" />
              </Form.Group>
              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" className="mt-4">Save Changes</Button>
                <Button variant="secondary" onClick={handleClose}>Close</Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      )}
    </Container>
  );
};

export default OutputSection;
