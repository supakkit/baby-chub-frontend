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
        relative overflow-hidden group
        selection:bg-muted selection:text-secondary-foreground
      "
    >
      {/* Colorful background (on-brand) */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-32 h-64 w-64 rounded-full blur-3xl bg-pink-200/40" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl bg-purple-200/40" />
        {/* veil */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50/70 via-background/0 to-purple-50/70 transition-opacity duration-300 group-hover:opacity-100" />
      </div>

      <div className="w-full">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          {/* ↓ shorter hero: tighter vertical padding */}
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-10 py-6 md:py-8">
            {/* Left: logo */}
            <motion.div
              className="relative flex justify-center md:justify-start"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.img
                variants={itemVariants}
                src="/images/logotextvertical.svg"
                alt="Baby Chub logo"
                className="w-32 md:w-96 h-auto object-contain drop-shadow-sm"
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

              {/* Shorter headline */}
              <motion.h1
                variants={itemVariants}
                className="
                  text-3xl md:text-4xl font-bold leading-tight
                  text-foreground mb-2
                "
              >
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Turning screen time,
                </span><br></br>
                into learning time.
              </motion.h1>

              <motion.div variants={itemVariants} className="mb-4">
                <div className="text-base md:text-lg text-muted-foreground font-normal mt-2">
                  Digital products tailored by age and developmental milestones.
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Button
                size="lg"
                className="
                bg-primary text-primary-foreground
                text-base px-6 py-4 rounded-full
                hover:bg-primary/90 transition-transform hover:scale-[1.02] shadow-md"
                asChild>
                  <Link to="/library/reader">Explore Products</Link>
                  </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-6 py-4 rounded-full"
                >
                  <Link to="/how-it-works">How It Works</Link>
                </Button>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-3 text-sm text-foreground/80"
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
