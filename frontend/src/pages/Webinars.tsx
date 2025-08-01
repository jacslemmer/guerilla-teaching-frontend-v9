import React from 'react';
import { Link } from 'react-router-dom';
import './Webinars.css';

interface Webinar {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  speaker: string;
  category: string;
  status: 'upcoming' | 'past' | 'live';
  registrationRequired?: boolean;
  maxAttendees?: number;
  currentAttendees?: number;
}

const Webinars: React.FC = () => {
  const webinars: Webinar[] = [
    {
      id: 1,
      title: "IGCSE Mathematics: Mastering Problem-Solving Techniques",
      description: "Join us for an interactive session where we'll explore advanced problem-solving strategies for IGCSE Mathematics. Learn how to approach complex questions with confidence and precision.",
      date: "March 25, 2025",
      time: "14:00 GMT",
      duration: "90 minutes",
      speaker: "Dr. Sarah Johnson",
      category: "Mathematics",
      status: "upcoming",
      registrationRequired: true,
      maxAttendees: 100,
      currentAttendees: 67
    },
    {
      id: 2,
      title: "Study Skills Masterclass: Effective Learning Strategies",
      description: "Discover proven study techniques that can transform your learning experience. This session covers active recall, spaced repetition, and other evidence-based learning methods.",
      date: "March 28, 2025",
      time: "16:00 GMT",
      duration: "60 minutes",
      speaker: "Emma Rodriguez",
      category: "Study Skills",
      status: "upcoming",
      registrationRequired: true,
      maxAttendees: 150,
      currentAttendees: 89
    },
    {
      id: 3,
      title: "University Applications: Writing Winning Personal Statements",
      description: "Learn the art of crafting compelling personal statements that stand out to university admissions committees. Get insider tips from experienced admissions counselors.",
      date: "April 2, 2025",
      time: "15:00 GMT",
      duration: "75 minutes",
      speaker: "Dr. James Wilson",
      category: "Career Guidance",
      status: "upcoming",
      registrationRequired: true,
      maxAttendees: 80,
      currentAttendees: 45
    },
    {
      id: 4,
      title: "AS Level Physics: Understanding Complex Concepts",
      description: "Break down challenging physics concepts into manageable components. Perfect for students preparing for AS Level examinations.",
      date: "March 20, 2025",
      time: "14:30 GMT",
      duration: "90 minutes",
      speaker: "Dr. Lisa Thompson",
      category: "Physics",
      status: "past"
    },
    {
      id: 5,
      title: "Exam Stress Management: Techniques for Success",
      description: "Learn practical strategies for managing exam anxiety and performing your best under pressure. Includes breathing exercises and mental preparation techniques.",
      date: "March 18, 2025",
      time: "16:00 GMT",
      duration: "60 minutes",
      speaker: "Dr. Robert Kim",
      category: "Study Skills",
      status: "past"
    },
    {
      id: 6,
      title: "Chemistry Practical Skills: Lab Techniques and Safety",
      description: "Essential guidance for chemistry practical work, including safety protocols, experimental techniques, and data analysis methods.",
      date: "April 5, 2025",
      time: "13:00 GMT",
      duration: "120 minutes",
      speaker: "Prof. Amanda Foster",
      category: "Chemistry",
      status: "upcoming",
      registrationRequired: true,
      maxAttendees: 60,
      currentAttendees: 23
    }
  ];

  const upcomingWebinars = webinars.filter(webinar => webinar.status === 'upcoming');
  const pastWebinars = webinars.filter(webinar => webinar.status === 'past');

  return (
    <div className="webinars">
      <div className="breadcrumb">
        <div className="container">
          <Link to="/resources">← Back to Resources</Link>
        </div>
      </div>
      
      <div className="hero-section">
        <div className="container">
          <h1>Educational Webinars</h1>
          <p>Join live interactive sessions with expert educators and fellow students</p>
        </div>
      </div>
      
      <div className="content-section">
        <div className="container">
          <div className="webinars-intro">
            <h2>Live Learning Sessions</h2>
            <p>Connect with expert educators in real-time through our interactive webinars. Ask questions, participate in discussions, and gain valuable insights to enhance your academic journey.</p>
          </div>
          
          <div className="webinar-stats">
            <div className="stat-card">
              <div className="stat-number">{upcomingWebinars.length}</div>
              <div className="stat-label">Upcoming Sessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{pastWebinars.length}</div>
              <div className="stat-label">Past Sessions</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Students Attended</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">15+</div>
              <div className="stat-label">Expert Speakers</div>
            </div>
          </div>
          
          <div className="upcoming-webinars">
            <h2>Upcoming Webinars</h2>
            <div className="webinars-grid">
              {upcomingWebinars.map(webinar => (
                <div key={webinar.id} className="webinar-card upcoming">
                  <div className="webinar-header">
                    <span className="status-badge upcoming">Upcoming</span>
                    <span className="category-tag">{webinar.category}</span>
                  </div>
                  <h3>{webinar.title}</h3>
                  <p className="webinar-description">{webinar.description}</p>
                  <div className="webinar-details">
                    <div className="detail-item">
                      <strong>Date:</strong> {webinar.date}
                    </div>
                    <div className="detail-item">
                      <strong>Time:</strong> {webinar.time}
                    </div>
                    <div className="detail-item">
                      <strong>Duration:</strong> {webinar.duration}
                    </div>
                    <div className="detail-item">
                      <strong>Speaker:</strong> {webinar.speaker}
                    </div>
                  </div>
                  {webinar.registrationRequired && (
                    <div className="registration-info">
                      <div className="attendees-info">
                        <span>{webinar.currentAttendees} / {webinar.maxAttendees} registered</span>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{width: `${(webinar.currentAttendees! / webinar.maxAttendees!) * 100}%`}}
                          ></div>
                        </div>
                      </div>
                      <button className="register-btn">Register Now</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="past-webinars">
            <h2>Past Webinars</h2>
            <p>Missed a session? Access recordings and materials from our previous webinars.</p>
            <div className="webinars-grid">
              {pastWebinars.map(webinar => (
                <div key={webinar.id} className="webinar-card past">
                  <div className="webinar-header">
                    <span className="status-badge past">Past</span>
                    <span className="category-tag">{webinar.category}</span>
                  </div>
                  <h3>{webinar.title}</h3>
                  <p className="webinar-description">{webinar.description}</p>
                  <div className="webinar-details">
                    <div className="detail-item">
                      <strong>Date:</strong> {webinar.date}
                    </div>
                    <div className="detail-item">
                      <strong>Duration:</strong> {webinar.duration}
                    </div>
                    <div className="detail-item">
                      <strong>Speaker:</strong> {webinar.speaker}
                    </div>
                  </div>
                  <div className="webinar-actions">
                    <button className="watch-recording-btn">Watch Recording</button>
                    <button className="download-materials-btn">Download Materials</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="webinar-features">
            <h2>Why Join Our Webinars?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <h4>Expert Insights</h4>
                <p>Learn directly from qualified educators with years of experience in international education.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💬</div>
                <h4>Interactive Q&A</h4>
                <p>Ask questions in real-time and get immediate responses from our expert speakers.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👥</div>
                <h4>Community Learning</h4>
                <p>Connect with fellow students and share experiences in a supportive learning environment.</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📱</div>
                <h4>Flexible Access</h4>
                <p>Join from anywhere with an internet connection - desktop, tablet, or mobile device.</p>
              </div>
            </div>
          </div>
          
          <div className="webinar-calendar">
            <h2>Webinar Calendar</h2>
            <p>Stay organized with our upcoming webinar schedule. Add sessions to your calendar and never miss an important learning opportunity.</p>
            <div className="calendar-cta">
              <button className="calendar-btn">View Full Calendar</button>
              <button className="reminder-btn">Set Reminders</button>
            </div>
          </div>
          
          <div className="related-resources">
            <h3>Explore More Resources</h3>
            <div className="resource-links">
              <Link to="/resources/articles" className="resource-link">
                <span>📚</span>
                <div>
                  <h4>Articles</h4>
                  <p>Read educational insights</p>
                </div>
              </Link>
              <Link to="/learning-portal" className="resource-link">
                <span>🎓</span>
                <div>
                  <h4>Learning Portal</h4>
                  <p>Access our programs</p>
                </div>
              </Link>
              <Link to="/start-here" className="resource-link">
                <span>🚀</span>
                <div>
                  <h4>Start Here</h4>
                  <p>Begin your journey</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Webinars; 