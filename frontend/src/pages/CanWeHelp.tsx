import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CanWeHelp.css';

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const CanWeHelp: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      id: 1,
      question: "How do I enroll in your IGCSE or AS Level programs?",
      answer: "You can enroll in our programs by contacting us through our contact form, email, or phone. We'll schedule a consultation to discuss your needs and guide you through the enrollment process.",
      category: "enrollment"
    },
    {
      id: 2,
      question: "What are the costs for your educational programs?",
      answer: "Our pricing varies depending on the program and duration. Please visit our Pricing 2025 page for detailed information about our different packages and payment plans.",
      category: "pricing"
    },
    {
      id: 3,
      question: "Do you offer online learning options?",
      answer: "Yes, we offer comprehensive online learning options through our Learning Portal. You can access courses, materials, and support from anywhere with an internet connection.",
      category: "learning"
    },
    {
      id: 4,
      question: "How can I access the webinars and articles?",
      answer: "Our webinars and articles are available through our Resources section. You can register for upcoming webinars and browse our article library for educational content.",
      category: "resources"
    },
    {
      id: 5,
      question: "What support do you provide for university applications?",
      answer: "We offer comprehensive support for university applications, including guidance on personal statements, course selection, and application strategies. Check our Resources section for detailed articles and webinars.",
      category: "career"
    },
    {
      id: 6,
      question: "Can I get a refund if I'm not satisfied?",
      answer: "We offer a satisfaction guarantee. If you're not completely satisfied with our services within the first 30 days, we'll work with you to address your concerns or provide a refund.",
      category: "pricing"
    }
  ];

  const supportOptions = [
    {
      icon: "📧",
      title: "Email Support",
      description: "Send us a detailed message and we'll respond within 24 hours",
      action: "Send Email",
      link: "mailto:support@guerillateaching.africa"
    },
    {
      icon: "📞",
      title: "Phone Support",
      description: "Speak directly with our support team during business hours",
      action: "Call Now",
      link: "tel:+27123456789"
    },
    {
      icon: "💬",
      title: "Live Chat",
      description: "Get instant help through our live chat system",
      action: "Start Chat",
      link: "#"
    },
    {
      icon: "📋",
      title: "Contact Form",
      description: "Fill out our detailed contact form for comprehensive support",
      action: "Fill Form",
      link: "/contact"
    }
  ];

  const categories = [
    { id: 'general', name: 'General Questions', icon: '❓' },
    { id: 'enrollment', name: 'Enrollment', icon: '📝' },
    { id: 'pricing', name: 'Pricing & Payment', icon: '💰' },
    { id: 'learning', name: 'Learning Support', icon: '📚' },
    { id: 'resources', name: 'Resources', icon: '📖' },
    { id: 'career', name: 'Career Guidance', icon: '🎯' }
  ];

  const filteredFAQs = faqs.filter(faq => activeTab === 'general' || faq.category === activeTab);

  return (
    <div className="can-we-help">
      <div className="hero-section">
        <div className="container">
          <h1>Can We Help?</h1>
          <p>We're here to support your educational journey every step of the way</p>
        </div>
      </div>
      
      <div className="content-section">
        <div className="container">
          <div className="help-intro">
            <h2>How Can We Assist You?</h2>
            <p>Whether you have questions about our programs, need technical support, or want to learn more about our services, we're here to help. Choose the support option that works best for you.</p>
          </div>
          
          <div className="support-options">
            <h2>Get Support</h2>
            <div className="support-grid">
              {supportOptions.map((option, index) => (
                <div key={index} className="support-card">
                  <div className="support-icon">{option.icon}</div>
                  <h3>{option.title}</h3>
                  <p>{option.description}</p>
                  <a href={option.link} className="support-action">
                    {option.action}
                  </a>
                </div>
              ))}
            </div>
          </div>
          
          <div className="faq-section">
            <h2>Frequently Asked Questions</h2>
            <p>Find quick answers to common questions below. Can't find what you're looking for? Contact us directly.</p>
            
            <div className="faq-tabs">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`faq-tab ${activeTab === category.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(category.id)}
                >
                  <span className="tab-icon">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
            
            <div className="faq-list">
              {filteredFAQs.map(faq => (
                <div key={faq.id} className="faq-item">
                  <button
                    className="faq-question"
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                  >
                    <span>{faq.question}</span>
                    <span className="faq-toggle">
                      {expandedFAQ === faq.id ? '−' : '+'}
                    </span>
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="faq-answer">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="contact-info">
            <h2>Contact Information</h2>
            <div className="contact-grid">
              <div className="contact-card">
                <div className="contact-icon">📧</div>
                <h3>Email</h3>
                <p>support@guerillateaching.africa</p>
                <p>info@guerillateaching.africa</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">📞</div>
                <h3>Phone</h3>
                <p>+27 12 345 6789</p>
                <p>Mon-Fri: 8:00 AM - 6:00 PM GMT</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">🌐</div>
                <h3>Website</h3>
                <p>guerillateaching.africa</p>
                <p>24/7 online support</p>
              </div>
              <div className="contact-card">
                <div className="contact-icon">📍</div>
                <h3>Location</h3>
                <p>South Africa</p>
                <p>International online services</p>
              </div>
            </div>
          </div>
          
          <div className="helpful-links">
            <h2>Helpful Links</h2>
            <div className="links-grid">
              <Link to="/start-here" className="helpful-link">
                <span>🚀</span>
                <div>
                  <h4>Start Here</h4>
                  <p>Begin your learning journey</p>
                </div>
              </Link>
              <Link to="/learning-portal" className="helpful-link">
                <span>📚</span>
                <div>
                  <h4>Learning Portal</h4>
                  <p>Access our educational programs</p>
                </div>
              </Link>
              <Link to="/resources" className="helpful-link">
                <span>📖</span>
                <div>
                  <h4>Resources</h4>
                  <p>Articles, webinars, and more</p>
                </div>
              </Link>
              <Link to="/pricing-2025" className="helpful-link">
                <span>💰</span>
                <div>
                  <h4>Pricing</h4>
                  <p>View our program costs</p>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="feedback-section">
            <h2>We Value Your Feedback</h2>
            <p>Help us improve our services by sharing your experience and suggestions.</p>
            <div className="feedback-actions">
              <button className="feedback-btn">Share Feedback</button>
              <button className="suggestion-btn">Submit Suggestion</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanWeHelp; 