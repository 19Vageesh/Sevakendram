import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Camera, Package, ShoppingBag, FileWarning, Bell, Plus, X, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone_number: string;
}

interface ListingItem {
  id: string;
  title: string;
  price: number;
  is_sold: boolean;
  created_at: string;
}

interface Complaint {
  id: string;
  name: string;
  roll_number: string;
  room_number: string;
  complaint: string;
  created_at: string;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  is_active: boolean;
  created_at: string;
}

const ADMIN_EMAILS = ['nigga@student.nitw.ac.in'];

export default function UserProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'sold' | 'complaints' | 'notices'>('listings');
  const [isEditing, setIsEditing] = useState(false);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    is_active: true
  });
  const [editForm, setEditForm] = useState({
    full_name: '',
    phone_number: '',
  });

  const isAdmin = user && ADMIN_EMAILS.includes(user.email || '');

  useEffect(() => {
    if (user) {
      loadProfile();
      loadListings();
      loadComplaints();
      if (isAdmin) {
        loadNotices();
      }
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setEditForm({
        full_name: data.full_name || '',
        phone_number: data.phone_number || '',
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      toast.error('Failed to load profile');
    }
  };

  const loadListings = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('seller_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      console.error('Error loading listings:', error);
      toast.error('Failed to load listings');
    }
  };

  const loadComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints(data || []);
    } catch (error) {
      console.error('Error loading complaints:', error);
      toast.error('Failed to load complaints');
    }
  };

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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: editForm.full_name,
          phone_number: editForm.phone_number,
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditing(false);
      loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      toast.success('Avatar updated successfully');
      loadProfile();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    }
  };

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingNotice) {
        const { error } = await supabase
          .from('notices')
          .update({
            title: noticeForm.title,
            content: noticeForm.content,
            is_active: noticeForm.is_active
          })
          .eq('id', editingNotice.id);

        if (error) throw error;
        toast.success('Notice updated successfully');
      } else {
        const { error } = await supabase
          .from('notices')
          .insert([{
            title: noticeForm.title,
            content: noticeForm.content,
            is_active: noticeForm.is_active
          }]);

        if (error) throw error;
        toast.success('Notice created successfully');
      }

      setIsNoticeModalOpen(false);
      setEditingNotice(null);
      setNoticeForm({ title: '', content: '', is_active: true });
      loadNotices();
    } catch (error) {
      console.error('Error saving notice:', error);
      toast.error('Failed to save notice');
    }
  };

  const handleEditNotice = (notice: Notice) => {
    setEditingNotice(notice);
    setNoticeForm({
      title: notice.title,
      content: notice.content,
      is_active: notice.is_active
    });
    setIsNoticeModalOpen(true);
  };

  const handleDeleteNotice = async (id: string) => {
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-black rounded-xl p-6 shadow-xl border border-red-900/20 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-900 border-2 border-red-500">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-red-500">
                    <Camera className="w-12 h-12" />
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-red-500 p-2 rounded-full cursor-pointer hover:bg-red-600 transition-colors">
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex-1">
              {!isEditing ? (
                <div>
                  <h1 className="text-2xl font-bold text-red-500 mb-2">
                    {profile?.full_name || 'Anonymous'}
                    {isAdmin && <span className="ml-2 text-sm bg-red-500/20 text-red-400 px-2 py-1 rounded">Admin</span>}
                  </h1>
                  <p className="text-gray-400 mb-4">{profile?.phone_number}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      className="w-full p-2 rounded-lg bg-gray-900 border border-red-900/20 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.phone_number}
                      onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                      className="w-full p-2 rounded-lg bg-gray-900 border border-red-900/20 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="bg-black rounded-xl shadow-xl border border-red-900/20">
          <div className="flex border-b border-red-900/20">
            <button
              onClick={() => setActiveTab('listings')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'listings'
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <Package className="w-4 h-4 inline-block mr-2" />
              Active Listings
            </button>
            <button
              onClick={() => setActiveTab('sold')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'sold'
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <ShoppingBag className="w-4 h-4 inline-block mr-2" />
              Sold Items
            </button>
            <button
              onClick={() => setActiveTab('complaints')}
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'complaints'
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-400 hover:text-red-400'
              }`}
            >
              <FileWarning className="w-4 h-4 inline-block mr-2" />
              Complaints
            </button>
            {isAdmin && (
              <button
                onClick={() => setActiveTab('notices')}
                className={`flex-1 px-4 py-3 text-sm font-medium ${
                  activeTab === 'notices'
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-400 hover:text-red-400'
                }`}
              >
                <Bell className="w-4 h-4 inline-block mr-2" />
                Notices
              </button>
            )}
          </div>

          <div className="p-6">
            {activeTab === 'notices' && isAdmin ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-red-500">Manage Notices</h2>
                  <button
                    onClick={() => {
                      setEditingNotice(null);
                      setNoticeForm({ title: '', content: '', is_active: true });
                      setIsNoticeModalOpen(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    New Notice
                  </button>
                </div>

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
                          onClick={() => handleEditNotice(notice)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteNotice(notice.id)}
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
            ) : activeTab === 'complaints' ? (
              <div className="space-y-4">
                {complaints.length === 0 ? (
                  <p className="text-center text-gray-400">No complaints submitted yet</p>
                ) : (
                  complaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="bg-gray-900 rounded-lg p-4 border border-red-900/20"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-red-500">
                          Room {complaint.room_number}
                        </h3>
                        <span className="text-sm text-gray-400">
                          {new Date(complaint.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{complaint.complaint}</p>
                      <div className="text-sm text-gray-400">
                        <p>Name: {complaint.name}</p>
                        <p>Roll Number: {complaint.roll_number}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings
                  .filter((item) => activeTab === 'sold' ? item.is_sold : !item.is_sold)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="bg-gray-900 rounded-lg p-4 border border-red-900/20"
                    >
                      <h3 className="text-lg font-semibold text-red-500 mb-2">{item.title}</h3>
                      <p className="text-2xl font-bold text-white mb-2">₹{item.price}</p>
                      <p className="text-sm text-gray-400">
                        Listed on {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
              </div>
            )}

            {activeTab !== 'complaints' && activeTab !== 'notices' && 
              listings.filter((item) => activeTab === 'sold' ? item.is_sold : !item.is_sold).length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    {activeTab === 'sold'
                      ? 'No items sold yet'
                      : 'No active listings'}
                  </p>
                </div>
              )}
          </div>
        </div>
      </div>

      {/* Notice Modal */}
      {isNoticeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-red-500">
                {editingNotice ? 'Edit Notice' : 'New Notice'}
              </h2>
              <button
                onClick={() => setIsNoticeModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleNoticeSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Content
                </label>
                <textarea
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-700 border border-gray-600 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                  rows={6}
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={noticeForm.is_active}
                  onChange={(e) => setNoticeForm({ ...noticeForm, is_active: e.target.checked })}
                  className="rounded border-gray-600 text-red-500 focus:ring-red-500"
                />
                <label htmlFor="is_active" className="ml-2 text-gray-300">
                  Make notice active
                </label>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsNoticeModalOpen(false)}
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