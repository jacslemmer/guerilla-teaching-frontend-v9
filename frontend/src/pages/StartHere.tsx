import React from 'react';
import { Link } from 'react-router-dom';
import './StartHere.css';

const StartHere: React.FC = () => {
  return (
    <div className="start-here">
      <div className="hero-section">
        <div className="container">
          <h1>Start Here</h1>
          <p>Begin your educational journey with Guerilla Teaching</p>
        </div>
      </div>
      
      <div className="content-section">
        <div className="container">
          <div className="start-options">
            <div className="option-card">
              <h3>Frequently Asked Questions</h3>
              <p>Find answers to common questions about our teaching methods and programs.</p>
              <Link to="/start-here/faqs" className="option-link">
                View FAQs
              </Link>
            </div>
            
            <div className="option-card">
              <h3>Routes to Matriculation</h3>
              <p>Explore different pathways to achieve your matriculation certificate.</p>
              <Link to="/start-here/routes" className="option-link">
                View Routes
              </Link>
            </div>
            
            <div className="option-card">
              <h3>eLearning Guide</h3>
              <p>Learn how to navigate our online learning platform effectively.</p>
              <Link to="/start-here/elearning" className="option-link">
                View Guide
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartHere; 