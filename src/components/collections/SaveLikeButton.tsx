/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SavableType } from '../../types';
import { Heart, Bookmark } from 'lucide-react';
import { SaveToCollectionModal } from './SaveToCollectionModal';

interface SaveLikeButtonProps {
  sourceId: string;
  type: SavableType;
  title: string;
  subject?: string;
  snippet?: string;
  size?: 'sm' | 'md';
}

export const SaveLikeButton: React.FC<SaveLikeButtonProps> = ({
  sourceId,
  type,
  title,
  subject,
  snippet,
  size = 'sm',
}) => {
  const { savedItems, toggleLikeContent, language } = useApp();
  const isAr = language === 'ar';

  const [showModal, setShowModal] = useState<boolean>(false);

  const savedRecord = savedItems.find((s) => s.sourceId === sourceId);
  const isLiked = Boolean(savedRecord?.isLiked);
  const isSaved = Boolean(savedRecord && savedRecord.collectionIds.length > 0);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await toggleLikeContent(sourceId, {
      type,
      title,
      subject,
      snippet,
    });
  };

  const handleOpenSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowModal(true);
  };

  const iconClass = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4';
  const btnClass = size === 'sm' ? 'p-1.5 rounded-lg text-xs' : 'p-2 rounded-xl text-sm';

  return (
    <>
      <div className="flex items-center gap-1">
        {/* Like / Heart Button */}
        <button
          type="button"
          onClick={handleLike}
          title={isLiked ? (isAr ? 'إلغاء الإعجاب' : 'Unlike') : (isAr ? 'إعجاب' : 'Like')}
          className={`${btnClass} transition-colors ${
            isLiked
              ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100'
              : 'text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Heart className={`${iconClass} ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Save / Bookmark Button */}
        <button
          type="button"
          onClick={handleOpenSave}
          title={isSaved ? (isAr ? 'محفوظ في المجموعات' : 'Saved in Collections') : (isAr ? 'حفظ إلى مجموعة' : 'Save to Collection')}
          className={`${btnClass} transition-colors ${
            isSaved
              ? 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100'
              : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bookmark className={`${iconClass} ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {showModal && (
        <SaveToCollectionModal
          item={{ sourceId, type, title, subject, snippet }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};
