import Image from "next/image";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />

      <section className="hero">
        <div className="hero-text">
          <h1>School Management System</h1>

          <p>
            Madares helps schools manage students,parent, teachers, and
            communication efficiently. Stay organized, connected, and in control
            with a modern platform built for education.
          </p>

          <div className="hero-btn">
            <a href="/register" className="btn-warning">
              Get Started
            </a>
            {/* <a href="/about" className="btn-primary">
              Learn More
            </a> */}
          </div>
        </div>

        <div className="hero-image">
          <Image
            src="/istockphoto-2249432606-1024x1024.jpg"
            width={300}
            height={300}
            alt="School system"
            priority
          />
        </div>
      </section>
      <div className="container my-5">
        <div className="description text-center mb-5">
          <h2>One platform for everything</h2>
          <p>
            From lessons delivery to parent tracking child performance and
            communication with teachers and staff, Madares has you covered.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="feature-card">
              <h4>📚</h4>
              <h5>Smart lesson library</h5>
              <p>
                Upload videos, quizzes, and reading materials. Students learn at
                their own pace with progress tracking built in.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="feature-card">
              <h4>📅</h4>
              <h5>Class scheduling</h5>
              <p>
                Visual weekly schedules for every role. Automated reminders keep
                everyone on time.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="feature-card">
              <h4>💬</h4> 
              <h5>Unified messaging</h5>
              <p>
                Students, teachers, parents, and admins communicate in one
                place.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-3">
            <div className="feature-card">
              <h4>📝</h4>
              <h5>Assignment tracking</h5>
              <p>
                Create, submit, and grade assignments online with deadline
                reminders.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="container my-5 bg-light p-5 rounded">
        <h2 className="text-center mb-4">A perfect experience for everyone</h2>
        <p>
          Madares adapts to who you are. Every user gets a tailored dashboard
          built for their exact needs.
        </p>
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <div className="feature-card">
              <h3>🛡️</h3>
              <h2>Admin</h2>
              <p>
                Full control over users, classes, departments, and system
                settings from one command center. User management Analytics &
                reports System settings
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="feature-card">
              <h3>👩‍🏫</h3>
              <h2>Teacher</h2>
              <p>
                Manage classes, upload lessons, track student performance, and
                communicate with parents. Gradebook Lesson builder Class
                schedule
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="feature-card">
              <h3>🎒</h3>
              <h2>Student</h2>
              <p>
                Watch lessons, submit assignments, track your own progress, and
                earn badges along the way. Progress tracker Lesson access
                Achievement badges
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="feature-card">
              <h3>👨‍👩‍👧</h3>
              <h2>Parent</h2>
              <p>
                Monitor your child's grades, attendance, and school notices —
                always stay in the loop. Attendance view Grade reports Teacher
                messaging
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
