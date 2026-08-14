import AppointmentForm from "./components/AppointmentForm";
import ConditionsMarquee from "./components/ConditionsMarquee";
import Reveal from "./components/Reveal";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <img
              className="logo logo-img"
              src="/logo.jpg"
              alt="Homoeopathy Health & Healing Logo"
            />
            <h1>
              <span className="blue">Rehman</span>
              <br />
              Homeopathic
              <br />
              <span className="red">Clinic &amp; Store</span>
            </h1>
            <div className="hero-line"></div>
            <p className="doctor">Dr. Muhammad Yaseen</p>
            <p>D.H.M.S. Punjab R.H.M.P.PAK</p>
            <p className="role">Registered Homoeopathic Physician &amp; Consultant Specialist</p>
            <p className="bold">All Chronic Diseases of Male, Female &amp; Child</p>
            <a className="btn primary" href="#appointment">
              ☎ &nbsp;Book Appointment
            </a>
            <a className="btn" href="#services">
              Our Services
            </a>
          </div>
          <div className="info-stack">
            <div className="info-card">
              <div className="icon">☎</div>
              <h3>Contact Us</h3>
              <strong>+92 333 4227123</strong>
              <small>WhatsApp Available</small>
            </div>
            <div className="info-card">
              <div className="icon redicon">◷</div>
              <h3>Clinic Timing</h3>
              <strong style={{ color: "#ffd0d0" }}>6:30 PM to 10:00 PM</strong>
              <small style={{ color: "#ffb2b2" }}>Monday to Saturday</small>
              <small style={{ color: "#ffe600", fontWeight: 700 }}>⚠ Appointment recommended</small>
            </div>
            <div className="info-card">
              <div className="icon purple">⌖</div>
              <h3>Visit Us</h3>
              <small>Mast Iqbal Road, Opp: General Hospital Gate No. 3</small>
              <small>Near Waqar Medical Store</small>
            </div>
            <div className="info-card credentials">
              <div>
                <span className="title">PNCH NO.</span>
                <b>45801</b>
              </div>
              <div>
                <span className="title">PHC Reg</span>
                <b>R-17054</b>
              </div>
              <div>
                <span className="title">License</span>
                <b>2051917051</b>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll"></div>
      </section>

      <section className="light">
        <div className="container">
          <div className="accent"></div>
          <h2>
            About <span>Dr. Yaseen</span>
          </h2>
          <p className="subtitle">Your trusted partner in natural healing and holistic wellness</p>
          <Reveal className="about-grid">
            <div className="about-main">
              <h3>Dr. Muhammad Yaseen</h3>
              <p>D.H.M.S. Punjab R.H.M.P.PAK</p>
              <div className="line"></div>
              <b>Registered Homoeopathic Physician &amp; Consultant Specialist</b>
            </div>
            <div className="stats">
              <div className="stat">
                <div className="ico">♕</div>
                <b>35+</b>
                <p>Years Experience</p>
              </div>
              <div className="stat">
                <div className="ico">♧</div>
                <b>5000+</b>
                <p>Patients Treated</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="choose light">
        <div className="container">
          <h2 style={{ fontSize: 36 }}>
            Why <span>Choose Us</span>
          </h2>
          <div className="choose-grid">
            <Reveal as="div" className="choose-card" data-no="01">
              <span className="number">01</span>
              <span className="choose-title">Registered &amp; Licensed</span>
              <p>Fully certified with PNCH NO: 45801, PHC Reg NO: R-17054, PHC License NO: 2051917051</p>
            </Reveal>
            <Reveal as="div" className="choose-card" data-no="02">
              <span className="number">02</span>
              <span className="choose-title">35+ Years Experience</span>
              <p>Over three decades of successful practice treating thousands of patients with chronic conditions</p>
            </Reveal>
            <Reveal as="div" className="choose-card" data-no="03">
              <span className="number">03</span>
              <span className="choose-title">Natural Healing</span>
              <p>Safe, side-effect-free homoeopathic treatments that work with your body&apos;s natural healing abilities</p>
            </Reveal>
            <Reveal as="div" className="choose-card" data-no="04">
              <span className="number">04</span>
              <span className="choose-title">Personalized Care</span>
              <p>Individual attention and customized treatment plans tailored to each patient&apos;s unique needs</p>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="services" className="dark services">
        <div className="container">
          <div className="accent"></div>
          <h2 style={{ color: "#fff" }}>
            Our <span>Services</span>
          </h2>
          <p className="subtitle" style={{ color: "#bdd4f5" }}>
            Comprehensive homoeopathic treatment for all your health concerns
          </p>
          <div className="service-grid">
            <Reveal as="div" className="service">
              <div className="ico">♧</div>
              <h3>Chronic Disease Treatment</h3>
              <p>Expert treatment for long-standing chronic conditions using natural homoeopathic remedies tailored to individual needs.</p>
            </Reveal>
            <Reveal as="div" className="service">
              <div className="ico">♡</div>
              <h3>Women&apos;s Health</h3>
              <p>Specialized care for female health issues including hormonal imbalances, menstrual disorders, and reproductive health.</p>
            </Reveal>
            <Reveal as="div" className="service">
              <div className="ico">♧</div>
              <h3>Children&apos;s Care</h3>
              <p>Gentle, safe homoeopathic treatment for children&apos;s ailments, focusing on boosting immunity and natural healing.</p>
            </Reveal>
            <Reveal as="div" className="service">
              <div className="ico">♙</div>
              <h3>Men&apos;s Health</h3>
              <p>Comprehensive treatment for male health concerns with personalized homoeopathic prescriptions.</p>
            </Reveal>
            <Reveal as="div" className="service">
              <div className="ico">✧</div>
              <h3>Skin Disorders</h3>
              <p>Effective natural treatment for various skin conditions including eczema, psoriasis, acne, and allergies.</p>
            </Reveal>
            <Reveal as="div" className="service">
              <div className="ico">≋</div>
              <h3 style={{ color: "#66a8ff" }}>Respiratory Issues</h3>
              <p>Treatment for asthma, allergies, sinusitis, and other respiratory conditions using safe homoeopathic medicines.</p>
            </Reveal>
          </div>

          <div className="conditions">
            <h2 style={{ fontSize: 30, marginTop: 85 }}>
              Conditions We <span>Treat</span>
            </h2>
            <ConditionsMarquee />
            <a className="btn primary" href="#appointment">
              Schedule Your Consultation
            </a>
          </div>
        </div>
      </section>

      <section id="stories" className="testimonials">
        <div className="container">
          <div className="accent"></div>
          <h2>
            Patient <span>Stories</span>
          </h2>
          <p className="subtitle">Real experiences from real people who found healing through homoeopathy</p>
          <div className="reviews">
            <Reveal as="div" className="review">
              <div className="stars">★★★★★</div>
              <div className="quote">
                &quot;After years of suffering from severe migraines, Dr. Yaseen&apos;s treatment has
                given me my life back. The natural approach worked wonders where conventional
                medicine failed.&quot;
              </div>
              <div className="review-bottom">
                <div>
                  <b>Fatima Ahmed</b>
                  <span>Chronic Migraine</span>
                </div>
                <div className="year">2024</div>
              </div>
            </Reveal>
            <Reveal as="div" className="review">
              <div className="stars">★★★★★</div>
              <div className="quote">
                &quot;Dr. Yaseen&apos;s expertise in homoeopathy is exceptional. My chronic skin
                condition improved significantly within months. Highly recommended!&quot;
              </div>
              <div className="review-bottom">
                <div>
                  <b>Muhammad Ali</b>
                  <span>Skin Allergy</span>
                </div>
                <div className="year">2024</div>
              </div>
            </Reveal>
            <Reveal as="div" className="review">
              <div className="stars">★★★★★</div>
              <div className="quote">
                &quot;The personalized approach helped me manage my digestive discomfort and
                improve my daily routine. The consultation and follow-up were very helpful.&quot;
              </div>
              <div className="review-bottom">
                <div>
                  <b>Ayesha Khan</b>
                  <span>Digestive Complaints</span>
                </div>
                <div className="year">2025</div>
              </div>
            </Reveal>
            <Reveal as="div" className="review">
              <div className="stars">★★★★★</div>
              <div className="quote">
                &quot;My recurring allergies had been difficult to manage. The consultation was
                thorough and the treatment plan was explained clearly. I am very satisfied with
                the care.&quot;
              </div>
              <div className="review-bottom">
                <div>
                  <b>Hassan Raza</b>
                  <span>Allergies &amp; Sinus Issues</span>
                </div>
                <div className="year">2025</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="appointment" className="appointment">
        <div className="container">
          <div className="accent"></div>
          <h2 style={{ color: "#fff" }}>
            Book Your <span style={{ color: "#ff5b5b" }}>Appointment</span>
          </h2>
          <p className="subtitle" style={{ color: "#c0d6f5" }}>
            Start your journey to natural healing today
          </p>
          <Reveal className="appointment-grid">
            <AppointmentForm />
            <div>
              <div className="contact">
                <h3>Get in Touch</h3>
                <div className="contact-row">
                  <div className="ico">☎</div>
                  <div>
                    <small>Call Us</small>
                    <strong>+92 333 4227123</strong>
                    <small>WhatsApp Available</small>
                  </div>
                </div>
                <div className="contact-row">
                  <div className="ico red">◷</div>
                  <div>
                    <small style={{ color: "#ffaaaa" }}>Clinic Hours</small>
                    <strong>6:30 PM to 10:00 PM</strong>
                    <small>Monday to Saturday</small>
                  </div>
                </div>
                <div className="contact-row">
                  <div className="ico pur">⌖</div>
                  <div>
                    <small>Location</small>
                    <strong style={{ fontSize: 16 }}>Mast Iqbal Road, Opp: General Hospital Gate No. 3</strong>
                    <small>Near Waqar Medical Store</small>
                  </div>
                </div>
              </div>
              <div className="wa">
                <div className="bubble">💬</div>
                <h3>Chat on WhatsApp</h3>
                <p>Get instant responses to your queries</p>
                <a href="https://wa.me/923334227123">☎ &nbsp;+92 333 4227123</a>
              </div>
              <a
                className="map map-link"
                href="https://maps.app.goo.gl/97MFepGmcobV8Hro9?g_st=aw"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open clinic location in Google Maps"
              >
                <div className="pin">⌖</div>
                <strong>Mast Iqbal Road</strong>
                <span style={{ color: "#7eb5ff" }}>Opp: General Hospital</span>
                <small>Click to open Google Maps</small>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <img
              className="logo logo-img"
              style={{ width: 96, height: 102, marginBottom: 24 }}
              src="/logo.jpg"
              alt="Homoeopathy Health & Healing Logo"
            />
            <h3>
              Rehman Homoeopathic
              <br />
              Clinic &amp; Store
            </h3>
            <p>Natural healing through homoeopathy. Trusted by thousands for over 35 years.</p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <a href="#">Home</a>
            <a href="#about">About</a>
            <a href="#services">Services</a>
            <a href="#stories">Testimonials</a>
            <a href="#appointment">Appointment</a>
          </div>
          <div>
            <h3>Contact Us</h3>
            <p>
              ☎ &nbsp;+92 333 4227123
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;WhatsApp Available
            </p>
            <p>⌖ &nbsp; Mast Iqbal Road, Opp: General Hospital Gate No. 3</p>
          </div>
          <div>
            <h3>Clinic Hours</h3>
            <p>
              6:30 PM to 10:00 PM
              <br />
              Monday to Saturday
            </p>
            <h3>Credentials</h3>
            <p>
              PNCH: 45801
              <br />
              PHC Reg: R-17054
              <br />
              License: 2051917051
            </p>
          </div>
        </div>
        <div className="container copyright">
          <span>© 2026 Rehman Homoeopathic Clinic &amp; Store. All rights reserved.</span>
          <span>Designed with ❤️ for better health</span>
        </div>
      </footer>
    </>
  );
}
