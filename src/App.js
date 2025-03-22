import React, { useState, useEffect } from 'react';
import AuthSection from './components/AuthSection';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import { Button } from 'react-bootstrap';

function App() {
  const [records, setRecords] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("api/data", { 
        credentials: "include",
        header: { "Content-Type": "application/json" } 
      });
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Login status check error:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include'
      });
      if (response.ok) {
        setIsLoggedIn(false);
        setRecords([]);
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addPractice = async (newRecord) => {
    try {
      const response = await fetch('api/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
      if (response.ok) {
        const data = await response.json();
        setRecords([...records, data]);
      }
    } catch (error) {
      console.error('Error adding practice:', error);
    }
  };

  const editPractice = async (id, updatedRecord) => {
    try {
      const response = await fetch(`api/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedRecord),
      });
      if (response.ok) {
        setRecords(records.map(record => (record._id === id ? updatedRecord : record)));
      }
    } catch (error) {
      console.error('Error editing practice:', error);
    }
  };

  const deletePractice = async (id) => {
    try {
      const response = await fetch(`api/delete/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setRecords(records.filter(record => record._id !== id));
      }
    } catch (error) {
      console.error('Error deleting practice:', error);
    }
  };

  return (
    <div className="App">
      <main className="container mt-4">
        {isLoggedIn && (
          <div className="d-flex justify-content-end mb-3">
            <Button variant="outline-danger" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        )}
        {isLoggedIn ? (
          <>
            <InputSection addPractice={addPractice} />
            <OutputSection 
              records={records} 
              editPractice={editPractice} 
              deletePractice={deletePractice} 
            />
          </>
        ) : (
          <AuthSection onLogin={checkLoginStatus} />
        )}
      </main>
    </div>
  );
}

export default App;
