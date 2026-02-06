'use client'

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const HauConfetti = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create falling "Hau" text
    const hauElements: Array<{
      el: HTMLDivElement;
      y: number;
      vy: number;
      x: number;
      vx: number;
    }> = [];

    for (let i = 0; i < 15; i++) {
      const hau = document.createElement('div');
      hau.textContent = 'Hau';
      hau.className = 'text-4xl font-bold pointer-events-none absolute opacity-80';
      
      const colors = ['text-red-500', 'text-pink-500', 'text-rose-500', 'text-red-400'];
      hau.classList.add(colors[Math.floor(Math.random() * colors.length)]);
      
      const x = Math.random() * window.innerWidth;
      const y = -50;
      const vy = Math.random() * 2 + 2;
      const vx = Math.random() * 4 - 2;
      
      hau.style.left = x + 'px';
      hau.style.top = y + 'px';
      hau.style.transform = `rotate(${Math.random() * 30 - 15}deg)`;
      
      container.appendChild(hau);
      hauElements.push({ el: hau, y, vy, x, vx });
    }

    const animate = () => {
      let hasElements = false;

      hauElements.forEach((h, index) => {
        h.y += h.vy;
        h.x += h.vx;
        h.vy += 0.1;
        h.vx *= 0.99; // Air resistance

        h.el.style.left = h.x + 'px';
        h.el.style.top = h.y + 'px';
        h.el.style.opacity = Math.max(0, 0.8 - (h.y / window.innerHeight) * 0.8).toString();

        if (h.y < window.innerHeight) {
          hasElements = true;
        } else {
          h.el.remove();
          hauElements.splice(index, 1);
        }
      });

      if (hasElements) {
        requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      hauElements.forEach((h) => h.el.remove());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

const Confetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confetti: Array<{
      x: number;
      y: number;
      w: number;
      h: number;
      vy: number;
      vx: number;
      color: string;
    }> = [];

    const colors = ['#ff1744', '#ff5252', '#ff6e40', '#ff7043', '#ff8a65', '#ffab91', '#ffccbc'];

    for (let i = 0; i < 100; i++) {
      confetti.push({
        x: Math.random() * canvas.width,
        y: -10,
        w: Math.random() * 10 + 5,
        h: Math.random() * 10 + 5,
        vy: Math.random() * 3 + 3,
        vx: Math.random() * 6 - 3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      confetti.forEach((c, index) => {
        c.y += c.vy;
        c.x += c.vx;
        c.vy += 0.1;

        ctx.fillStyle = c.color;
        ctx.fillRect(c.x, c.y, c.w, c.h);

        if (c.y > canvas.height) {
          confetti.splice(index, 1);
        }
      });

      if (confetti.length > 0) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
    />
  );
};

const ValentinePage = () => {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showHau, setShowHau] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Detect if device is touch-enabled
    const isTouchDevice = () => {
      return (
        typeof window !== 'undefined' &&
        (navigator.maxTouchPoints > 0 ||
          (navigator as any).msMaxTouchPoints > 0 ||
          window.matchMedia('(hover: none)').matches)
      );
    };
    setIsMobile(isTouchDevice());
  }, []);

  const playSound = (type: 'success' | 'evade' | 'cheer') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (type === 'success') {
        // Success sound: romantic chord progression (Amaj7 - Cmaj7 - Fmaj7)
        // Lower, warmer notes for a more romantic feel
        const chords = [
          [220, 329.63, 440, 659.25],    // A, E, A, E (Amaj7)
          [261.63, 392, 523.25, 784],    // C, G, C, G (Cmaj7)
          [349.23, 523.25, 698.46, 1046.5] // F, C, F, C (Fmaj7)
        ];
        let time = audioContext.currentTime;
        
        chords.forEach((chord, chordIndex) => {
          chord.forEach((freq) => {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.1, time + chordIndex * 0.4);
            gain.gain.exponentialRampToValueAtTime(0.01, time + chordIndex * 0.4 + 0.4);
            
            osc.start(time + chordIndex * 0.4);
            osc.stop(time + chordIndex * 0.4 + 0.4);
          });
        });
      } else if (type === 'cheer') {
        // Cheering sound: triumphant rising notes followed by celebration bells
        const time = audioContext.currentTime;
        
        // Rising triumph notes
        const triumphNotes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C (high)
        triumphNotes.forEach((freq, index) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.15, time + index * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, time + index * 0.08 + 0.3);
          
          osc.start(time + index * 0.08);
          osc.stop(time + index * 0.08 + 0.3);
        });
        
        // Celebration bells (high frequency shimmer)
        for (let i = 0; i < 3; i++) {
          const bellFreq = 1200 + i * 150;
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.frequency.value = bellFreq;
          gain.gain.setValueAtTime(0.1, time + 0.4 + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4 + i * 0.1 + 0.25);
          
          osc.start(time + 0.4 + i * 0.1);
          osc.stop(time + 0.4 + i * 0.1 + 0.25);
        }
      } else {
        // Evade sound: soft, gentle chime (romantic but playful)
        const frequencies = [523.25, 659.25]; // High, sweet notes
        
        frequencies.forEach((freq, index) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.08, audioContext.currentTime + index * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + index * 0.05 + 0.2);
          
          osc.start(audioContext.currentTime + index * 0.05);
          osc.stop(audioContext.currentTime + index * 0.05 + 0.2);
        });
      }
    } catch (e) {
      // Audio context not available, silently fail
    }
  };

  const generateRandomPosition = () => {
    const maxWidthOffset = 120;
    const maxHeightOffset = 60;
    
    const randomX = Math.random() * (window.innerWidth - maxWidthOffset);
    const randomY = Math.random() * (window.innerHeight - maxHeightOffset);
    
    return { x: randomX, y: randomY };
  };

  const handleNoButtonInteraction = () => {
    playSound('evade');
    const newPos = generateRandomPosition();
    setNoButtonPos(newPos);
    setShowHau(true);
    setTimeout(() => setShowHau(false), 2000);
  };

  const handleNoTouchStart = () => {
    setTouchStartTime(Date.now());
  };

  const handleNoTouchEnd = () => {
    // On mobile, require a longer touch duration before evading (500ms)
    // This gives users a better chance to click
    const touchDuration = Date.now() - touchStartTime;
    if (isMobile && touchDuration < 500) {
      return; // Don't evade on quick taps
    }
    handleNoButtonInteraction();
  };

  const handleYesClick = () => {
    //playSound('success');
    playSound('cheer');
    setShowConfetti(true);
    setAccepted(true);
  };

  const handleReset = () => {
    setAccepted(false);
    setNoButtonPos(null);
    setShowConfetti(false);
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.6 } },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-rose-100 overflow-hidden">
      {showConfetti && <Confetti />}
      {showHau && <HauConfetti />}
      {!accepted ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col items-center justify-center gap-8 p-8 text-center"
        >
          {/* Question */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-red-600"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Marvelous C Muhata,
            <br />
            will you be my Valentine?
          </motion.h1>

          {/* Decorative emoji */}
          <motion.div
            className="text-5xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            💕
          </motion.div>

          {/* Buttons Container */}
          <div className="flex gap-6 flex-wrap justify-center relative">
            {/* Yes Button */}
            <motion.button
              onClick={handleYesClick}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
              aria-label="Accept Valentine proposal"
            >
              Yes 💖
            </motion.button>

            {/* No Button - with evading behavior */}
            {!noButtonPos ? (
              <motion.button
                ref={noButtonRef}
                onMouseEnter={!isMobile ? handleNoButtonInteraction : undefined}
                onClick={handleNoButtonInteraction}
                onTouchStart={isMobile ? handleNoTouchStart : undefined}
                onTouchEnd={isMobile ? handleNoTouchEnd : undefined}
                whileHover={!isMobile ? {} : { scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 text-lg font-semibold bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
                  isMobile ? 'py-6 px-10 text-xl' : ''
                }`}
                aria-label="Decline Valentine proposal"
              >
                No 🙈
              </motion.button>
            ) : (
              <motion.button
                ref={noButtonRef}
                onMouseEnter={!isMobile ? handleNoButtonInteraction : undefined}
                onClick={handleNoButtonInteraction}
                onTouchStart={isMobile ? handleNoTouchStart : undefined}
                onTouchEnd={isMobile ? handleNoTouchEnd : undefined}
                animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                className={`fixed px-8 py-4 text-lg font-semibold bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
                  isMobile ? 'py-6 px-10 text-xl' : ''
                }`}
                style={{ left: 0, top: 0 }}
                aria-label="Decline Valentine proposal"
              >
                No 🙈
              </motion.button>
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="flex flex-col items-center justify-center gap-6 p-8 text-center max-w-2xl"
        >
          {/* Accepted Title */}
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-red-600"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            My Valentine ❤️
          </motion.h1>

          {/* Message */}
          <motion.p
            className="text-lg md:text-xl text-gray-700 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            >
            From the moment you came into my life, everything felt a little warmer and a little brighter.
            You have a way of turning ordinary moments into something special, simply by being you.
            <br /><br />
            Your smile stays with me longer than you know, and your presence feels like home.
            Thank you for being someone who makes love feel easy, real, and beautiful.
            <br /><br />
            Today and always, I choose you, and I’m endlessly grateful to call you mine. 
            <br />
            I Love you baby💕
            <br />
            Now, always, and forever
            </motion.p>


          {/* Animated hearts */}
          <motion.div
            className="flex gap-4 justify-center text-4xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {['❤️', '💕', '💖'].map((heart, index) => (
              <motion.div
                key={index}
                animate={{ y: [0, -15, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                {heart}
              </motion.div>
            ))}
          </motion.div>

          {/* Signature */}
          <motion.p
            className="text-lg text-red-600 font-semibold mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            Forever yours 💕
          </motion.p>
        </motion.div>
      )}
    </div>
  );
};

export default ValentinePage;
