/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Clock, CheckCircle2, Zap, Command, MessageCircle, CreditCard, ChevronRight, ArrowRight, Search, Send, Minus, Plus } from 'lucide-react';

// Telegram Icon Component
const TelegramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M20.665 3.717l-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42l10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l.002.001l-.314 4.692c.46 0 .663-.211.921-.46l2.211-2.15l4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.434z"/>
  </svg>
);

// Pixel Background Component
const PixelBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let w = 0;
    let h = 0;
    const size = 30; // Pixel size
    let grid: { val: number, target: number }[] = [];
    let nCols = 0;
    let nRows = 0;

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      nCols = Math.ceil(w / size);
      nRows = Math.ceil(h / size);
      grid = new Array(nCols * nRows).fill(0).map(() => ({
          val: Math.random() * 0.05, 
          target: Math.random() * 0.05 
      }));
    };
    
    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      
      for (let i = 0; i < nCols; i++) {
        for (let j = 0; j < nRows; j++) {
            const idx = i + j * nCols;
            const cell = grid[idx];
            
            // Update alpha
            if (Math.abs(cell.target - cell.val) < 0.001) {
                // Occasionally pick a brighter value for "twinkle"
                cell.target = Math.random() < 0.05 ? Math.random() * 0.15 : Math.random() * 0.05;
            }
            cell.val += (cell.target - cell.val) * 0.05; // Lerp speed

            if (cell.val > 0.005) {
                ctx.fillStyle = `rgba(255, 255, 255, ${cell.val})`; 
                ctx.fillRect(i * size, j * size, size - 1, size - 1); // -1 for grid gap
            }
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

// Mock Data Source
const MOCK_DATA = {
  id: "41086",
  status: "active",
  plan: "LTE [Связист]",
  price: "150 ₽ / мес",
  expiry: "2026-03-01 15:16",
  botName: "TunnelFox Bot",
  botHandle: "@tunnelfox_bot",
  supportHandle: "@tunnelfox_support"
};

// Vercel-style Card with Animation
const Card = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ 
      y: -2,
      borderColor: "rgba(255, 255, 255, 0.3)",
      boxShadow: "0 0 30px rgba(50, 145, 255, 0.15)" // Subtle Vercel-blueish neon glow
    }}
    transition={{ 
      duration: 0.4, 
      delay, 
      ease: "easeOut",
      y: { duration: 0.2 },
      borderColor: { duration: 0.2 },
      boxShadow: { duration: 0.2 }
    }}
    className={`bg-black border border-[#333] rounded-xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

// Vercel-style Button
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = "",
  fullWidth = false,
  icon: Icon
}: { 
  children?: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  fullWidth?: boolean;
  icon?: React.ElementType;
}) => {
  const baseStyles = "h-10 px-4 text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 rounded-lg border cursor-pointer active:scale-95";
  const widthClass = fullWidth ? "w-full" : "";
  
  const variants = {
    primary: "bg-white text-black border-white hover:bg-[#eaeaea] hover:border-[#eaeaea] shadow-[0_0_20px_rgba(255,255,255,0.1)]",
    secondary: "bg-[#111] text-[#ededed] border-[#333] hover:bg-[#1a1a1a] hover:border-[#444]",
    ghost: "bg-transparent border-transparent text-[#888] hover:text-[#ededed] hover:bg-[#111]"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      onClick={onClick}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

// Vercel-style Input
const Input = ({ defaultValue }: { defaultValue: string }) => (
  <div className="relative w-full group">
    <input 
      type="text" 
      defaultValue={defaultValue}
      className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2.5 text-sm text-white placeholder-[#444] focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all font-mono group-hover:border-[#444]"
    />
  </div>
);

// Status Badge
const StatusBadge = ({ active }: { active: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${
    active 
      ? "border-emerald-900/30 text-emerald-400 bg-emerald-900/10" 
      : "border-red-900/30 text-red-400 bg-red-900/10"
  }`}>
    <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-emerald-400" : "bg-red-400"} animate-pulse`} />
    {active ? "Активна" : "Неактивна"}
  </span>
);

export default function App() {
  const [loading, setLoading] = useState(false);
  const [extendStep, setExtendStep] = useState<'none' | 'devices' | 'stub'>('none');
  const [selectedDevices, setSelectedDevices] = useState(1);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleExtendClick = () => {
    setExtendStep('devices');
  };

  const handleDeviceSelect = (devices: number) => {
    setSelectedDevices(devices);
    setExtendStep('stub');
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-12 px-4 bg-black text-[#ededed] font-sans selection:bg-white selection:text-black relative overflow-hidden">
      
      <PixelBackground />

      <main className="w-full max-w-md space-y-6 relative z-10">
        
        {/* Source Bot Card */}
        <Card delay={0.1}>
          <div className="p-5 flex items-center justify-between group cursor-default gap-4">
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#111] to-[#000] border border-[#333] flex items-center justify-center shadow-inner flex-shrink-0">
                <Command className="w-7 h-7 text-[#888] group-hover:text-white transition-colors" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-3xl font-black text-white tracking-tighter truncate leading-none">
                  {MOCK_DATA.botName}
                </h3>
              </div>
            </div>
            <Button variant="secondary" className="h-12 w-12 rounded-full p-0 flex-shrink-0 bg-[#229ED9]/10 text-[#229ED9] border-[#229ED9]/20 hover:bg-[#229ED9] hover:text-white hover:border-[#229ED9]">
              <TelegramIcon className="w-5 h-5 ml-0.5" />
            </Button>
          </div>
        </Card>

        {/* Main Subscription Card */}
        <Card delay={0.2} className="border-[#333] bg-[#050505]">
          <AnimatePresence mode="wait">
            {extendStep === 'none' && (
              <motion.div
                key="main"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Search/ID Bar */}
                <div className="p-4 border-b border-[#222] bg-[#0a0a0a]/50 backdrop-blur-sm sticky top-0 z-10">
                  <div className="flex gap-3">
                    <Input defaultValue={MOCK_DATA.id} />
                    <Button variant="primary" onClick={handleRefresh} icon={loading ? RefreshCw : Search} className="w-12 px-0">
                      {/* Icon only */}
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-6">
                  
                  {/* Header Info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold text-white tracking-tight">
                          {MOCK_DATA.price}
                        </h2>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge active={true} />
                        <span className="text-xs text-[#666] font-mono">#{MOCK_DATA.id}</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] uppercase tracking-wider text-[#666] font-semibold mb-1">Тариф</p>
                       <div className="flex items-center justify-end gap-1.5 text-sm font-medium text-white bg-[#111] px-2 py-1 rounded-md border border-[#222]">
                          <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
                          {MOCK_DATA.plan}
                       </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#333] to-transparent" />

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-[#111]/50 border border-[#222]">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-[#1a1a1a] text-[#888]">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs text-[#666]">Истекает</p>
                          <p className="text-sm font-mono text-[#ededed]">{MOCK_DATA.expiry}</p>
                        </div>
                      </div>
                      <div className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded border border-orange-400/20">
                        7 дней
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Button fullWidth variant="primary" icon={CreditCard} onClick={handleExtendClick}>
                      Продлить
                    </Button>
                    <Button fullWidth variant="secondary" icon={RefreshCw}>
                      Обновить
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {extendStep === 'devices' && (
              <motion.div
                key="devices"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="p-6 space-y-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" onClick={() => setExtendStep('none')}>
                    <ChevronRight className="w-5 h-5 rotate-180" />
                  </Button>
                  <h3 className="text-lg font-bold text-white">Количество устройств</h3>
                </div>

                <div className="flex flex-col items-center justify-center py-6 space-y-8">
                   <div className="flex items-center gap-6">
                      <button 
                        onClick={() => setSelectedDevices(Math.max(1, selectedDevices - 1))}
                        className="w-14 h-14 rounded-full bg-[#111] border border-[#333] text-white flex items-center justify-center hover:bg-[#222] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={selectedDevices <= 1}
                      >
                        <Minus className="w-6 h-6" />
                      </button>
                      
                      <div className="flex flex-col items-center w-24">
                        <span className="text-5xl font-black text-white tracking-tighter">{selectedDevices}</span>
                        <span className="text-xs text-[#666] uppercase tracking-wider font-medium mt-1">Device{selectedDevices > 1 ? 's' : ''}</span>
                      </div>

                      <button 
                        onClick={() => setSelectedDevices(selectedDevices + 1)}
                        className="w-14 h-14 rounded-full bg-[#111] border border-[#333] text-white flex items-center justify-center hover:bg-[#222] active:scale-95 transition-all"
                      >
                        <Plus className="w-6 h-6" />
                      </button>
                   </div>

                   <div className="w-full space-y-3">
                     <div className="flex justify-between items-center px-4 py-3 rounded-lg bg-[#111] border border-[#333]">
                        <span className="text-sm text-[#888]">Итого к оплате:</span>
                        <span className="text-lg font-bold text-white">{selectedDevices * 150} ₽</span>
                     </div>
                     <Button fullWidth variant="primary" onClick={() => setExtendStep('stub')}>
                       Продолжить
                     </Button>
                   </div>
                </div>
              </motion.div>
            )}

            {extendStep === 'stub' && (
              <motion.div
                key="stub"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]"
              >
                <div className="w-16 h-16 rounded-full bg-[#111] border border-[#333] flex items-center justify-center mb-2">
                  <CreditCard className="w-8 h-8 text-[#666]" />
                </div>
                <h3 className="text-xl font-bold text-white">Оплата</h3>
                <p className="text-[#666] text-sm max-w-[200px]">
                  Здесь будет платежный шлюз для {selectedDevices} устройств(а).
                </p>
                <Button variant="secondary" onClick={() => setExtendStep('none')} className="mt-4">
                  Вернуться назад
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Support Section */}
        <Card delay={0.3}>
          <button className="w-full p-4 flex items-center justify-between group hover:bg-[#111] transition-colors text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Техническая поддержка</h3>
                <p className="text-xs text-[#666]">Возникли вопросы? Мы поможем.</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#444] group-hover:text-white transition-colors" />
          </button>
        </Card>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-6 pb-12 flex flex-col items-center gap-4 text-xs text-[#444]"
        >
          <div className="flex gap-6">
            <a href="#" className="hover:text-[#888] transition-colors">Terms</a>
            <a href="#" className="hover:text-[#888] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[#888] transition-colors">Status</a>
          </div>
          <p>© 2026 TunnelFox Inc.</p>
        </motion.footer>
      </main>
    </div>
  );
}


