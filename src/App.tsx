/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, PlayCircle, FileText, 
  Handshake, PhoneCall, ListChecks, Link as LinkIcon,
  Twitter, Linkedin, Facebook, ArrowRight, ArrowDown
} from 'lucide-react';

const Logo = ({ className = "h-26 w-auto sm:h-38" }: { className?: string }) => (
  <>
    <img src="https://lastingmark.com/wp-content/uploads/2026/05/CCP-dark.svg" alt="Client Connection Platform Logo" className={`object-contain drop-shadow-md dark:hidden ${className}`} />
    <img src="https://lastingmark.com/wp-content/uploads/2026/05/CCP-light.svg" alt="Client Connection Platform Logo" className={`object-contain drop-shadow-md hidden dark:block ${className}`} />
  </>
);

const GlobalParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const numParticles = Math.floor((window.innerWidth * window.innerHeight) / 12000); // Density of particles
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const primaryColor = '14, 116, 144'; // cyan-700 approx, or primary rgb from theme - let's use primary matching color #20a6b9 -> 32, 166, 185
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(32, 166, 185, 0.4)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 180) { // connection distance
            ctx.beginPath();
            ctx.strokeStyle = `rgba(32, 166, 185, ${0.4 * (1 - dist / 180)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[-10]" />;
};

const FeaturePoint = ({ number, title, description, isNew }: { number?: string, title: string, description: string, isNew?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: 0.1 }}
    className="relative pl-6 sm:pl-8 mb-6"
  >
    <div className="text-sm sm:text-base leading-relaxed">
      <span className="font-bold">
        {number && `${number}. `}
        {isNew && <span className="text-primary mr-1">(New!)</span>}
        {title}
      </span>
      {" - "}
      <span className="opacity-90">{description}</span>
    </div>
  </motion.div>
);

const CtaButton = ({ icon: Icon, text1, text2, href = "#", tooltip }: { icon: any, text1: string, text2: string, href?: string, tooltip?: string }) => (
  <motion.a
    href={href}
    target="_blank"            // Opens in new tab
    rel="noopener noreferrer" // Security best practice
    title={tooltip}           // Simple browser tooltip
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-4 bg-surface/50 border border-primary/30 p-4 rounded-xl hover:bg-primary/10 transition-colors shadow-lg w-full cta-pulse-animation"
  >
    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/20 text-primary">
      <Icon className="w-8 h-8" />
    </div>
    <div className="text-sm font-semibold flex flex-col">
      <span className="underline decoration-primary/50 underline-offset-4">{text1}</span>
      <span className="underline decoration-primary/50 underline-offset-4">{text2}</span>
    </div>
  </motion.a>
);

const StepCard = ({ number, icon: Icon, text1, text2, href = "#", tooltip }: { number: number, icon: any, text1: string, text2: string, href?: string, tooltip?: string }) => (
  <motion.a
    href={href}
    target="_blank"            
    rel="noopener noreferrer" 
    title={tooltip}           
    whileHover={{ scale: 1.05, y: -4 }}
    whileTap={{ scale: 0.95 }}
    className="flex flex-col items-center text-center gap-6 bg-surface border-2 border-primary/40 p-10 rounded-2xl hover:bg-primary/5 transition-colors shadow-2xl w-full h-full max-w-[380px] cta-pulse-animation relative"
  >
    <div className="absolute -top-6 bg-primary text-white w-12 h-12 flex items-center justify-center rounded-full text-2xl font-black shadow-lg border-4 border-surface">
      {number}
    </div>
    <motion.div 
      animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
      transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
      className="flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-full bg-primary/20 text-primary mt-4 shadow-[0_0_20px_rgba(32,166,185,0.4)]"
    >
      <Icon className="w-16 h-16 sm:w-20 sm:h-20" />
    </motion.div>
    <div className="text-[1.1rem] sm:text-xl font-bold flex flex-col gap-2 mt-2 flex-grow justify-center">
      <span className="underline decoration-primary/50 underline-offset-4 leading-tight">{text1}</span>
      <span className="underline decoration-primary/50 underline-offset-4 leading-tight">{text2}</span>
    </div>
  </motion.a>
);

const SocialButton = ({ icon: Icon, href, label }: { icon: any, href: string, label: string }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    title={label}
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    className="p-3 bg-surface border border-primary/20 hover:bg-primary/20 hover:border-primary text-primary rounded-full transition-all shadow-md flex items-center justify-center relative overflow-hidden group"
  >
    <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
    <Icon className="w-5 h-5 relative z-10" />
  </motion.a>
);

const MeshBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-20]">
    <motion.div
      animate={{
        x: ["0%", "15%", "-10%", "0%"],
        y: ["0%", "-15%", "10%", "0%"],
        scale: [1, 1.2, 0.9, 1],
        rotate: [0, 90, 180, 360]
      }}
      transition={{ duration: 25, ease: "linear", repeat: Infinity }}
      className="absolute -left-[10%] top-[10%] w-[50vw] h-[50vw] rounded-full bg-primary/20 blur-[120px] mix-blend-screen"
    />
    <motion.div
      animate={{
        x: ["0%", "-20%", "15%", "0%"],
        y: ["0%", "20%", "-15%", "0%"],
        scale: [1, 0.8, 1.3, 1],
        rotate: [360, 180, 90, 0]
      }}
      transition={{ duration: 30, ease: "linear", repeat: Infinity }}
      className="absolute right-[5%] top-[20%] w-[45vw] h-[45vw] rounded-full bg-[#177a88]/20 blur-[130px] mix-blend-screen"
    />
    <motion.div
       animate={{
        x: ["0%", "10%", "-20%", "0%"],
        y: ["0%", "-25%", "15%", "0%"],
        scale: [1, 1.4, 0.8, 1],
        rotate: [0, 180, 270, 360]
      }}
      transition={{ duration: 35, ease: "linear", repeat: Infinity }}
      className="absolute left-[30%] bottom-[-10%] w-[60vw] h-[60vw] rounded-full bg-primary/10 blur-[140px] mix-blend-screen"
    />
  </div>
);

export default function App() {
  return (
    <div className="min-h-screen selection:bg-primary/30 relative body-gradient-bg z-0 overflow-hidden">
      {/* Background gradients */}
      <MeshBackground />
      <GlobalParticles />

      {/* Header */}
      <header className="container mx-auto px-6 pt-6 pb-2 sm:py-8 flex flex-col sm:flex-row justify-between items-center relative z-10 w-full max-w-7xl gap-4 sm:gap-0">
        <Logo />
        <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-center sm:justify-end">
          <motion.button 
            onClick={() => document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth' })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hidden sm:block whitespace-nowrap bg-[#020408] border-2 border-primary text-primary px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-extrabold text-sm sm:text-base shadow-[0_0_10px_rgba(32,166,185,0.6)] hover:bg-[#051419] transition-colors uppercase cursor-pointer"
          >
            Get Started Now
          </motion.button>
          {/* Social Links */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <SocialButton 
              icon={Linkedin} 
              href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Flastingmark.com%2Fstop-chasing-leads-ccp%2F" 
              label="Share on LinkedIn" 
            />
            <SocialButton 
              icon={Twitter} 
              href="https://twitter.com/intent/tweet?url=https%3A%2F%2Flastingmark.com%2Fstop-chasing-leads-ccp%2F&text=Stop%20Hunting.%20Start%20Getting%20Hunted.%20Check%20out%20the%20Client%20Connection%20Platform!" 
              label="Share on X / Twitter" 
            />
            <SocialButton 
              icon={Facebook} 
              href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Flastingmark.com%2Fstop-chasing-leads-ccp%2F" 
              label="Share on Facebook" 
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-12 pb-10 max-w-7xl relative z-10">
        
        {/* Hero Section */}
        <div className="max-w-8xl mt-2 sm:mt-6">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg sm:text-xl font-bold tracking-widest text-primary mb-2"
          >
            THE V2 CLIENT CONNECTION PLATFORM
          </motion.h2>
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 1.2, bounce: 0.4 }}
            className="text-5xl sm:text-7xl md:text-8xl font-black leading-none tracking-tight mb-12 w-full block"
          >
            <motion.span 
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 6, ease: "linear", repeat: Infinity }}
              style={{ paddingBottom: '0.1em' }}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary bg-[length:200%_auto] drop-shadow-[0_0_8px_rgba(32,166,185,0.8)]"
            >
              STOP HUNTING.
            </motion.span>
            <motion.span 
              animate={{ backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }}
              transition={{ duration: 7, ease: "linear", repeat: Infinity }}
              style={{ paddingBottom: '0.1em' }}
              className="block bg-clip-text text-transparent bg-gradient-to-r from-white via-primary to-white bg-[length:200%_auto] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] mt-2"
            >
              START GETTING HUNTED.
            </motion.span>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl opacity-90 max-w-8xl leading-relaxed mb-6"
          >
            Are you blinded and confused by the 1,000 "shiny" objects in our industry? Do you have
            technology subscription, on top of technology subscription and still don't have a productive
            simple tool to handle your most important activity? <span className="font-bold text-primary">CONVERSATIONS!</span>
          </motion.p>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base sm:text-lg opacity-90 max-w-8xl leading-relaxed mb-16"
          >
            <span className="font-bold text-primary">There's great news!</span> The Client Connection Platform fixes all of that. An agent can now sign up and
            onboard in less than 10 minutes AND go to work and get to "first app" without wasting time and money
            on "toys" and "services". Welcome to the industry's first "10 minutes to your first conversation"!
          </motion.p>
        </div>

        {/* Features & Phone Layout */}
        <div className="flex flex-col lg:flex-row gap-8 xl:gap-12 relative w-full mb-24">
          
          {/* Left Column: Features */}
          <div className="lg:w-3/5 xl:w-2/3 z-10 flex-shrink-0">
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-start gap-[30px] mb-12">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block bg-primary text-white text-center px-8 py-3 rounded-full font-black text-xl shadow-lg shadow-primary/20"
              >
                SOME FEATURES
              </motion.div>
              <motion.button 
                onClick={() => document.getElementById('getting-started')?.scrollIntoView({ behavior: 'smooth' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#020408] border-2 border-primary text-primary text-center px-8 py-3 sm:py-4 rounded-full font-extrabold text-2xl shadow-[0_0_15px_rgba(32,166,185,0.6)] hover:bg-[#051419] transition-colors uppercase cursor-pointer w-full sm:w-auto"
              >
                Get Started Now
              </motion.button>
            </div>

            <div className="space-y-2 max-w-2xl relative">
              {/* Vertical line connecting features (desktop only approximation) */}
              <div className="absolute left-[11px] top-4 bottom-8 w-[2px] bg-primary/20 hidden sm:block" />
              
              <FeaturePoint 
                number="1"
                title="Softphone built in"
                description="We don't transfer out to cell phones because then we lose the Agent Monitoring featureset AND then we have to deal with spam blockers and ios updates blocking unknown numbers (this was a nightmare in V1)"
              />
              <FeaturePoint 
                number="2"
                title="Calls from $34 to $95"
                description="AI screened available (We have 10, 30, 60, 90, AI screened, TV Ad - Final Expense & Medicare available)"
              />
              <FeaturePoint 
                number="3"
                title="True hierarchy support for agency manager / with agent"
                description="monitoring, invite-to-hierarchy, agent schedule manager & AI Call Coaching"
              />
              <FeaturePoint 
                number="4"
                title="Outbound accompaniment"
                description="Lead list upload, manual dial & power dialer integrated within (WOW! a dialer, integrated within, for FREE)"
              />
              <FeaturePoint 
                number="5"
                title="FE, Medicare & Term Quoter built in (powered on the backend by CSG)"
                description="this alone makes the platform a net $0 - as the agent doesn't need Insurance Tool Kits"
              />
              <FeaturePoint 
                number="6"
                title="NIPR direct integration"
                description="producers resident & non-resident licenses are automatically pulled in at the time of registration, the system gates their states so the agent ONLY receives calls to them in their licensed states, and allows the agent to turn off certain states that they dont want to receive calls from - by FE or Medicare or both"
              />
              <FeaturePoint 
                number="7"
                isNew
                title="BOOTCAMPS! Coming this week!"
                description="Join LM bootcamps, join an agency manager's own dedicated private bootcamp, bring your leads, upload them into your dialer, receive inbound calls, monitor each other's calls, Admin Monitoring, Coaching and Barging."
              />
              <FeaturePoint 
                number="8"
                title="$65 per month + a couple cents per minute"
                description=""
              />
            </div>
          </div>

          {/* Right Column: Phone Mockup Image */}
          <div className="lg:w-2/5 xl:w-1/2 flex justify-center lg:justify-end items-start relative lg:mt-0 z-0">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
              className="relative w-full max-w-[500px] lg:max-w-[700px] xl:max-w-[800px] lg:scale-125 xl:scale-150 lg:origin-top-right lg:-mr-12 xl:-mr-16"
            >
              <motion.img 
                animate={{ y: [0, -15, 0], filter: ["drop-shadow(0px 0px 10px rgba(32,166,185,0.2))", "drop-shadow(0px 0px 30px rgba(32,166,185,0.6))", "drop-shadow(0px 0px 10px rgba(32,166,185,0.2))"] }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
                src="https://lastingmark.com/wp-content/uploads/2026/05/Client-Connection-Platform-Flyer-LM-AGENTS.png" 
                alt="Client Connection Platform Phone Mockup" 
                className="w-full h-auto drop-shadow-2xl"
              />
            </motion.div>
          </div>
        </div>

        {/* Bottom CTA Sections */}
        <div id="getting-started" className="flex flex-col gap-12 relative w-full mt-16 sm:mt-24">
          
          {/* Section 1 */}
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ 
                boxShadow: ["0px 0px 10px rgba(32, 166, 185, 0.4)", "0px 0px 30px rgba(32, 166, 185, 0.8)", "0px 0px 10px rgba(32, 166, 185, 0.4)"]
              }}
              transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" } }}
              className="bg-primary text-white px-8 sm:px-12 py-4 md:py-6 rounded-full font-black text-lg sm:text-xl md:text-2xl lg:text-3xl mb-10 md:mb-16 shadow-lg text-center w-full max-w-[90%] xl:max-w-max whitespace-normal"
            >
              3 SIMPLE STEPS TO GETTING STARTED - CLICK ON EACH:
            </motion.div>
            
            <div className="flex flex-col xl:flex-row items-stretch justify-center gap-10 xl:gap-8 w-full max-w-7xl pt-4">
              <div className="flex flex-1 justify-center">
                <StepCard
                  number={1} 
                  icon={PlayCircle}
                  text1="Watch the Overview"
                  text2="Video of the Client Connection Platform"
                  href="https://www.youtube.com/watch?v=S0goy275MPs"
                  tooltip="Click to watch video"
                />
              </div>
              <div className="hidden xl:flex self-center flex-shrink-0 text-primary animate-pulse">
                <ArrowRight className="w-16 h-16 drop-shadow-[0_0_10px_rgba(32,166,185,0.8)]" />
              </div>
              <div className="xl:hidden flex self-center flex-shrink-0 text-primary animate-pulse">
                <ArrowDown className="w-16 h-16 drop-shadow-[0_0_10px_rgba(32,166,185,0.8)]" />
              </div>
              <div className="flex flex-1 justify-center">
                <StepCard 
                  number={2}
                  icon={FileText}
                  text1="Sign-up for the Client"
                  text2="Connection Platform"
                  href="https://lastingmark.com/stop-chasing-leads-ccp/"
                  tooltip="Sign-up for the Client"
                />
              </div>
              <div className="hidden xl:flex self-center flex-shrink-0 text-primary animate-pulse">
                <ArrowRight className="w-16 h-16 drop-shadow-[0_0_10px_rgba(32,166,185,0.8)]" />
              </div>
              <div className="xl:hidden flex self-center flex-shrink-0 text-primary animate-pulse">
                <ArrowDown className="w-16 h-16 drop-shadow-[0_0_10px_rgba(32,166,185,0.8)]" />
              </div>
              <div className="flex flex-1 justify-center">
                <StepCard 
                  number={3}
                  icon={Handshake}
                  text1="Use this to Complete Your Onboarding"
                  text2="for the Client Connection Platform"
                  href="https://drive.google.com/file/d/1wT0TQwNEBMOyJYQMht3W-9bjDZbEpdyL/view"
                  tooltip="Onboarding for Client"
                />
              </div>
            </div>
          </div>
         

          {/* Section 2 */}
          <div className="flex flex-col items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ 
                boxShadow: ["0px 0px 10px rgba(32, 166, 185, 0.4)", "0px 0px 30px rgba(32, 166, 185, 0.8)", "0px 0px 10px rgba(32, 166, 185, 0.4)"]
              }}
              transition={{ boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 } }}
              className="bg-primary text-white px-8 sm:px-12 py-4 rounded-full font-black text-lg sm:text-xl mb-10 shadow-lg text-center w-full max-w-4xl"
            >
              ADDITIONAL RESOURCES - CLICK ON EACH:
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
              <CtaButton 
                icon={PhoneCall}
                text1="Check out this NEW"
                text2="FEATURE! The Dialer! WOW!"
                href="https://drive.google.com/file/d/1KfF4eIgDGIFq9Va3sb9TzvqcKNNUHmpG/view"
                tooltip="Check this out NOW"
              />
              <CtaButton 
                icon={ListChecks}
                text1="Review the Marketing Used"
                text2="to Generate Calls for the Client Connection Platform"
                href="https://docs.google.com/presentation/d/1RA83xejfLQxrYkcWjNsLrqBj_urBobZz62YRtBezzaA/edit?usp=sharing"
                tooltip="Review Marketing"
              />
              <CtaButton 
                icon={LinkIcon}
                text1="Use this Link to Register for"
                text2="the LIVE OVERVIEW of the Client Connection Platform"
                href="https://us02web.zoom.us/meeting/register/JnOFsOLWSfm-gCjNK7qhBQ#/registration"
                tooltip="Register Now"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="relative z-10 w-full pb-6 pt-10 flex flex-col items-center gap-[20px]">
          <div className="flex items-center gap-4 sm:gap-6">
            <SocialButton 
              icon={Linkedin} 
              href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Flastingmark.com%2Fstop-chasing-leads-ccp%2F" 
              label="Share on LinkedIn" 
            />
            <SocialButton 
              icon={Twitter} 
              href="https://twitter.com/intent/tweet?url=https%3A%2F%2Flastingmark.com%2Fstop-chasing-leads-ccp%2F&text=Stop%20Hunting.%20Start%20Getting%20Hunted.%20Check%20out%20the%20Client%20Connection%20Platform!" 
              label="Share on X / Twitter" 
            />
            <SocialButton 
              icon={Facebook} 
              href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Flastingmark.com%2Fstop-chasing-leads-ccp%2F" 
              label="Share on Facebook" 
            />
          </div>
          <div className="text-center font-medium opacity-80 text-lg">
            Powered by <a href="https://lastingmark.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline underline-offset-4 pointer-events-auto">Lasting Mark</a>
          </div>
        </footer>

      </main>
      
      {/* Decorative footer line */}
      <div className="w-full h-4 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
    </div>
  );
}
