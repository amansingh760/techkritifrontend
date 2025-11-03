// src/components/ParticleBackground.jsx
import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';

function ParticleBackground() {
  const particlesInit = useCallback(async (engine) => {
    // This loads the particle engine
    await loadSlim(engine);
  }, []);

  const particleStyle = {
    position: 'fixed', // This is key
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1 // This puts it behind everything else
  };

  const particleOptions = {
    background: {
      color: {
        value: '#121212', // Matches our dark theme
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'repulse', // Makes particles move away from mouse
        },
      },
      modes: {
        repulse: {
          distance: 100,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: '#555', // Particle color
      },
      links: {
        color: '#555', // Link color
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'out',
        },
        random: false,
        speed: 1, // Slower speed
        straight: false,
      },
      number: {
        density: {
          enable: true,
        },
        value: 120, // Number of particles
      },
      opacity: {
        value: 0.5,
      },
      shape: {
        type: 'circle',
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: true,
  };

  return (
    <Particles
      id="tsparticles"
      style={particleStyle}
      init={particlesInit}
      options={particleOptions}
    />
  );
}

export default ParticleBackground;