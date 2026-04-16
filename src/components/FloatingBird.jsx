import { useScroll, useTransform, motion } from 'framer-motion';
import heroBird from '../assets/sustain-bird-logo-pink.png';

export default function FloatingBird() {
  const { scrollYProgress } = useScroll();

  // scroll 0→1 mueve el pájaro de -15vh a +15vh (parallax suave)
  const y = useTransform(scrollYProgress, [0, 1], ['-15vh', '15vh']);
  // opacidad: arriba más visible, abajo se desvanece un poco
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.28, 0.18, 0.10]);

  return (
    <motion.div
      className="floating-bird"
      aria-hidden="true"
      style={{
        position: 'fixed',
        right: '2vw',
        top: '50%',
        translateY: '-50%',
        y,
        opacity,
        width: 'clamp(160px, 18vw, 280px)',
        pointerEvents: 'none',
        zIndex: 0,
        filter: 'drop-shadow(0 0 40px rgba(242,212,239,0.14))',
      }}
    >
      <motion.img
        src={heroBird}
        alt=""
        animate={{
          y: [0, -14, 0],
          rotate: [-3, -1, -3],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </motion.div>
  );
}
