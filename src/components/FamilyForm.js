import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaPlus } from 'react-icons/fa';
import Confetti from 'react-confetti';

const FamilyForm = () => {
  const [kids, setKids] = useState([{ name: '', dob: '' }]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [walletUrl, setWalletUrl] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const handleAddKid = () => {
    setKids([...kids, { name: '', dob: '' }]);
  };

  const handleKidChange = (index, field, value) => {
    const newKids = [...kids];
    newKids[index][field] = value;
    setKids(newKids);
  };

  const handleDeleteKid = (index) => {
    const newKids = kids.filter((_, i) => i !== index);
    setKids(newKids);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePhoneNumber = (phone) => {
    const re = /^\d{10}$/;
    return re.test(String(phone));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const phone = e.target.phone.value;
    const spouseName = e.target.spouseName.value;

    if (!validateEmail(email)) {
      alert("Invalid email address");
      return;
    }

    if (!validatePhoneNumber(phone)) {
      alert("Invalid phone number");
      return;
    }

    const formData = {
      name: name,
      phone: phone,
      email: email,
      spouseName: spouseName,
      kids: kids
    };

    console.log('Form submitted:', formData);
    setShowForm(false);
    setLoading(true);
    setSubmittedName(name);

    fetch("https://qr-code-generator-wr3i.onrender.com/generate-pass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
      console.log("PassSlot API Response:", data);
      setLoading(false);
      if (data.url) {
        setWalletUrl(data.url);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5 seconds
      } else {
        console.log("Failed to create Apple Wallet pass");
        setShowForm(true);
      }
    })
    .catch(error => {
      console.error("Fetch Error:", error);
      setLoading(false);
      setShowForm(true);
    });
  };

  return (
    <div className="container mt-4">
      {showForm && (
        <form onSubmit={handleSubmit}>
          <h2 className="mb-4">MSTS Register Details</h2>
          <div className="row mb-3">
            <div className="col-md-12">
              <input type="text" className="form-control mb-2" name="name" placeholder="Name" required />
              <input type="text" className="form-control mb-2" name="phone" placeholder="Phone Number" required />
              <input type="email" className="form-control mb-2" name="email" placeholder="Email" required />
              <input type="text" className="form-control mb-2" name="spouseName" placeholder="Spouse Name" />
            </div>
          </div>
          <div className="mb-3">
            {kids.map((kid, index) => (
              <div key={index} className="row mb-3">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Kid's Name"
                    value={kid.name}
                    onChange={(e) => handleKidChange(index, 'name', e.target.value)}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="date"
                    className="form-control"
                    placeholder="Kid's DOB"
                    value={kid.dob}
                    onChange={(e) => handleKidChange(index, 'dob', e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDeleteKid(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-primary" onClick={handleAddKid}>
              <FaPlus /> Kids
            </button>
          </div>
          <div id="qrcodeContainer" className="text-center">
            <button type="submit" className="btn btn-success">Submit</button>
          </div>
        </form>
      )}
      {loading && (
        <div className="text-center">
          <button className="btn btn-primary" disabled>Loading...</button>
        </div>
      )}
      {walletUrl && (
        <div className="text-center">
          {showConfetti && <Confetti />}
          <h3 style={{ color: 'green' }}>Congratulations {submittedName}, your details have been successfully submitted!</h3>
          <div className="mb-3"></div> {/* Add line space */}
          <button className="btn btn-primary" onClick={() => window.location.href = walletUrl}>
            Add to Apple Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default FamilyForm;
