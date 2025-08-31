import React from "react";
import { motion } from "framer-motion"; 
import { Button } from "@/components/ui/button";


export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <section>
      {/* HERO SECTION*/}
      <div className="relative w-full flex flex-col items-center justify-center text-center px-4 py-16 md:py-24 bg-gradient-to-br from-pink-50 via-purple-50 to-background overflow-hidden">
        

        <div className="relative group mb-6">

          <img
            src="\images\logosvg.svg" 
            alt="Baby Chub Mascot Sleeping"
            className="w-48 h-48 md:w-56 md:h-56 object-contain group-hover:opacity-0"
          />

          <img
            src="\images\logo-wow.svg"
            alt="Baby Chub Mascot Awake"
            className="absolute top-0 left-0 w-48 h-48 md:w-56 md:h-56 object-contain opacity-0 group-hover:opacity-100"
          />
        </div>
        
        {/* ส่วนข้อความ */}
        <motion.div
          className="max-w-2xl" 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p variants={itemVariants} className="text-sm font-bold uppercase text-primary tracking-widest mb-2">
            Smart Play for Bright Futures
          </motion.p>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-foreground">
            Turning screen time,
            <br />
            into learning time.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-muted-foreground mb-8">
            Curated educational toys for every age, every milestone.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button size="lg" className="bg-primary text-primary-foreground text-lg px-8 py-6 rounded-full hover:bg-primary/90 transition-transform hover:scale-105 shadow-lg">
              Explore Now
            </Button>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}