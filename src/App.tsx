/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

// Artistic, animated SVG background component
const DreamyBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-60">
    <motion.svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute w-full h-full stroke-zinc-300 fill-none"
      strokeWidth="0.2"
    >
      <motion.path
        d="M0,50 C20,30 40,70 100,40"
        animate={{ d: ["M0,50 C20,30 40,70 100,40", "M0,60 C30,20 50,80 100,50", "M0,50 C20,30 40,70 100,40"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M0,70 C30,40 60,90 100,60"
        animate={{ d: ["M0,70 C30,40 60,90 100,60", "M0,80 C40,50 70,100 100,70", "M0,70 C30,40 60,90 100,60"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        strokeWidth="0.1"
      />
      <motion.path
        d="M0,30 C40,60 50,10 100,30"
        animate={{ d: ["M0,30 C40,60 50,10 100,30", "M0,20 C50,70 60,20 100,40", "M0,30 C40,60 50,10 100,30"] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        strokeWidth="0.3"
      />
    </motion.svg>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-zinc-50/50" />
  </div>
);

export default function App() {
  const [location, setLocation] = useState('');
  const [sight, setSight] = useState('');
  const [feeling, setFeeling] = useState('');

  const [isGenerating, setIsGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Secret state handling
  const [secretStash, setSecretStash] = useState({ location: '', sight: '', feeling: '' });
  const [secretExpiry, setSecretExpiry] = useState<number | null>(null);
  const [isHoldingSecret, setIsHoldingSecret] = useState(false);

  const handleGenerate = () => {
    setSecretStash({ location, sight, feeling });
    setSecretExpiry(Date.now() + 60000);

    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      setShowModal(true);
      setLocation('');
      setSight('');
      setFeeling('');
    }, 8000); // 8 seconds duration
  };

  useEffect(() => {
    if (secretExpiry) {
      const timeToExpiry = secretExpiry - Date.now();
      if (timeToExpiry > 0) {
        const timeout = setTimeout(() => {
          setSecretExpiry(null);
          setSecretStash({ location: '', sight: '', feeling: '' });
          setIsHoldingSecret(false);
        }, timeToExpiry);
        return () => clearTimeout(timeout);
      } else {
        setSecretExpiry(null);
        setSecretStash({ location: '', sight: '', feeling: '' });
        setIsHoldingSecret(false);
      }
    }
  }, [secretExpiry]);

  const handleSecretDown = () => {
    if (secretExpiry && Date.now() < secretExpiry) {
      setIsHoldingSecret(true);
    }
  };

  const handleSecretUp = () => {
    setIsHoldingSecret(false);
  };

  return (
    <div className="h-[100dvh] w-full bg-zinc-50 text-zinc-900 font-sans flex flex-col items-center justify-center relative overflow-hidden select-none">
      
      {/* Animated artistic background */}
      <DreamyBackground />

      <main className="z-10 flex flex-col items-center justify-center h-full w-full relative px-6 py-4">
        <header className="mb-8 md:mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-light tracking-[0.5em] text-zinc-800 mb-2">梦境生成器</h1>
          <p className="text-xs md:text-sm tracking-[0.3em] text-zinc-400 uppercase">Dreamscape Weaver</p>
        </header>

        <div className="w-full max-w-lg mb-4 md:mb-6 flex flex-col items-center space-y-6 md:space-y-8">
          <InputRow label="我来到了:" value={location} onChange={setLocation} />
          <InputRow label="看见:" value={sight} onChange={setSight} />
          <InputRow label="我感觉很:" value={feeling} onChange={setFeeling} />
        </div>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || showModal}
          className="bg-zinc-900 border border-transparent px-12 md:px-16 py-3 md:py-4 text-white text-[1rem] md:text-[1.1rem] tracking-[0.3em] rounded-full transition-all duration-300 hover:bg-zinc-800 hover:-translate-y-[2px] hover:shadow-xl hover:shadow-zinc-900/10 disabled:opacity-50 disabled:pointer-events-none cursor-pointer mt-6 md:mt-8"
        >
          立即生成
        </button>
      </main>

      {/* Secret Trigger Area - Bottom Right */}
      <div 
        className="absolute bottom-0 right-0 w-[80px] h-[80px] z-20 cursor-default" 
        onPointerDown={handleSecretDown}
        onPointerUp={handleSecretUp}
        onPointerLeave={handleSecretUp}
        onPointerCancel={handleSecretUp}
        style={{ WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}
        title=""
      />

      {/* Secret Display Overlay */}
      <AnimatePresence>
        {isHoldingSecret && (
           <motion.div 
             initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
             animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
             exit={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
             transition={{ duration: 0.3 }}
             className="absolute bottom-[40px] right-[40px] text-xs leading-[1.8] text-zinc-400 z-30 pointer-events-none text-right tracking-widest"
           >
             <div className="mb-2 opacity-50">梦境残影</div>
             <div>地点: <span className="text-zinc-800 ml-1">{secretStash.location || '...'}</span></div>
             <div>所见: <span className="text-zinc-800 ml-1">{secretStash.sight || '...'}</span></div>
             <div>感受: <span className="text-zinc-800 ml-1">{secretStash.feeling || '...'}</span></div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-40 bg-zinc-50/90 backdrop-blur-[10px] flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2, position: 'absolute' }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mb-10 relative flex justify-center items-center"
            >
              {/* Artistic spinner */}
              <motion.svg 
                className="w-20 h-20 md:w-24 md:h-24 stroke-zinc-800"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle cx="50" cy="50" r="46" strokeWidth="1" className="stroke-zinc-200" />
                <motion.circle 
                  cx="50" 
                  cy="50" 
                  r="46" 
                  strokeWidth="2" 
                  strokeDasharray="150 200"
                  strokeLinecap="round"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "50% 50%" }}
                />
              </motion.svg>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-sm tracking-widest text-zinc-500 uppercase font-light"
            >
              正在编织梦境...
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-zinc-900/20 backdrop-blur-sm flex items-center justify-center px-6"
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-zinc-100 p-10 md:p-12 text-center rounded-3xl shadow-2xl max-w-[400px] w-full"
            >
               <div className="text-lg md:text-xl mb-4 tracking-widest text-zinc-800 font-medium">提示</div>
               <p className="text-zinc-500 mb-8 tracking-wider text-sm md:text-base">
                 当前服务器繁忙，请稍后再试。
               </p>
               <button 
                 onClick={() => setShowModal(false)}
                 className="px-8 py-2 md:py-3 border border-zinc-200 hover:bg-zinc-50 transition-colors rounded-full text-xs md:text-sm text-zinc-600 tracking-widest uppercase outline-none"
               >
                 确认
               </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function InputRow({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  const [showWarning, setShowWarning] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val.length > 6) {
      setShowWarning(true);
      onChange(val.slice(0, 6));
      setTimeout(() => setShowWarning(false), 2000);
    } else {
      setShowWarning(false);
      onChange(val);
    }
  };

  return (
    <div className="flex flex-col items-center w-full group relative">
      <label className="text-xs md:text-sm text-zinc-400 tracking-[0.2em] mb-1 md:mb-2 transition-colors group-focus-within:text-zinc-700">{label}</label>
      <input 
        type="text" 
        value={value}
        onChange={handleChange}
        placeholder="..."
        className="bg-transparent border-0 border-b border-zinc-200 text-zinc-800 text-center text-[1.5rem] md:text-[1.8rem] w-[240px] md:w-[280px] p-2 transition-all duration-500 focus:outline-none focus:border-zinc-800 placeholder:text-zinc-200 font-sans tracking-widest"
      />
      <AnimatePresence>
        {showWarning && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }} 
            className="absolute -bottom-6 text-[10px] text-red-400/80 tracking-widest"
          >
            仅限输入6个字
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
