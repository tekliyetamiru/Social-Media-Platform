'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Users, 
  Video, 
  Calendar, 
  MessageCircle, 
  Shield, 
  Zap,
  Globe,
  Heart,
  Camera,
  Music,
  Gamepad,
  Briefcase
} from 'lucide-react';

const features = [
  {
    icon: Video,
    title: 'Live Streaming',
    description: 'Go live and connect with your audience in real-time with crystal clear quality',
    color: 'from-red-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Communities',
    description: 'Create and join groups based on your interests and passions',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Calendar,
    title: 'Events',
    description: 'Host and discover events happening near you or online',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: MessageCircle,
    title: 'Direct Messaging',
    description: 'Chat privately with friends and communities with end-to-end encryption',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Privacy Controls',
    description: 'Full control over who sees your content and personal information',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'Fast & Responsive',
    description: 'Smooth experience across all devices with instant updates',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Camera,
    title: 'Stories & Reels',
    description: 'Share your daily moments with stories and create engaging reels',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: Music,
    title: 'Music Integration',
    description: 'Add your favorite tracks to posts and discover new music',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Gamepad,
    title: 'Gaming Hub',
    description: 'Connect with gamers, stream your gameplay, and join gaming communities',
    color: 'from-orange-500 to-red-500',
  },
];

export function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Everything you need to build, grow, and engage your community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${feature.color}`} />
              
              {/* Icon */}
              <div className={`relative mb-6 w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} p-4 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-full h-full" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative Line */}
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}