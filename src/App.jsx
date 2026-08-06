import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
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
import DashShell from './demo/components/DashShell';
import ModuleRoute from './demo/modules';

function Divider() {
  return <div className="divider" />;
}

function LandingPage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Retry once after components finish painting
      const timer = setTimeout(() => {
        const elRetry = document.getElementById(id);
        if (elRetry) elRetry.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [hash]);

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

      {/* Usuario final: nodo único, sin slug. Va declarado antes del patrón
          genérico, pero además React Router puntúa los segmentos estáticos por
          encima de los dinámicos, así que /demo/usuario/acciones nunca se
          confunde con /demo/:tipo/:slug. */}
      <Route path="/demo/usuario" element={<DashShell nodeTypeId="usuario" />}>
        <Route index element={<ModuleRoute />} />
        <Route path=":modulo" element={<ModuleRoute />} />
      </Route>

      {/* Nodos con colección: empresa, escuela, municipio, universidad, ong.
          `institucion` sigue funcionando como alias heredado de `escuela`
          (ver ROUTE_ALIASES en demo/data/nodes.js) para no romper links viejos. */}
      <Route path="/demo/:tipo/:slug" element={<DashShell />}>
        <Route index element={<ModuleRoute />} />
        <Route path=":modulo" element={<ModuleRoute />} />
      </Route>
    </Routes>
  );
}
