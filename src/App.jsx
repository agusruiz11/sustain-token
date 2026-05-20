import { Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import FloatingBird from './components/FloatingBird';
import Hero from './components/Hero';
import Protocol from './components/Protocol';
import HowItWorks from './components/HowItWorks';
import Architecture from './components/Architecture';
import Pilots from './components/Pilots';
import Compliance from './components/Compliance';
import Impact from './components/Impact';
import Community from './components/Community';
import Token from './components/Token';
import Governance from './components/Governance';
import Developers from './components/Developers';
import Resources from './components/Resources';
import Contact from './components/Contact';
import Footer from './components/Footer';
import DemoHub from './demo/DemoHub';
import EmpresaDashboard from './demo/EmpresaDashboard';
import UsuarioFinal from './demo/UsuarioFinal';

function Divider() {
  return <div className="divider" />;
}

function LandingPage() {
  return (
    <>
      <Nav />
      <FloatingBird />
      <Hero />
      <Divider />
      <Protocol />
      <Divider />
      <HowItWorks />
      <Divider />
      <Architecture />
      <Divider />
      <Pilots />
      <Divider />
      <Compliance />
      <Divider />
      <Impact />
      <Divider />
      <Community />
      <Divider />
      <Token />
      <Divider />
      <Governance />
      <Divider />
      <Developers />
      <Divider />
      <Resources />
      <Divider />
      <Contact />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<DemoHub />} />
      <Route path="/demo/empresa/:slug" element={<EmpresaDashboard />} />
      <Route path="/demo/usuario" element={<UsuarioFinal />} />
    </Routes>
  );
}
