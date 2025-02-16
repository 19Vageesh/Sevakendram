import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Bell, X } from 'lucide-react';

interface Notice {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function NoticePopup() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    loadActiveNotices();
  }, []);

  const loadActiveNotices = async () => {
    try {
      const { data, error } = await supabase
        .from('notices')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setNotices(data);
        setIsVisible(true);
      }
    } catch (error) {
      console.error('Error loading notices:', error);
    }
  };

  const handleNext = () => {
    setCurrentNoticeIndex((prev) => (prev + 1) % notices.length);
  };

  const handlePrevious = () => {
    setCurrentNoticeIndex((prev) => (prev - 1 + notices.length) % notices.length);
  };

  if (!isVisible || notices.length === 0) return null;

  const currentNotice = notices[currentNoticeIndex];

  return (
    <div className="fixed bottom-4 right-4 max-w-md w-full bg-gray-800 rounded-lg shadow-lg border border-red-500/50 z-50">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-white">{currentNotice.title}</h3>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-gray-300 mb-4 whitespace-pre-wrap">{currentNotice.content}</p>
        
        {notices.length > 1 && (
          <div className="flex justify-between items-center text-sm text-gray-400">
            <button
              onClick={handlePrevious}
              className="hover:text-white"
            >
              Previous
            </button>
            <span>
              {currentNoticeIndex + 1} of {notices.length}
            </span>
            <button
              onClick={handleNext}
              className="hover:text-white"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}