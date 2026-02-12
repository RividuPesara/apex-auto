import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LandingPage.css';

const LandingPage = () => {
  const { user } = useAuth();

  const services = [
    {
      title: 'Engine Tuning',
      description: 'ECU remapping, turbo upgrades, and exhaust systems for maximum power output.',
      price: 'From LKR 300,000',
      image: '/images/tuning.webp'
    },
    {
      title: 'Body Kits & Aero',
      description: 'Custom body kits, spoilers, wide-body conversions, and aerodynamic enhancements.',
      price: 'From LKR 400,000',
      image: '/images/kits.webp'
    },
    {
      title: 'Custom Paint & Wrap',
      description: 'Professional paint jobs, vinyl wraps, and custom colour-matched finishes.',
      price: 'From LKR 600,000',
      image: '/images/paint.webp'
    },
    {
      title: 'Wheels & Rims',
      description: 'Premium alloy wheels, forged rims, and complete suspension packages.',
      price: 'From LKR 240,000',
      image: '/images/wheels.webp'
    },
    {
      title: 'Interior Mods',
      description: 'Racing seats, custom steering wheels, dash upgrades, and interior trim.',
      price: 'From LKR 160,000',
      image: '/images/interior.webp'
    },
    {
      title: 'Lighting & Electronics',
      description: 'LED upgrades, HID conversion kits, underglow, and wiring solutions.',
      price: 'From LKR 100,000',
      image: '/images/light.webp'
    }
  ];

  const testimonials = [
    {
      name: 'Ashan Perera',
      car: 'Nissan GT-R Owner',
      text: 'Apex Auto Mods transformed my GT-R beyond what I imagined. The ECU remap alone added 80hp, and the body kit is flawless. Best garage around.'
    },
    {
      name: 'Dinesh Fernando',
      car: 'BMW M4 Owner',
      text: 'The online customizer let me plan my build before visiting. Ended up with a full exhaust system and coilovers. The team executed it perfectly.'
    },
    {
      name: 'Kavitha Ratnayake',
      car: 'Honda Civic Type R Owner',
      text: 'Professional service from start to finish. The wrap quality is outstanding and the colour matching was spot on. Highly recommend their paint services.'
    }
  ];

  return (
    <div className="landing-page">

      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <h1 className="hero-title">
            Transform Your Ride<br />
            with <span className="text-accent">Apex Auto Mods</span>
          </h1>
          <p className="hero-subtitle">
            Premium car modification garage specialising in engine tuning,
            body kits, custom paint, wheels, and more. Build your dream car with us.
          </p>
          <div className="hero-cta">
            <Link to={user ? '/customize' : '/login'} className="btn-primary">
              Customize Your Car Now
            </Link>
            <a href="#services" className="btn-outline">
              View Services
            </a>
          </div>

        </div>
      </section>

      <section className="services" id="services">
        <div className="container">
          <div className="section-header">
            <span className="section-label">What We Do</span>
            <h2>Our Services</h2>
            <p>Professional modification services tailored to your vision</p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-image">
                  <img src={service.image} alt={service.title} loading="lazy" />
                </div>
                <div className="service-body">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                  <span className="service-price">{service.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="container">
          <div className="about-grid">
            <div className="about-image">
              <img
                src="/images/garage.webp"
                alt="Apex Auto Mods Garage"
                loading="lazy"
              />
            </div>
            <div className="about-content">
              <span className="section-label">About Us</span>
              <h2>Premier Car Modification Garage</h2>
              <p>
                Apex Auto Mods specialises in performance tuning, body kit
                installations, custom paint, interior upgrades, and lighting
                solutions. We deliver precision craftsmanship with premium materials.
              </p>
              <p>
                Whether you want a subtle ECU remap or a full widebody build, our
                experienced technicians deliver precision craftsmanship with premium
                materials. Use our online customizer to plan your build digitally
                before visiting the garage.
              </p>

            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Reviews</span>
            <h2>What Our Clients Say</h2>
            <p>Real reviews from our satisfied customers</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, idx) => (
              <div key={idx} className="testimonial-card">
                <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                <div className="testimonial-author">
                  <div>
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-role">{t.car}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to build your dream machine?</h2>
          <p>
            Use our interactive car customizer to pick your model, choose colours,
            add performance parts, and save your build. Your next upgrade starts here.
          </p>
          <div className="cta-buttons">
            <Link to={user ? '/customize' : '/register'} className="btn-primary btn-large">
              {user ? 'Start Customizing' : 'Create Account'}
            </Link>
            {!user && (
              <Link to="/login" className="btn-outline btn-large">Login</Link>
            )}
            {user && (
              <Link to="/dashboard" className="btn-outline btn-large">View Saved Builds</Link>
            )}
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col footer-brand-col">
              <div className="footer-logo">
                <span className="footer-logo-text">APEX</span>
                <span className="footer-logo-accent">AUTO MODS</span>
              </div>
              <p className="footer-tagline">
                Premium car modification garage.
                Transforming rides since 2020.
              </p>
            </div>
            <div className="footer-col">
              <h4>Quick Links</h4>
              <Link to="/">Home</Link>
              <a href="#services">Services</a>
              <Link to={user ? '/customize' : '/login'}>Customize</Link>
            </div>
            <div className="footer-col">
              <h4>Social Media</h4>
              <a href="#" aria-label="Twitter">Twitter</a>
              <a href="#" aria-label="Instagram">Instagram</a>
              <a href="#" aria-label="Facebook">Facebook</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href="mailto:hello@apexautomods.com">hello@apexautomods.com</a>
              <span>+94 77 123 4567</span>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy;Apex Auto Mods</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
