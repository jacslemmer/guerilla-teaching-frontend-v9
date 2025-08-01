import React from 'react';
import { Link } from 'react-router-dom';
import './OurClients.css';

const OurClients: React.FC = () => {
  return (
    <div className="our-clients">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/about-us">About Us</Link> / Our Clients
        </div>

        <div className="clients-header">
          <h1>Our Clients</h1>
          <p className="subtitle">Meet the Diverse Community That Trusts Guerilla Teaching</p>
        </div>

        <div className="clients-content">
          <div className="intro-section">
            <h2>Who We Serve</h2>
            <p>
              Our client base spans across continents, representing a diverse spectrum of 
              learners, educators, and institutions. From individual students to large 
              educational organizations, we're proud to serve those who share our vision 
              of accessible, quality education.
            </p>
          </div>

          <div className="client-categories">
            <h2>Our Client Categories</h2>
            <div className="categories-grid">
              <div className="category-card">
                <div className="category-icon">👨‍🎓</div>
                <h3>Individual Students</h3>
                <p>
                  High school students, university students, and adult learners seeking 
                  personalized educational support and guidance.
                </p>
                <div className="category-stats">
                  <span>8,000+ Students</span>
                  <span>95% Success Rate</span>
                </div>
              </div>

              <div className="category-card">
                <div className="category-icon">🏫</div>
                <h3>Schools & Institutions</h3>
                <p>
                  Primary schools, secondary schools, and educational institutions looking 
                  to enhance their curriculum and teaching methods.
                </p>
                <div className="category-stats">
                  <span>200+ Schools</span>
                  <span>30+ Countries</span>
                </div>
              </div>

              <div className="category-card">
                <div className="category-icon">👨‍🏫</div>
                <h3>Educators & Teachers</h3>
                <p>
                  Teachers, tutors, and educational professionals seeking professional 
                  development and innovative teaching resources.
                </p>
                <div className="category-stats">
                  <span>1,500+ Educators</span>
                  <span>Professional Development</span>
                </div>
              </div>

              <div className="category-card">
                <div className="category-icon">👨‍👩‍👧‍👦</div>
                <h3>Parents & Families</h3>
                <p>
                  Parents seeking educational support for their children and families 
                  looking for quality learning resources.
                </p>
                <div className="category-stats">
                  <span>3,000+ Families</span>
                  <span>Home Learning Support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="testimonials-section">
            <h2>What Our Clients Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>
                    "Guerilla Teaching transformed my approach to education. Their innovative 
                    methods helped my students achieve remarkable results, and the support 
                    team is always there when we need them."
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">👨‍🏫</div>
                  <div className="author-info">
                    <h4>Sarah Johnson</h4>
                    <span>Mathematics Teacher, St. Mary's High School</span>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>
                    "As a parent, I was struggling to help my daughter with her studies. 
                    Guerilla Teaching provided the perfect solution with their personalized 
                    approach and excellent resources."
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">👩‍👧</div>
                  <div className="author-info">
                    <h4>Michael Chen</h4>
                    <span>Parent, International Student</span>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>
                    "The quality of education I received through Guerilla Teaching exceeded 
                    my expectations. Their online platform is intuitive, and the teachers 
                    are incredibly knowledgeable and supportive."
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">👨‍🎓</div>
                  <div className="author-info">
                    <h4>Emma Rodriguez</h4>
                    <span>International GCSE Student</span>
                  </div>
                </div>
              </div>

              <div className="testimonial-card">
                <div className="testimonial-content">
                  <p>
                    "Our school has seen a significant improvement in student performance 
                    since partnering with Guerilla Teaching. Their resources and training 
                    have been invaluable to our staff."
                  </p>
                </div>
                <div className="testimonial-author">
                  <div className="author-avatar">🏫</div>
                  <div className="author-info">
                    <h4>Dr. James Wilson</h4>
                    <span>Principal, Riverside Academy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="success-stories">
            <h2>Success Stories</h2>
            <div className="stories-grid">
              <div className="story-card">
                <div className="story-header">
                  <div className="story-icon">📈</div>
                  <h3>Academic Excellence</h3>
                </div>
                <p>
                  Maria, a 16-year-old student from Brazil, improved her mathematics 
                  grades from C to A+ within 6 months using our personalized learning 
                  approach.
                </p>
                <div className="story-metrics">
                  <span>Grade Improvement: C → A+</span>
                  <span>Time: 6 months</span>
                </div>
              </div>

              <div className="story-card">
                <div className="story-header">
                  <div className="story-icon">🌍</div>
                  <h3>Global Reach</h3>
                </div>
                <p>
                  A rural school in Kenya increased their student enrollment by 40% 
                  after implementing our digital learning platform and teacher training.
                </p>
                <div className="story-metrics">
                  <span>Enrollment Increase: 40%</span>
                  <span>Location: Rural Kenya</span>
                </div>
              </div>

              <div className="story-card">
                <div className="story-header">
                  <div className="story-icon">🎓</div>
                  <h3>University Success</h3>
                </div>
                <p>
                  Over 85% of our International AS Level students gained admission to 
                  their first-choice universities, including top institutions worldwide.
                </p>
                <div className="story-metrics">
                  <span>University Acceptance: 85%</span>
                  <span>Program: AS Levels</span>
                </div>
              </div>
            </div>
          </div>

          <div className="partnership-section">
            <h2>Partnership Opportunities</h2>
            <p>
              We're always looking to expand our network of educational partners. 
              Whether you're an individual educator, a school, or an educational 
              organization, we'd love to explore how we can work together.
            </p>
            <div className="partnership-options">
              <div className="partnership-option">
                <h4>For Schools</h4>
                <ul>
                  <li>Curriculum enhancement</li>
                  <li>Teacher training programs</li>
                  <li>Digital learning integration</li>
                  <li>Student support services</li>
                </ul>
              </div>
              <div className="partnership-option">
                <h4>For Educators</h4>
                <ul>
                  <li>Professional development</li>
                  <li>Resource sharing</li>
                  <li>Teaching methodology training</li>
                  <li>Community collaboration</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h2>Join Our Community</h2>
            <p>
              Ready to experience the Guerilla Teaching difference? Whether you're a 
              student, educator, or institution, we're here to support your educational journey.
            </p>
            <div className="cta-buttons">
              <Link to="/start-here" className="btn-secondary">
                Get Started
              </Link>
              <Link to="/can-we-help" className="btn-primary">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurClients; 