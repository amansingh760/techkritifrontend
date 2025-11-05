import React from 'react';
import { useLocation } from 'react-router-dom';

function ConfirmationPage() {
  const { state } = useLocation();

  const handleDownload = () => {
    const content = `
      Techkriti 2.0 Registration Confirmation

      Name: ${state.name}
      Email: ${state.email}
      Events: ${state.events.join(", ")}
      UTR: ${state.utr}
      Registration ID: ${state.registrationId}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Techkriti_Registration.txt';
    link.click();
  };

  return (
    <div className="confirmation-page">
      <h2>🎉 Registration Successful!</h2>
      <p><strong>Name:</strong> {state.name}</p>
      <p><strong>Email:</strong> {state.email}</p>
      <p><strong>Events:</strong> {state.events.join(", ")}</p>
      <p><strong>UTR:</strong> {state.utr}</p>
      <p><strong>Registration ID:</strong> {state.registrationId}</p>

      <button onClick={handleDownload}>⬇️ Download Confirmation</button>
    </div>
  );
}

export default ConfirmationPage;
