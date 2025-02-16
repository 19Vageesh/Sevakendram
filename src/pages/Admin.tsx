import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Bell, Plus, X, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

interface Notice {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

const ADMIN_EMAILS = ['nigga@student.nitw.ac.in'];

export default function Admin() {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_active: true
  });

  // Check if user is admin
  if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    loadNotices();
  }, []);

  const loadNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotices(data || []);
    } catch (error) {
      console.error('Error loading notices:', error);
      toast.error('Failed to load notices');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNotice) {
        const { error } = await supabase
          .from('notices')
          .update({
            title: formData.title,
            content: formData.content,
            is_active: formData.is_active
          })
          .eq('id', editingNotice.id);

        if (error) throw error;
        toast.success('Notice updated successfully');
      } else {
        const { error } = await supabase
          .from('notices')
          .insert([{
            title: formData.title,
            content: formData.content,
            is_active: formData.is_active
          }]);

        if (error) throw error;
        toast.success('Notice created successfully');
      }

      setIsModalOpen(false);
      setEditingNotice(null);
      setFormData({ title: '', content: '', is_active: true });
      loadNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      toast.error('Failed to save notice');
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      is_active: notice.is_active
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const { error } = await supabase
        .from('notices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Notice deleted successfully');
      loadNotices();
    } catch (error) {
      console.error('Error deleting notice:', error);
      toast.error('Failed to delete notice');
    }
  };

  const toggleNoticeStatus = async (notice: Notice) => {
    try {
      const { error } = await supabase
        .from('notices')
        .update({ is_active: !notice.is_active })
        .eq('id', notice.id);

      if (error) throw error;
      toast.success(`Notice ${notice.is_active ? 'deactivated' : 'activated'} successfully`);
      loadNotices();
    } catch (error) {
      console.error('Error toggling notice status:', error);
      toast.error('Failed to update notice status');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-500">Admin Dashboard</h1>
        <button
          onClick={() => {
            setEditingNotice(null);
            setFormData({ title: '', content: '', is_active: true });
            setIsModalOpen(true);
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Notice
        </button>
      </div>

      <div className="grid gap-6">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`bg-gray-800 rounded-lg p-6 border ${
              notice.is_active ? 'border-red-500/50' : 'border-gray-700'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">{notice.title}</h2>
                <p className="text-gray-400 text-sm">
                  Posted on {new Date(notice.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleNoticeStatus(notice)}
                  className={`p-2 rounded-lg ${
                    notice.is_active
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-gray-700/50 text-gray-400'
                  }`}
                  title={notice.is_active ? 'Active' : 'Inactive'}
                >
                  <Bell className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit(notice)}
                  className="p-2 rounded-lg bg-blue-500/10 text-blue-400"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(notice.id)}
                  className="p-2 rounded-lg bg-red-500/10 text-red-400"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <p className="text-gray-300 whitespace-pre-wrap">{notice.content}</p>
          </div>
        ))}

        {notices.length === 0 && (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <Bell className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No notices yet</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-500">
                {editingNotice ? 'Edit Notice' : 'New Notice'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                  rows={6}
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-600 text-red-500 focus:ring-red-500"
                />
                <label htmlFor="is_active" className="ml-2 text-gray-300">
                  Make notice active
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                >
                  {editingNotice ? 'Update Notice' : 'Create Notice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}