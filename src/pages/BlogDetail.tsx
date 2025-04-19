import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Edit, Trash2, AlertCircle, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import type { Blog } from '../types';

const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const isAuthor = session?.user && blog?.author_id === session.user.id;
  
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id) return;
      
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select(`
            *,
            author:profiles(id, username, full_name, avatar_url, website)
          `)
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching blog:', error);
          toast.error('Blog not found');
          navigate('/');
          return;
        }
        
        if (data) {
          // Transform the nested author object to match our Blog type
          setBlog({
            ...data,
            author: data.author[0] || null
          });
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [id, navigate]);
  
  const handleDelete = async () => {
    if (!id || !isAuthor) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Blog deleted successfully');
        navigate('/');
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!blog) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-700">Blog not found</h2>
        <p className="text-gray-500 mt-2">
          The blog you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/" className="inline-block mt-4 text-blue-600 hover:text-blue-800">
          Back to home
        </Link>
      </div>
    );
  }

  // Get author display name - only use full_name or username
  const authorName = blog.author?.full_name || blog.author?.username;
  
  if (!authorName) {
    return null; // Don't show blogs without author information
  }
  
  const formattedDate = blog.created_at
    ? format(new Date(blog.created_at), 'MMMM d, yyyy')
    : '';
  
  return (
    <div className="max-w-4xl mx-auto">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
          
          <div className="flex items-center mb-8 text-gray-600">
            <div className="flex items-center">
              {blog.author?.avatar_url ? (
                <img
                  src={blog.author.avatar_url}
                  alt={authorName}
                  className="w-10 h-10 rounded-full mr-3 object-cover border-2 border-white shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-3 border-2 border-white shadow-sm">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{authorName}</p>
                <p className="text-sm text-gray-500">{formattedDate}</p>
              </div>
            </div>
          </div>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>
      
      {isAuthor && (
        <div className="mt-6 flex justify-end space-x-4">
          <Link
            to={`/blog/${blog.id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      )}
      
      {/* Delete confirmation modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this blog? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogDetail;