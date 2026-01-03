"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Sparkles, TrendingUp, Clock, Globe } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant Enhancement",
    description: "Get AI-powered suggestions in seconds. Transform your messages with one click.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your conversations are encrypted and never stored. Complete privacy guaranteed.",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Sparkles,
    title: "Smart AI",
    description: "Powered by advanced AI models that understand context and tone perfectly.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: TrendingUp,
    title: "Improve Over Time",
    description: "Track your progress and see how your communication skills evolve.",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "No more second-guessing. Get confident, polished messages instantly.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    icon: Globe,
    title: "Multi-Language",
    description: "Enhance messages in multiple languages with cultural context awareness.",
    color: "from-rose-400 to-red-500",
  },
];

export default function LandingFeatures() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Powerful Features for
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Better Communication
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Everything you need to enhance your conversations and build stronger relationships.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative"
            >
              <div className="relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                />

                {/* Icon */}
                <div className="relative z-10 mb-6">
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-white/70 leading-relaxed">{feature.description}</p>
                </div>

                {/* Shine Effect */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


