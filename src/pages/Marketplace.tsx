import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Trash2, Check, Upload, Link } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Link as RouterLink } from 'react-router-dom';

interface ListingItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  seller_id: string;
  is_sold: boolean;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
}

export default function Marketplace() {
  const { user } = useAuth();
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageInputType, setImageInputType] = useState<'file' | 'url'>('file');
  const [newListing, setNewListing] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
  });

  useEffect(() => {
    if (user) {
      loadListings();
    }
  }, [user]);

  const closeModal = () => {
    setIsModalOpen(false);
    setNewListing({
      title: '',
      description: '',
      price: '',
      image_url: '',
    });
    setImageInputType('file');
  };

  const loadListings = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('listings')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching listings:', error);
        toast.error(`Failed to load listings: ${error.message}`);
        return;
      }

      setListings(data || []);
    } catch (error) {
      console.error('Unexpected error loading listings:', error);
      toast.error('An unexpected error occurred while loading listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('listings')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        toast.error('Failed to upload image');
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('listings')
        .getPublicUrl(filePath);

      setNewListing(prev => ({ ...prev, image_url: publicUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (listingId: string, sellerId: string) => {
    if (user?.id !== sellerId) {
      toast.error('You can only delete your own listings');
      return;
    }

    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);

      if (error) {
        console.error('Error deleting listing:', error);
        toast.error('Failed to delete listing');
        return;
      }

      toast.success('Listing deleted successfully');
      loadListings();
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const handleMarkAsSold = async (listingId: string, sellerId: string) => {
    if (user?.id !== sellerId) {
      toast.error('You can only update your own listings');
      return;
    }

    try {
      const { error } = await supabase
        .from('listings')
        .update({ is_sold: true })
        .eq('id', listingId);

      if (error) {
        console.error('Error marking as sold:', error);
        toast.error('Failed to mark as sold');
        return;
      }

      toast.success('Item marked as sold');
      loadListings();
    } catch (error) {
      console.error('Error marking as sold:', error);
      toast.error('Failed to mark as sold');
    }
  };

  const validateImageUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newListing.title || !newListing.description || !newListing.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!newListing.image_url) {
      toast.error('Please provide an image URL or upload an image');
      return;
    }

    if (imageInputType === 'url' && !validateImageUrl(newListing.image_url)) {
      toast.error('Please enter a valid image URL');
      return;
    }

    const price = parseFloat(newListing.price);
    if (isNaN(price) || price <= 0) {
      toast.error('Please enter a valid price');
      return;
    }

    try {
      setIsUploading(true);
      const { error } = await supabase.from('listings').insert([
        {
          title: newListing.title,
          description: newListing.description,
          price: price,
          image_url: newListing.image_url,
          seller_id: user?.id,
          is_sold: false,
        },
      ]);

      if (error) {
        console.error('Error creating listing:', error);
        toast.error('Failed to create listing');
        return;
      }

      toast.success('Item listed successfully!');
      closeModal();
      await loadListings();
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setIsUploading(false);
    }
  };

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeListings = filteredListings.filter(listing => !listing.is_sold);
  const soldListings = filteredListings.filter(listing => listing.is_sold);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-red-500">Marketplace</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors w-full md:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          List Item
        </button>
      </div>

      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search listings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg bg-black border border-red-900/20 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
        />
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
      </div>

      {activeListings.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No active listings found</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeListings.map((listing) => (
          <div key={listing.id} className="bg-black rounded-lg overflow-hidden shadow-lg border border-red-900/20 hover:border-red-500/30 transition-colors">
            {listing.image_url && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                  }}
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-white mb-2">{listing.title}</h2>
              <p className="text-gray-300 mb-3">{listing.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-red-400">₹{listing.price}</span>
                <div className="flex gap-2">
                  {user?.id === listing.seller_id && (
                    <>
                      <button
                        onClick={() => handleMarkAsSold(listing.id, listing.seller_id)}
                        className="bg-green-600 hover:bg-green-700 text-white p-2 rounded transition-colors"
                        title="Mark as sold"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(listing.id, listing.seller_id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded transition-colors"
                        title="Delete listing"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {user?.id !== listing.seller_id && (
                    <RouterLink
                      to={`/chat/${listing.seller_id}`}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors"
                    >
                      Contact Seller
                    </RouterLink>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {listing.profiles?.avatar_url && (
                  <img
                    src={listing.profiles.avatar_url}
                    alt={listing.profiles.full_name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/32x32?text=U';
                    }}
                  />
                )}
                <span className="text-sm text-gray-400">
                  Listed by {listing.profiles?.full_name || 'Anonymous'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-black rounded-lg p-6 w-full max-w-md border border-red-900/20">
            <h2 className="text-2xl font-bold mb-4 text-red-500">List New Item</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Title</label>
                <input
                  type="text"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-900 border border-red-900/20 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Description</label>
                <textarea
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-900 border border-red-900/20 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Price (₹)</label>
                <input
                  type="number"
                  value={newListing.price}
                  onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                  className="w-full p-2 rounded-lg bg-gray-900 border border-red-900/20 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-300">Image</label>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setImageInputType('file')}
                    className={`flex-1 p-2 rounded-lg transition-colors ${
                      imageInputType === 'file'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Upload className="w-4 h-4 inline-block mr-2" />
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageInputType('url')}
                    className={`flex-1 p-2 rounded-lg transition-colors ${
                      imageInputType === 'url'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Link className="w-4 h-4 inline-block mr-2" />
                    Image URL
                  </button>
                </div>

                {imageInputType === 'file' ? (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-red-900/20 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-400">
                        <label className="relative cursor-pointer rounded-md font-medium text-red-500 hover:text-red-400">
                          <span>Upload a file</span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file);
                            }}
                            disabled={isUploading}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                ) : (
                  <input
                    type="url"
                    value={newListing.image_url}
                    onChange={(e) => setNewListing({ ...newListing, image_url: e.target.value })}
                    placeholder="Enter image URL"
                    className="w-full p-2 rounded-lg bg-gray-900 border border-red-900/20 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-white"
                  />
                )}

                {isUploading && (
                  <p className="mt-2 text-sm text-red-500">Uploading image...</p>
                )}
                {newListing.image_url && (
                  <div className="mt-2">
                    <img
                      src={newListing.image_url}
                      alt="Preview"
                      className="h-20 w-20 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x300?text=Invalid+Image';
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded bg-gray-900 hover:bg-gray-800 transition-colors text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition-colors text-white"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : 'List Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}