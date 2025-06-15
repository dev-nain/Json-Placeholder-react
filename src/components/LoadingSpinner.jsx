import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="flex justify-center items-center py-12">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full"></div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;