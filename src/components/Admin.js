import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Admin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
      fetchRecords();
    } else {
      alert('Invalid username or password');
    }
  };

  const fetchRecords = () => {
    setLoading(true);
    fetch('https://qr-code-generator-wr3i.onrender.com/get-records')
      .then(response => response.json())
      .then(data => {
        setRecords(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching records:', error);
        setLoading(false);
      });
  };

  const exportToCSV = () => {
    const csvRows = [];
    const headers = ['Name', 'Phone', 'Email'];
    csvRows.push(headers.join(','));

    records.forEach(record => {
      const row = [record.name, record.phone, record.email];
      csvRows.push(row.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'records.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="container mt-4">
      {!isLoggedIn ? (
        <form onSubmit={handleLogin}>
          <h2 className="mb-4">Admin Login</h2>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
      ) : (
        <div>
          <h2 className="mb-4">Dashboard</h2>
          <button className="btn btn-success mb-3" onClick={exportToCSV}>Export to CSV</button>
          {loading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index}>
                      <td>{record.name}</td>
                      <td>{record.phone}</td>
                      <td>{record.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
