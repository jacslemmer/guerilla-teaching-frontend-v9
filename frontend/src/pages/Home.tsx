import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import studentHero from '../assets/student-laptop-hero.jpg';
import serviceRemoteLearning from '../assets/service-remote-learning-svg.png';
import serviceExamPrep from '../assets/service-exam-prep-svg.jpg';
import serviceCurriculumDesign from '../assets/service-curriculum-design-svg.jpg';
import serviceConsultancy from '../assets/service-consultancy-svg.jpg';

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactForm, setContactForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    program: '', 
    message: '' 
  });
  const [submitted, setSubmitted] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [contactError, setContactError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleContactInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitted(true);
    // Here you would send the form data to your backend or email service
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.program || !contactForm.message) {
      setContactError('Please fill in all required fields.');
      return;
    }
    setContactError('');
    setContactSubmitted(true);
    // Here you would send the contact form data to your backend or email service
  };

  return (
    <div className="home">
      <div className="hero-section student-hero" style={{ background: `url(${studentHero}) center 30%/cover no-repeat`, height: '900px' }}>
        <div className="hero-content">
          <div className="hero-text-block">
            <h2>Learn. Anywhere. Anytime.</h2>
            <h1>Guerilla Teaching</h1>
            <h3>Our Mission:</h3>
            <p>
              To provide affordable access to quality teaching and learning materials, supporting individuals and institutions, homeschoolers and cottage schools in their educational journeys.
            </p>
            <button className="enroll-btn" onClick={() => setShowModal(true)}>
              Enroll Now
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="enroll-modal-overlay">
          <div className="enroll-modal">
            <button className="close-modal" onClick={() => { setShowModal(false); setSubmitted(false); }}>&times;</button>
            {!submitted ? (
              <form className="enroll-form" onSubmit={handleSubmit}>
                <h2>Enroll Now</h2>
                <div className="form-group">
                  <label>Your Name *</label>
                  <input type="text" name="name" value={form.name} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Your E-mail Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Subject *</label>
                  <input type="text" name="subject" value={form.subject} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Message (optional)</label>
                  <textarea name="message" value={form.message} onChange={handleInputChange} rows={4} />
                </div>
                {error && <div className="form-error">{error}</div>}
                <button type="submit" className="submit-btn">Submit</button>
              </form>
            ) : (
              <div className="enroll-confirmation">
                <h2>Thank you for your interest!</h2>
                <p>We have received your details and will contact you soon.</p>
                <button className="close-btn" onClick={() => setShowModal(false)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}

      <section className="services-section">
        <h2>OUR SERVICES</h2>
        <div className="services-grid">
          <Link to="/learning-portal" className="service-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={serviceRemoteLearning} alt="Remote Learning Icon" className="service-icon remote-learning" />
            <h3>Remote Learning</h3>
            <p>Learn from anywhere in the world on desktop, tablet or mobile phone with an Internet connection. Our Learning Portal provides Pearson Edexcel IGCSE and IAS courses for examination success. Available on subscription to individuals, or by license to Tutors.</p>
            <div className="service-highlight">Teach or Learn from Anywhere</div>
          </Link>

          <Link to="/learning-portal" className="service-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={serviceExamPrep} alt="Examination Preparation Icon" className="service-icon" />
            <h3>Examination Preparation</h3>
            <p>Expert teaching and assessment, including MOCK examinations for International GCSE and AS Levels, accepted by local and International Universities world wide.</p>
            <div className="service-highlight">Boost Grades with Expert Help</div>
          </Link>

          <Link to="/start-here/elearning" className="service-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={serviceCurriculumDesign} alt="Curriculum Design Icon" className="service-icon curriculum-design" />
            <h3>Curriculum Design</h3>
            <p>Bespoke Learning Resources and Virtual Learning Environments tailored for your specific needs. Moodle experts will design your schools VLE improving learning outcomes for your high school students.</p>
            <div className="service-highlight">Virtual Classrooms Built for You</div>
          </Link>

          <Link to="/start-here/routes" className="service-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src={serviceConsultancy} alt="Consultancy Icon" className="service-icon consultancy" />
            <h3>Consultancy</h3>
            <p>Navigating the challenges of international examinations, Matric Exemption, the Two sitting Rule and University entrance requirements.</p>
            <div className="service-highlight">Get Expert Guidance Now</div>
          </Link>
        </div>
      </section>

      <section className="contact-section">
        <div className="container">
          <h2>Contact Us</h2>
          <p>Get in touch with us to learn more about our programs and start your educational journey</p>
          
          <div className="contact-content">
            <div className="contact-info">
              <h3>Get In Touch</h3>
              <div className="contact-item">
                <strong>Email:</strong>
                <p>info@guerillateaching.africa</p>
              </div>
              <div className="contact-item">
                <strong>Phone:</strong>
                <p>+27 123 456 789</p>
              </div>
              <div className="contact-item">
                <strong>Address:</strong>
                <p>123 Education Street<br />Johannesburg, South Africa</p>
              </div>
              <div className="contact-item">
                <strong>Office Hours:</strong>
                <p>Monday - Friday: 8:00 AM - 6:00 PM<br />Saturday: 9:00 AM - 2:00 PM</p>
              </div>
            </div>
            
            <div className="contact-form">
              <h3>Send us a Message</h3>
              {!contactSubmitted ? (
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <input 
                      type="text" 
                      name="name"
                      placeholder="Your Name" 
                      value={contactForm.name}
                      onChange={handleContactInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="email" 
                      name="email"
                      placeholder="Your Email" 
                      value={contactForm.email}
                      onChange={handleContactInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="Your Phone Number" 
                      value={contactForm.phone}
                      onChange={handleContactInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <select 
                      name="program"
                      value={contactForm.program}
                      onChange={handleContactInputChange}
                      required
                    >
                      <option value="">Select a Program</option>
                      <option value="full-time">Full-Time Matriculation</option>
                      <option value="part-time">Part-Time Matriculation</option>
                      <option value="online">Online Matriculation</option>
                      <option value="accelerated">Accelerated Program</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <textarea 
                      name="message"
                      placeholder="Your Message" 
                      rows={5} 
                      value={contactForm.message}
                      onChange={handleContactInputChange}
                      required
                    ></textarea>
                  </div>
                  {contactError && <div className="form-error">{contactError}</div>}
                  <button type="submit" className="submit-button">Send Message</button>
                </form>
              ) : (
                <div className="contact-confirmation">
                  <h4>Thank you for your message!</h4>
                  <p>We have received your inquiry and will get back to you soon.</p>
                  <button 
                    className="submit-button" 
                    onClick={() => {
                      setContactSubmitted(false);
                      setContactForm({ name: '', email: '', phone: '', program: '', message: '' });
                    }}
                  >
                    Send Another Message
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 