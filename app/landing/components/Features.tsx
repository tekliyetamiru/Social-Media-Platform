'use client';

import { motion } from 'framer-motion';
import { Users, Video, Calendar, MessageCircle, Shield, Zap } from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Live Streaming',
    description: 'Go live and connect with your audience in real-time',
  },
  {
    icon: Users,
    title: 'Communities',
    description: 'Create and join groups based on your interests',
  },
  {
    icon: Calendar,
    title: 'Events',
    description: 'Host and discover events happening near you',
  },
  {
    icon: MessageCircle,
    title: 'Direct Messaging',
    description: 'Chat privately with friends and communities',
  },
  {
    icon: Shield,
    title: 'Privacy Controls',
    description: 'Full control over who sees your content',
  },
  {
    icon: Zap,
    title: 'Fast & Responsive',
    description: 'Smooth experience across all devices',
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to build and grow your community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition"
            >
              <feature.icon className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}