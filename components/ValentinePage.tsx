'use client'

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

const ValentinePage = () => {
  const [accepted, setAccepted] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState<{ x: number; y: number } | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const playSound = (type: 'success' | 'evade') => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    if (type === 'success') {
      // Success sound: ascending notes
      const notes = [523.25, 659.25, 783.99]; // C, E, G
      let time = audioContext.currentTime;
      
      notes.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.2, time + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, time + index * 0.1 + 0.3);
        
        osc.start(time + index * 0.1);
        osc.stop(time + index * 0.1 + 0.3);
      });
    } else {
      // Evade sound: playful boop
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(400, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      osc.start(audioContext.currentTime);
      osc.stop(audioContext.currentTime + 0.1);
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
  };

  const handleYesClick = () => {
    playSound('success');
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 via-red-50 to-rose-100">
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
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
            Will you be my Valentine?
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
                onMouseEnter={handleNoButtonInteraction}
                onClick={handleNoButtonInteraction}
                onTouchStart={handleNoButtonInteraction}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                aria-label="Decline Valentine proposal"
              >
                No 🙈
              </motion.button>
            ) : (
              <motion.button
                ref={noButtonRef}
                onMouseEnter={handleNoButtonInteraction}
                onClick={handleNoButtonInteraction}
                onTouchStart={handleNoButtonInteraction}
                animate={{ x: noButtonPos.x, y: noButtonPos.y }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
                className="fixed px-8 py-4 text-lg font-semibold bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                style={{ left: 0, top: 0 }}
                aria-label="Decline Valentine proposal"
              >
                No 🙈
              </motion.button>
            )}
          </div>

          {/* Helpful hint */}
          <motion.p
            className="text-sm text-gray-600 mt-8 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            (Try to click the No button 😉)
          </motion.p>
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
            Happy Valentine's Day ❤️
          </motion.h1>

          {/* Message */}
          <motion.p
            className="text-lg md:text-xl text-gray-700 leading-relaxed"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Thank you for saying yes. You make my world brighter and my days warmer. Every moment with you is special, and I'm grateful for you today and always.
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

          {/* Reset Button */}
          <motion.button
            onClick={handleReset}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-12 px-6 py-2 text-sm font-semibold bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            aria-label="Ask again"
          >
            Ask Again? 💬
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default ValentinePage;
