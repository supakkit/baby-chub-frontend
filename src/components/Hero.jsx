import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.18 } },
};

const itemVariants = {
  hidden: { y: 18, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45 } },
};

export default function Hero() {
  return (
    <section
      className="
        relative overflow-hidden group bg-transparent
        selection:bg-muted selection:text-secondary-foreground
      "
    >
      {/* พื้นหลังถูกลบไว้ให้โปร่งใส */}

      <div className="w-full">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {/* ↓ shorter hero: tighter vertical padding */}
          {/* มือถือ: padding มากขึ้นเล็กน้อย, เดสก์ท็อปเท่าเดิม */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10 py-8 md:py-8">
            {/* Left: logo */}
            <motion.div
              className="relative flex justify-center md:justify-start"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* มือถือ: โลโก้ใหญ่ขึ้น (w-56), เดสก์ท็อปคงเดิม (md:w-96) */}
              <motion.img
                variants={itemVariants}
                src="/images/logotextvertical.svg"
                alt="Baby Chub logo"
                className="w-56 md:w-96 h-auto object-contain drop-shadow-sm group-hover:hidden"
              />
              <motion.img
                variants={itemVariants}
                src="/images/logo-wow-with-text-vertical.png"
                alt="Baby Chub logo hover"
                className="w-56 md:w-96 h-auto object-contain drop-shadow-sm hidden group-hover:block"
              />
            </motion.div>

            {/* Right: copy & CTAs */}
            <motion.div
              className="text-center md:text-left max-w-xl md:max-w-lg justify-self-center md:justify-self-start"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="mb-2">
                <Badge variant="secondary" className="uppercase tracking-widest">
                  Parent-Approved Learning Play
                </Badge>
              </motion.div>

              {/* Headline: มือถืออ่านง่ายขึ้นเล็กน้อยด้วยระยะห่างมากขึ้น */}
              <motion.h1
                variants={itemVariants}
                className="
                  text-3xl md:text-4xl font-bold leading-tight
                  text-foreground mb-3 md:mb-2
                "
              >
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Turning screen time,
                </span>
                <br />
                into learning time.
              </motion.h1>

              <motion.div variants={itemVariants} className="mb-5 md:mb-4">
                <div className="text-base md:text-lg text-muted-foreground font-normal mt-2">
                  Digital products tailored by age and developmental milestones.
                </div>
              </motion.div>

              {/* CTAs: มือถือปุ่มเต็มความกว้าง, ช่องว่างมากขึ้นเพื่อกดง่าย */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Button
                  size="lg"
                  className="
                  w-full sm:w-auto
                  bg-primary text-primary-foreground
                  text-base px-6 py-4 rounded-full
                  hover:bg-primary/90 transition-transform hover:scale-[1.02] shadow-md"
                  asChild
                >
                  <Link to="/products">Explore Products</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto text-base px-6 py-4 rounded-full"
                >
                  <Link to="/how-it-works">How It Works</Link>
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-4 md:mt-3 text-sm text-foreground/80"
              >
                ★ Rated 4.9/5 by 10,000+ parents
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
