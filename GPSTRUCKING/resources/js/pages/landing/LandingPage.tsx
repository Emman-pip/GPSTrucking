import React, { useState, useEffect } from 'react';
import { Moon, Sun, Truck, MapPin, Cpu, Clock, Users, Mail, Phone, ChevronRight } from 'lucide-react';
import { login } from '@/routes';
import { router } from '@inertiajs/react';
import MapView from '@/components/map/MapView';
import { useAppearance } from '@/hooks/use-appearance';
import AppLogoIcon from '@/components/app-logo-icon';
import MapBarangay from '@/components/map/MapBarangay';
import { toast } from 'sonner';

// Scroll animation hook
const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

const App: React.FC = () => {
    const [darkMode, setDarkMode] = useState(document.documentElement.classList.contains('dark'));

  useScrollAnimation();
  const hook = useAppearance();
  useEffect(() => {
    if (darkMode) {
        hook.updateAppearance('dark');
    } else {
        hook.updateAppearance('light');
    }
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#031A0F] dark:via-[#052417] dark:to-[#031A0F] transition-colors duration-500">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Hero />
      <Features />
      <MapSection />
      <HowItWorks />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

const Navbar: React.FC<{ darkMode: boolean; setDarkMode: (val: boolean) => void }> = ({ darkMode, setDarkMode }) => {
  const links = ['Home', 'Features', 'Map', 'About', 'Contact'];

  return (
    <nav className="fixed top-0 w-full bg-white/95 dark:bg-[#031A0F]/95 backdrop-blur-sm z-50 border-b border-gray-200 dark:border-emerald-900/30 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img src='/images/LOGO2.svg' className="size-5 aspect-square h-10 w-10 " />
          <span className="text-2xl font-bold text-gray-900 dark:text-white">GPSTrucking</span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          {links.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(' ', '-')}`}
              className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 dark:hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all duration-300 font-medium"
            >
              {link}
            </a>
          ))}
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-emerald-900/30 hover:bg-gray-200 dark:hover:bg-emerald-800/40 transition-all duration-300 dark:border dark:border-emerald-500/30"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-emerald-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>
      </div>
    </nav>
  );
};

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative  pt-32 pb-20 px-6 overflow-hidden  bg-emerald-500/10 dark:bg-current/0 h-150">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover opacity-20 dark:opacity-10  pointer-events-none"
        src="/vid2.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      {/* Premium Neon Wave Background for Dark Mode */}
      <div className="absolute inset-0 opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-green-600/10 via-emerald-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div data-aos="fade-up" className="space-y-6">
          <h1 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight flex-wrap flex">
            GPS<span className="text-emerald-600 dark:text-emerald-400 dark:drop-shadow-[0_0_20px_rgba(16,185,129,0.6)]">Trucking</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Efficient Waste Collection Through Smart GPS Technology
          </p>
          <button className="group px-8 py-4 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg dark:shadow-emerald-500/25" onClick={() => router.get(login().url)}>
            <span>Get Started</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div data-aos="fade-left" className="relative">
          <div className="relative z-10">
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 dark:from-emerald-900/20 to-transparent rounded-3xl blur-2xl -z-10" />
        </div>
      </div>
    </section>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Real-Time Tracking",
      description: "Monitor your fleet in real-time with precision GPS tracking and live location updates."
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Automated Scheduling",
      description: "Smart route optimization and automated scheduling for maximum efficiency."
    },
    {
      icon: <Cpu className="w-8 h-8" />,
      title: "IoT Integration",
      description: "Seamless integration with IoT sensors for intelligent waste management."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Malvar, Batangas Exclusivity",
      description: "Specially designed and optimized for Malvar, Batangas waste collection operations."
    }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-gray-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-16" data-aos="fade-up">
          Key <span className="text-emerald-600 dark:text-emerald-400">Features</span>
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              data-aos="zoom-in"
              data-aos-delay={idx * 100}
              className="group p-8 bg-white dark:bg-[#052417] rounded-2xl shadow-lg dark:shadow-emerald-500/10 hover:shadow-xl dark:hover:shadow-emerald-500/20 dark:border dark:border-emerald-500/30 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const MapSection: React.FC = () => {
  return (
    <section id="map" className="py-24 px-6">
      <div className="relative max-w-7xl mx-auto">
          <h2 className="block md:absolute text-black/60 dark:text-white top-10 left-10 bg-none md:bg-emerald-200/30 backdrop-blur md:shadow md:shadow-xl py-3 px-2 rounded-xl z-2 select-none text-5xl font-bold text-center text-gray-900 dark:text-white mb-16">
           <span className="text-emerald-600 dark:text-emerald-400">Real-time</span> Map
          </h2>
        <div
          data-aos="fade-up"
          className="relative h-120 bg-gradient-to-br shadow shadow-xl from-emerald-50 to-green-50 dark:from-[#052417] dark:to-[#031A0F] rounded-3xl shadow-xl dark:shadow-emerald-500/10 dark:border dark:border-emerald-500/30 flex items-center justify-center overflow-hidden"
        >
          <MapBarangay barangayCoordinates={[121.1583,14.0449]} userData={{barangay_official_info: {barangay_id: 6 } }} zoom={15}/>
        </div>
          <div className="weight-300 text-md text-center pt-2 md:mx-30 text-current/50">
          Each site is displayed on an interactive map and includes detailed bin statuses, such as whether containers are empty, nearing capacity, or full, helping users choose the best location for disposal.
          </div>
      </div>
    </section>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    { title: "GPS Sensor on Garbage Trucks", description: "GPS sensors detect the movement of garbage trucks" },
    { title: "Application", description: "Data is processed through an algorithm" },
    { title: "Smart services", description: "Generated smart services" }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-50 dark:bg-transparent">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-16" data-aos="fade-up">
          How It <span className="text-emerald-600 dark:text-emerald-400">Works</span>
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div
                data-aos="fade-up"
                data-aos-delay={idx * 150}
                className="flex-1 max-w-xs p-8 bg-white dark:bg-[#052417] rounded-2xl shadow-lg dark:shadow-emerald-500/10 dark:border dark:border-emerald-500/30 text-center"
              >
                <div className="w-12 h-12 bg-emerald-600 dark:bg-emerald-500 text-white dark:text-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight className="hidden md:block w-8 h-8 text-emerald-600 dark:text-emerald-400" data-aos="fade-up" data-aos-delay={idx * 150 + 75} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

const About: React.FC = () => {
  const team = [
    { name: "Development Team", role: "BSU - Malvar Students" },
    { name: "Research & Design", role: "Computer Science" },
    { name: "IoT Integration", role: "Engineering Team" }
  ];

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-16" data-aos="fade-up">
          About <span className="text-emerald-600 dark:text-emerald-400">Us</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div
              key={idx}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
              className="p-8 bg-white dark:bg-[#052417] rounded-2xl shadow-lg dark:shadow-emerald-500/10 dark:border dark:border-emerald-500/30 text-center"
            >
              <Users className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {member.name}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {member.role}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center" data-aos="fade-up">
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Developed by passionate students from Batangas State University - Malvar Campus,
            dedicated to creating innovative solutions for efficient waste management in their community.
          </p>
        </div>
      </div>
    </section>
  );
};

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    toast.info("Message sent!", {
        description: "Thank you for contacting us."
    })
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="py-24 px-6 bg-gray-50 dark:bg-transparent">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-5xl font-bold text-center text-gray-900 dark:text-white mb-16" data-aos="fade-up">
          Get In <span className="text-emerald-600 dark:text-emerald-400">Touch</span>
        </h2>

        <div data-aos="fade-up" className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 bg-white dark:bg-[#052417] border border-gray-300 dark:border-emerald-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-gray-900 dark:text-white transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 bg-white dark:bg-[#052417] border border-gray-300 dark:border-emerald-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-gray-900 dark:text-white transition-all"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
              Message
            </label>
            <textarea
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-3 bg-white dark:bg-[#052417] border border-gray-300 dark:border-emerald-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 text-gray-900 dark:text-white transition-all resize-none"
              placeholder="Your message..."
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full px-8 py-4 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-400 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg dark:shadow-emerald-500/25"
          >
            Send Message
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 dark:bg-[#020F09] text-white py-12 px-6 border-t border-gray-800 dark:border-emerald-900/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <Truck className="w-8 h-8 text-emerald-400" />
            <span className="text-2xl font-bold">GPS Trucking</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="mailto:contact@gpstrucking.com" className="flex items-center space-x-2 hover:text-emerald-400 transition-colors">
              <Mail className="w-5 h-5" />
              <span>contact@gpstrucking.com</span>
            </a>
            <a href="tel:+639123456789" className="flex items-center space-x-2 hover:text-emerald-400 transition-colors">
              <Phone className="w-5 h-5" />
              <span>+63 912 345 6789</span>
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 dark:border-emerald-900/30 text-center text-gray-400">
          <p>© 2025 GPS Trucking System. Developed by BSU - Malvar Students.</p>
        </div>
      </div>
    </footer>
  );
};

export default App;

<style>{`
  [data-aos] {
    opacity: 0;
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
  }

  [data-aos].aos-animate {
    opacity: 1;
  }

  [data-aos="fade-up"] {
    transform: translateY(30px);
  }

  [data-aos="fade-up"].aos-animate {
    transform: translateY(0);
  }

  [data-aos="fade-left"] {
    transform: translateX(30px);
  }

  [data-aos="fade-left"].aos-animate {
    transform: translateX(0);
  }

  [data-aos="zoom-in"] {
    transform: scale(0.9);
  }

  [data-aos="zoom-in"].aos-animate {
    transform: scale(1);
  }

  [data-aos][data-aos-delay="100"] {
    transition-delay: 0.1s;
  }

  [data-aos][data-aos-delay="150"] {
    transition-delay: 0.15s;
  }

  [data-aos][data-aos-delay="75"] {
    transition-delay: 0.075s;
  }

  @keyframes ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  .animate-ping {
    animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
`}</style>
