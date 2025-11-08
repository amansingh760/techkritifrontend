import React, { useState } from 'react';
import './App.css';
import emailjs from '@emailjs/browser';
import ParticleBackground from './ParticleBackground.jsx';

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

const initialFormData = {
  name: '',
  email: '',
  mobile_number: '',
  year: '',
  college: '',
  department: '',
  events: [],
  collegeChoice: ''
};

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
  //  let amountInPaise = 10000;

  // if (formData.college === "KGI") {
  //   amountInPaise = 10000;
  // } else {
  //   amountInPaise = 20000;
  // }
  let temp_id = "null";
  let formLinksText ;
  const options = {
    key: 'rzp_test_R621lPtd7qF7HB', //TEST KEY
    //key: 'rzp_live_Rb9HzbTHGhigs9', //ACTUAL KEY
    amount: 15000, // ₹100 in paise
    currency: 'INR',
    name: 'Techkriti 2.0',
    description: 'Event Registration Fee',
    handler: async function (response) {
      const paymentId = response.razorpay_payment_id;
      setUTR(paymentId); // Save payment ID as UTR

      const targetEvents = ["Hackathon", "Tech Exhibition", "Startup Expo", "Project Showcase"];

      // const eventFormLinks = {
      //       "Hackathon": "https://forms.gle/yourHackathonFormLink",
      //       "Tech Exhibition": "https://forms.gle/GYthnuQYopN7bywW9",
      //       "Startup Expo": "https://forms.gle/yourStartupExpoFormLink",
      //       "Project Showcase": "https://forms.gle/yourProjectShowcaseFormLink"
      //     };


        if (formData.events.some(event => targetEvents.includes(event))) {
          // Do something
          temp_id = "template_ydjuree";
          
          // Filter selected events that have form links
          // const selectedEventsWithForms = formData.events.find(event => eventFormLinks[event]);

          // // Build the formatted message
          // formLinksText = selectedEventsWithForms
          //   .map(event => `${event}: ${eventFormLinks[event]}`)
          //   .join("\n");
        }
        else{
          temp_id="template_kk8m6od";
        }


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

        const res = await fetch('https://techkritibackend1.onrender.com/register', {
          method: 'POST',
          body: formPayload
        });

        const text = await res.text();
        setMessage(text);

        // Send confirmation email
        emailjs.send('service_vl8kxwz',temp_id, {
          to_name: formData.name,
          to_email: formData.email,
          to_year: formData.year,
          to_department: formData.department,
          to_mobile: formData.mobile_number,
          to_collage: formData.college,
          to_events: formData.events,
          to_rid: text.match(/techkriti2\.0-\d{4}/)?.[0],
          to_utr: paymentId,
          to_form: formLinksText
        }, 'S-B51AurzarNp9Qq9')
        .then(() => console.log('Confirmation email sent'))
        .catch(err => console.error('EmailJS error:', err));
      } catch (err) {
        setMessage("Error submitting the form. Please try again later.");
      } finally {
        setLoading(false);
        setFormData(initialFormData); // ✅ clear form
        setUTR('');
        setErrors({});
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

      const response = await fetch('https://techkritibackend1.onrender.com//register', {
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
      <ParticleBackground />
      <div className="form-container">
        {/* <h1>🎉 Tech Event Registration</h1> */}
        {/* <img src="logo2.png" alt="Techkriti Logo" className="logo" /> */}
        <div className='mainlogo'><img src="logo2.png" alt="Techkriti Logo" /></div>
        <p className="subtitle">Join the most exciting tech fest of the year!</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input name="name" placeholder="Full Name" onChange={handleChange} autoComplete="off" required />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>

          <div className="input-group">
          <input name="email" placeholder="Email Address" type="email" onChange={handleChange} autoComplete="off" required />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="input-group">
            <input name="mobile_number" placeholder="Mobile Number" onChange={handleChange} autoComplete="off" required />
            {errors.mobile_number && <span className="error">{errors.mobile_number}</span>}
          </div>

          <div className="input-group">
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              autoComplete="off"
              required
            >
              <option >-- Select year--</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              </select>
            {/* <input name="year" placeholder="Year (e.g., 1st, 2nd, 3rd, 4th)" onChange={handleChange} autoComplete="off" required /> */}
            {errors.year && <span className="error">{errors.year}</span>}
          </div>



          <div className="input-group">
          <select
            name="collegeChoice"
            value={formData.collegeChoice}
            onChange={(e) => {
              const choice = e.target.value;
              setFormData({
                ...formData,
                collegeChoice: choice,
                college: choice === "KGI" ? "KGI" : ""
              });
            }}
            required
          >
            <option  >-- Select College --</option>
            <option value="KGI">Kashi Group of Instituion</option>
            <option value="Others">Others</option>
          </select>
          {errors.college && <span className="error">{errors.college}</span>}
          </div>

        {formData.collegeChoice === "Others" && (
          <div className="input-group">
            <input
              className="input-group"
              placeholder="Enter your college name"
              value={formData.college}
              onChange={(e) =>
                setFormData({ ...formData, college: e.target.value })
              }
              required
            />
          </div>
        )}


                   {/* <div className="input-group">
           <label htmlFor="college">College</label>
            <select
              name="college"
              value={formData.college}
              onChange={handleChange}
              required
            >
              <option value="" disable hidden>-- Select College --</option>
              <option value="KGI">KGI</option>
              <option value="Others">Others</option>
            </select>
            {errors.college && <span className="error">{errors.college}</span>}
          </div>

          {formData.college === "Others" && (
            <div className="input-group">
              <input
                name="otherCollege"
                placeholder="Enter your college name"
                onChange={(e) =>
                  setFormData({ ...formData, college: e.target.value })
                }
                required
              />
            </div>
          )}*/}


          {/*<div className="input-group">
            <input name="college" placeholder="College Name" onChange={handleChange} required />
            {errors.college && <span className="error">{errors.college}</span>}
          </div>

          <div className="input-group">
            <input name="department" placeholder="Department" onChange={handleChange} required />
            {errors.department && <span className="error">{errors.department}</span>}
          </div>
          */}

         <div className="input-group">
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              autoComplete="off"
              required
            >
              <option >-- Select Course--</option>
              <option value="B.tech">B.tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="POLYTECHNIC">POLYTECHNIC</option>
              <option value="BBA">BBA</option>
              <option value="MBA">MBA</option>
              <option value="B.COM">B.COM</option>
              <option value="M.COM">M.COM</option>
              <option value="B pharma">B pharma</option>
              <option value="M pharma">M pharma</option>
              <option value="BA">BA</option>
              <option value="B.sc">B.sc</option>
              <option value="M.sc">M.sc</option>
              <option value="Others">Others</option>
            </select>
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

       
            <button  type="button" /*onClick={handleProceed}*/ autoComplete="off" disabled={loading}>
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
