import React from 'react';
import { Link } from 'react-router-dom';
import './AboutUs.css';

const AboutUs: React.FC = () => {
  return (
    <div className="about-us">
      <div className="about-us-header">
        <div className="container">
          <h1>About Us</h1>
          <p className="subtitle">Revolutionizing Education Through Innovation</p>
        </div>
      </div>
      
      <div className="about-us-content">
        <div className="intro-section">
          <h2>Welcome to Guerilla Teaching</h2>
          <p>
            We are a passionate team of educators, innovators, and change-makers dedicated to 
            transforming the educational landscape. Our mission is to make quality education 
            accessible, engaging, and effective for learners worldwide.
          </p>
        </div>

        <div className="sub-pages-grid">
          <div className="sub-page-card">
            <div className="card-icon">🎯</div>
            <h3>Our Ethos</h3>
            <p>
              Discover the core values and principles that drive our educational philosophy 
              and shape everything we do.
            </p>
            <Link to="/about-us/our-ethos" className="btn-primary">
              Learn About Our Ethos
            </Link>
          </div>

          <div className="sub-page-card">
            <div className="card-icon">👥</div>
            <h3>Our Clients</h3>
            <p>
              Meet the diverse community of learners, educators, and institutions who trust 
              us with their educational journey.
            </p>
            <Link to="/about-us/our-clients" className="btn-primary">
              Meet Our Clients
            </Link>
          </div>
        </div>

        <div className="stats-section">
          <h2>Our Impact</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Students Worldwide</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="stat-label">Educational Partners</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">Success Rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Countries Served</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 