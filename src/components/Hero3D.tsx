import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial, Float, Torus, Box } from "@react-three/drei";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Mail, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRef } from "react";
import * as THREE from "three";

const AnimatedSphere = () => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere args={[1, 100, 200]} scale={2}>
        <MeshDistortMaterial
          color="#2dd4bf"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.1}
          metalness={0.3}
        />
      </Sphere>
    </Float>
  );
};

const FloatingTorus = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
      <Torus ref={meshRef} args={[0.8, 0.3, 16, 50]} position={position} scale={scale}>
        <meshStandardMaterial color={color} roughness={0.2} metalness={0.5} transparent opacity={0.8} />
      </Torus>
    </Float>
  );
};

const FloatingBox = ({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.8} floatIntensity={0.8}>
      <Box ref={meshRef} args={[0.8, 0.8, 0.8]} position={position} scale={scale}>
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} transparent opacity={0.7} />
      </Box>
    </Float>
  );
};

export const Hero3D = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh-bg">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-10, -10, -5]} intensity={0.5} color="#f472b6" />
          <pointLight position={[10, -10, 5]} intensity={0.5} color="#2dd4bf" />
          
          <AnimatedSphere />
          <FloatingTorus position={[-3.5, 2, -2]} color="#f472b6" scale={0.6} />
          <FloatingTorus position={[4, -1.5, -3]} color="#818cf8" scale={0.5} />
          <FloatingBox position={[3.5, 2.5, -2]} color="#2dd4bf" scale={0.5} />
          <FloatingBox position={[-4, -2, -2]} color="#fbbf24" scale={0.4} />
          
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.3} 
            enablePan={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0, rotateX: -90 }}
            animate={{ scale: 1, rotateX: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card mb-6 card-3d"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-foreground/80">{t.hero.badge}</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 50, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            style={{ perspective: '1000px' }}
          >
            {t.hero.title}{" "}
            <span className="text-gradient">{t.hero.titleHighlight}</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-accent hover:scale-105 transition-all duration-300 text-lg px-8 py-6 group shadow-lg hover:shadow-xl"
            >
              {t.hero.startAnalysis}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/pricing")}
              className="border-primary/30 hover:bg-primary/10 hover:border-primary/50 text-lg px-8 py-6 transition-all duration-300 hover:scale-105"
            >
              {t.hero.viewPricing}
            </Button>
          </motion.div>
          
          {/* Social Media Icons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex justify-center gap-6 mt-8"
          >
            <a href="mailto:contact@insightsphere.com" className="text-foreground/70 hover:text-foreground transition-colors">
              <Mail className="w-6 h-6" />
            </a>
            <a href="https://facebook.com/insightsphere" target="_blank" className="text-foreground/70 hover:text-foreground transition-colors">
              <Facebook className="w-6 h-6" />
            </a>
            <a href="https://twitter.com/insightsphere" target="_blank" className="text-foreground/70 hover:text-foreground transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="https://instagram.com/insightsphere" target="_blank" className="text-foreground/70 hover:text-foreground transition-colors">
              <Instagram className="w-6 h-6" />
            </a>
            <a href="https://youtube.com/insightsphere" target="_blank" className="text-foreground/70 hover:text-foreground transition-colors">
              <Youtube className="w-6 h-6" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground"
          >
            <motion.div 
              className="flex items-center gap-2 glass-card px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span>{t.hero.stat1}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 glass-card px-4 py-2 rounded-full"
              whileHover={{ scale: 1.05, y: -2 }}
            >
              <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span>{t.hero.stat2}</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background pointer-events-none" />
    </div>
  );
};