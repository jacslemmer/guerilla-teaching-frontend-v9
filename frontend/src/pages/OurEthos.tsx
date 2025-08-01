import React from 'react';
import { Link } from 'react-router-dom';
import './OurEthos.css';

const OurEthos: React.FC = () => {
  return (
    <div className="our-ethos">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/about-us">About Us</Link> / Our Ethos
        </div>

        <div className="ethos-header">
          <h1>Our Ethos</h1>
          <p className="subtitle">The Core Values That Drive Our Educational Revolution</p>
        </div>

        <div className="ethos-content">
          <div className="mission-section">
            <div className="section-icon">🎯</div>
            <h2>Our Mission</h2>
            <p>
              To democratize quality education by breaking down barriers, fostering innovation, 
              and empowering learners to reach their full potential through accessible, 
              engaging, and effective learning experiences.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Innovation First</h3>
              <p>
                We believe in constantly pushing the boundaries of traditional education. 
                Our approach combines cutting-edge technology with proven pedagogical methods 
                to create learning experiences that are both effective and engaging.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Global Accessibility</h3>
              <p>
                Education should know no borders. We're committed to making quality learning 
                accessible to students worldwide, regardless of their geographical location, 
                economic background, or learning style.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Collaborative Learning</h3>
              <p>
                We foster a community of learners, educators, and innovators who work together 
                to create better educational outcomes. Collaboration is at the heart of 
                everything we do.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🎓</div>
              <h3>Excellence in Education</h3>
              <p>
                We maintain the highest standards of educational quality, continuously 
                improving our methods and materials to ensure the best possible learning 
                outcomes for our students.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Student-Centered</h3>
              <p>
                Every decision we make is guided by what's best for our students. We 
                prioritize their needs, learning styles, and success above all else.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">🚀</div>
              <h3>Continuous Growth</h3>
              <p>
                We believe in the power of lifelong learning, both for our students and 
                ourselves. We continuously evolve and adapt to meet the changing needs 
                of education.
              </p>
            </div>
          </div>

          <div className="philosophy-section">
            <h2>Our Educational Philosophy</h2>
            <div className="philosophy-content">
              <div className="philosophy-point">
                <h4>Personalized Learning</h4>
                <p>
                  We recognize that every learner is unique. Our approach adapts to individual 
                  learning styles, paces, and preferences, ensuring that each student receives 
                  the support they need to succeed.
                </p>
              </div>

              <div className="philosophy-point">
                <h4>Practical Application</h4>
                <p>
                  Learning should be relevant and applicable to real-world situations. 
                  We emphasize practical skills and knowledge that students can immediately 
                  use in their academic and professional lives.
                </p>
              </div>

              <div className="philosophy-point">
                <h4>Critical Thinking</h4>
                <p>
                  Beyond memorization, we teach students to think critically, analyze 
                  information, and develop their own informed perspectives on complex issues.
                </p>
              </div>

              <div className="philosophy-point">
                <h4>Technology Integration</h4>
                <p>
                  We leverage technology not just as a tool, but as a fundamental part of 
                  modern education, preparing students for a digital future while maintaining 
                  human connection and interaction.
                </p>
              </div>
            </div>
          </div>

          <div className="commitment-section">
            <h2>Our Commitment</h2>
            <div className="commitment-grid">
              <div className="commitment-item">
                <div className="commitment-number">01</div>
                <h4>Quality Assurance</h4>
                <p>Rigorous standards for all our educational content and delivery methods.</p>
              </div>
              <div className="commitment-item">
                <div className="commitment-number">02</div>
                <h4>Student Support</h4>
                <p>Comprehensive support systems to ensure every student can succeed.</p>
              </div>
              <div className="commitment-item">
                <div className="commitment-number">03</div>
                <h4>Innovation</h4>
                <p>Continuous improvement and adoption of the latest educational technologies.</p>
              </div>
              <div className="commitment-item">
                <div className="commitment-number">04</div>
                <h4>Accessibility</h4>
                <p>Making education available to learners from all backgrounds and abilities.</p>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h2>Join Our Educational Revolution</h2>
            <p>
              Ready to experience education that truly puts you first? Discover how our 
              ethos translates into real learning experiences.
            </p>
            <div className="cta-buttons">
              <Link to="/about-us/our-clients" className="btn-secondary">
                Meet Our Clients
              </Link>
              <Link to="/start-here" className="btn-primary">
                Start Your Journey
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurEthos; 