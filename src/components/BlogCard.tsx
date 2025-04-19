import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { User } from 'lucide-react';
import type { Blog } from '../types';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  // Extract preview text from content (first 150 characters)
  const previewText = blog.content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .slice(0, 150) + (blog.content.length > 150 ? '...' : '');

  // Format the date
  const formattedDate = format(new Date(blog.created_at), 'MMM d, yyyy');

  // Get author display name - only use full_name or username
  const authorName = blog.author?.full_name || blog.author?.username;

  if (!authorName) {
    return null; // Don't show blogs without author information
  }

  return (
    <div className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="p-6">
        <Link to={`/blog/${blog.id}`}>
          <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-3 line-clamp-2">
            {blog.title}
          </h2>
        </Link>
        
        <div className="flex items-center mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            {blog.author?.avatar_url ? (
              <img
                src={blog.author.avatar_url}
                alt={authorName}
                className="w-8 h-8 rounded-full mr-2 object-cover border-2 border-white shadow-sm"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-2 border-2 border-white shadow-sm">
                <User className="w-4 h-4 text-blue-600" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{authorName}</span>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{previewText}</p>
        
        <Link
          to={`/blog/${blog.id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium group-hover:translate-x-1 transition-transform"
        >
          Read more
          <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;