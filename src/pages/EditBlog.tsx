import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import type { Blog } from '../types';

type FormData = {
  title: string;
  content: string;
};

const EditBlog: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();
  
  useEffect(() => {
    const fetchBlog = async () => {
      if (!id || !session?.user) return;
      
      try {
        const { data, error } = await supabase
          .from('blogs')
          .select(`
            *,
            author:profiles(id, username, full_name)
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
          const blogData = {
            ...data,
            author: data.author[0] || null
          };
          
          // Check if user is the author
          if (blogData.author_id !== session.user.id) {
            toast.error('You do not have permission to edit this blog');
            navigate(`/blog/${id}`);
            return;
          }
          
          setBlog(blogData);
          reset({
            title: blogData.title,
            content: blogData.content,
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
  }, [id, session, navigate, reset]);
  
  const onSubmit = async (data: FormData) => {
    if (!id || !session?.user) return;
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('blogs')
        .update({
          title: data.title,
          content: data.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('author_id', session.user.id);
      
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Blog updated successfully!');
        navigate(`/blog/${id}`);
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Blog</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              {...register('title', {
                required: 'Title is required',
                minLength: {
                  value: 5,
                  message: 'Title must be at least 5 characters',
                },
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              rows={12}
              {...register('content', {
                required: 'Content is required',
                minLength: {
                  value: 50,
                  message: 'Content must be at least 50 characters',
                },
              })}
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
            ></textarea>
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/blog/${id}`)}
              className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;