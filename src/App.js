import React, { useState } from 'react';
import './App.css';
import emailjs from '@emailjs/browser';


const eventOptions = [
  { name: "Hackathon", desc: "Build innovative solutions in 24 hours!" },
  { name: "Tech Quiz", desc: "Test your tech knowledge and win prizes." },
  { name: "Tech Debate", desc: "Engage in debates on trending tech topics." },
  { name: "Tech Exhibition", desc: "Showcase your creative technical projects." },
  { name: "Code Cracker", desc: "Solve tricky coding puzzles to prove your logic." },
  { name: "Debugging Contest", desc: "Find and fix bugs in record time!" },
  { name: "Startup Expo", desc: "Pitch your startup ideas to investors." },
  { name: "Fastest Typing Challenge", desc: "Prove your coding speed and accuracy." },
  { name: "Pseudo Code War", desc: "Write logic, not code – and win the challenge!" },
  { name: "Project Showcase", desc: "Display your final-year or passion projects." },
  { name: "Memory Master", desc: "Challenge your mind with memory-based games." },
  { name: "Virtual Escape Room", desc: "Solve mysteries and escape before time runs out!" }
];

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile_number: '',
    year: '',
    college: '',
    department: '',
    events: []
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  //const [showUTRSection, setShowUTRSection] = useState(false);
  const [utr, setUTR] = useState('');
  // const [uploadedFile, setUploadedFile] = useState(null);
  // const [finalReady, setFinalReady] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email";
    if (!formData.mobile_number.trim()) {
      newErrors.mobile_number = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile_number)) {
      newErrors.mobile_number = "Enter a valid 10-digit Indian mobile number";
    }
    if (!formData.year.trim()) newErrors.year = "Year is required";
    if (!formData.college.trim()) newErrors.college = "College is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (formData.events.length === 0) newErrors.events = "Select at least one event";
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const updatedEvents = checked
        ? [...prev.events, value]
        : prev.events.filter(event => event !== value);
      return { ...prev, events: updatedEvents };
    });
  };

  const handleProceed = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    handlePayment(); // 🔁 Trigger Razorpay instead of just showing UTR section
    //setShowUTRSection(true);
  };

// payment handle

const handlePayment = async () => {
  const options = {
    key: 'rzp_test_R621lPtd7qF7HB',
    amount: 10000, // ₹100 in paise
    currency: 'INR',
    name: 'Techkriti 2.0',
    description: 'Event Registration Fee',
    handler: async function (response) {
      const paymentId = response.razorpay_payment_id;
      setUTR(paymentId); // Save payment ID as UTR

      // Auto-submit form after payment
      try {
        setLoading(true);
        const formPayload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach(v => formPayload.append(key, v));
          } else {
            formPayload.append(key, value);
          }
        });
        formPayload.append('utr', paymentId);

        const res = await fetch('http://localhost:3000/register', {
          method: 'POST',
          body: formPayload
        });

        const text = await res.text();
        setMessage(text);

        // Send confirmation email
        emailjs.send('service_wiq3snm', 'template_lfx22hk', {
          to_name: formData.name,
          to_email: formData.email,
          to_year: formData.year,
          to_department: formData.department,
          to_mobile: formData.mobile_number,
          to_collage: formData.college,
          to_events: formData.events,
          to_rid: text.match(/techkriti2\.0-\d{4}/)?.[0],
          to_utr: paymentId
        }, 'yCrQiDke2exuE3lzm')
        .then(() => console.log('Confirmation email sent'))
        .catch(err => console.error('EmailJS error:', err));
      } catch (err) {
        setMessage("Error submitting the form. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    prefill: {
      name: formData.name,
      email: formData.email,
      contact: formData.mobile_number
    },
    theme: {
      color: '#3399cc'
    }
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};













  // const checkFinalReady = (utrValue, fileValue) => {
  //   if (utrValue.trim() && fileValue) {
  //     setFinalReady(true);
  //   } else {
  //     setFinalReady(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(v => formPayload.append(key, v));
        } else {
          formPayload.append(key, value);
        }
      });
      formPayload.append('utr', utr);
      // if (uploadedFile) formPayload.append('image', uploadedFile);

      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        body: formPayload
      });

      const text = await response.text();
      setMessage(text);
    
     // ✅ Send confirmation email via EmailJS
    emailjs.send('service_wiq3snm', 'template_lfx22hk', {
      to_name: formData.name,
      to_email: formData.email,
      to_year: formData.year,
      to_department: formData.department,
      to_mobile: formData.mobile_number,
      to_collage: formData.college,
      to_events: formData.events,
      to_rid: text.match(/techkriti2\.0-\d{4}/)?.[0],
      to_utr: utr
    }, 'yCrQiDke2exuE3lzm')
    .then(() => {
      console.log('Confirmation email sent');
    })
    .catch(err => {
      console.error('EmailJS error:', err);
    });

  } catch (error) {
    setMessage("Error submitting the form. Please try again later.");
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1>🎉 Tech Event Registration</h1>
        <p className="subtitle">Join the most exciting tech fest of the year!</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input name="name" placeholder="Full Name" onChange={handleChange} required />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="input-group">
          <input name="email" placeholder="Email Address" type="email" onChange={handleChange} required />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <input name="mobile_number" placeholder="Mobile Number" onChange={handleChange} required />
            {errors.mobile_number && <span className="error">{errors.mobile_number}</span>}
          </div>

          <div className="input-group">
            <input name="year" placeholder="Year (e.g., 1st, 2nd, 3rd, 4th)" onChange={handleChange} required />
            {errors.year && <span className="error">{errors.year}</span>}
          </div>

          <div className="input-group">
            <input name="college" placeholder="College Name" onChange={handleChange} required />
            {errors.college && <span className="error">{errors.college}</span>}
          </div>

          <div className="input-group">
            <input name="department" placeholder="Department" onChange={handleChange} required />
            {errors.department && <span className="error">{errors.department}</span>}
          </div>

          <div className="checkbox-grid">
            {eventOptions.map(event => (
              <label key={event.name} className="checkbox-card">
                <input
                  type="checkbox"
                  value={event.name}
                  checked={formData.events.includes(event.name)}
                  onChange={handleCheckboxChange}
                />
                <span>{event.name}</span>
                <div className="tooltip">{event.desc}</div>
              </label>
            ))}
          </div>
          {errors.events && <span className="error">{errors.events}</span>}

       
            <button type="button" onClick={handleProceed} disabled={loading}>
              {loading ? <span className="loader"></span> : "➡️ Proceed"}
            </button>
          

          
        </form>

        {message && (
          <div className={`message ${message.includes("Error") ? "error-msg" : "success-msg"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
