import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import BlogCard from '../components/BlogCard';
import Pagination from '../components/Pagination';
import type { Blog } from '../types';
import { Bookmark, Search } from 'lucide-react';

const BLOGS_PER_PAGE = 6;

const Home: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      
      // Calculate pagination
      const from = (currentPage - 1) * BLOGS_PER_PAGE;
      const to = from + BLOGS_PER_PAGE - 1;
      
      let query = supabase
        .from('blogs')
        .select(`
          id,
          title,
          content,
          created_at,
          updated_at,
          author_id,
          author:profiles!blogs_author_id_fkey (
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      // Apply search filter if query exists
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      // Get count for pagination
      const { count } = await query.select('*', { count: 'exact', head: true });
      
      if (count) {
        setTotalPages(Math.ceil(count / BLOGS_PER_PAGE));
      }
      
      // Get blogs with author information
      const { data, error } = await query.range(from, to);
      
      if (error) {
        console.error('Error fetching blogs:', error);
      } else if (data) {
        // Transform the nested author object to match our Blog type
        const formattedBlogs = data.map(blog => ({
          ...blog,
          author: blog.author || null
        }));
        setBlogs(formattedBlogs);
      }
      
      setLoading(false);
    };
    
    fetchBlogs();
  }, [currentPage, searchQuery]);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-16 mb-12 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-[length:16px_16px]"></div>
        <div className="relative max-w-3xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Welcome to BlogSpace
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            Discover thought-provoking articles and share your own stories with our community
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-3 pl-12 rounded-lg bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-200 h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <Bookmark className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700">No blogs found</h2>
          <p className="text-gray-500 mt-2">
            {searchQuery ? 'Try different search terms' : 'Be the first to publish a blog!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;