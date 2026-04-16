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

function Divider() {
  return <div className="divider" />;
}

export default function App() {
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
