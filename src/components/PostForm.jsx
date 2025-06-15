import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, PencilIcon } from '@heroicons/react/24/outline';

const PostForm = ({ 
  data, 
  onInputChange, 
  onSubmit, 
  isValid, 
  isUpdating, 
  buttonRef 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 mb-8"
    >
      <div className="flex items-center mb-6">
        <div className="bg-white/20 p-3 rounded-xl mr-4">
          {isUpdating ? (
            <PencilIcon className="w-6 h-6 text-white" />
          ) : (
            <PlusIcon className="w-6 h-6 text-white" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-white">
          {isUpdating ? 'Update Post' : 'Create New Post'}
        </h2>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-white font-medium mb-2">
            Post Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={data.title}
            onChange={onInputChange}
            placeholder="Enter an engaging title..."
            className="input-field"
          />
        </div>
        
        <div>
          <label htmlFor="body" className="block text-white font-medium mb-2">
            Post Content
          </label>
          <textarea
            id="body"
            name="body"
            value={data.body}
            onChange={onInputChange}
            placeholder="Share your thoughts..."
            rows="6"
            className="input-field resize-none"
          />
        </div>
        
        <div className="flex justify-end">
          <motion.button
            ref={buttonRef}
            type="button"
            onClick={onSubmit}
            disabled={!isValid}
            whileHover={{ scale: isValid ? 1.05 : 1 }}
            whileTap={{ scale: isValid ? 0.95 : 1 }}
            className="btn-primary flex items-center space-x-2"
          >
            {isUpdating ? (
              <>
                <PencilIcon className="w-5 h-5" />
                <span>Update Post</span>
              </>
            ) : (
              <>
                <PlusIcon className="w-5 h-5" />
                <span>Create Post</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default PostForm;