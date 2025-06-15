import React from 'react';
import { motion } from 'framer-motion';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const PostCard = ({ post, onUpdate, onDelete, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="card-modern p-6 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <span className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              #{post.id}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
            {post.title}
          </h3>
          {post.body && (
            <p className="text-gray-600 text-sm line-clamp-3 mb-4">
              {post.body}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-100">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onUpdate(post)}
          className="btn-warning flex items-center space-x-2"
        >
          <PencilIcon className="w-4 h-4" />
          <span>Edit</span>
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onDelete(post)}
          className="btn-danger flex items-center space-x-2"
        >
          <TrashIcon className="w-4 h-4" />
          <span>Delete</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default PostCard;