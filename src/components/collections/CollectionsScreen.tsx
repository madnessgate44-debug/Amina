import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { storageService } from '../../services/storage';
import { ensureDefaultCollections } from '../../services/collections/collectionService';
import { Collection, SavedItem } from '../../types';
import { Heart, Bookmark } from 'lucide-react';

export const CollectionsScreen: React.FC = () => {
  const { language, student } = useApp();
  const isAr = language === 'ar';
  const [collections, setCollections] = useState<Collection[]>([]);
  const [items, setItems] = useState<SavedItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!student?.id) return;
    Promise.all([
      ensureDefaultCollections(student.id, storageService),
      storageService.getSavedItems(student.id),
    ]).then(([cols, saved]) => {
      setCollections(cols);
      setItems(saved);
      setSelectedId((current) => current || cols[0]?.id || null);
    });
  }, [student?.id]);

  const selected = collections.find((c) => c.id === selectedId);
  const visible = selected ? items.filter((item) => selected.itemIds.includes(item.id)) : items;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 max-w-lg mx-auto w-full pb-24 space-y-4" dir={isAr ? 'rtl' : 'ltr'}>
      <div>
        <h1 className="text-2xl font-black">{isAr ? 'المحفوظات والمجموعات' : 'Saved & Collections'}</h1>
        <p className="text-xs text-slate-500 mt-1">{isAr ? 'كل ما حفظتيه من عالمك الدراسي في مكان واحد.' : 'Everything you saved from your learning world, in one place.'}</p>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {collections.map((collection) => (
          <button key={collection.id} type="button" onClick={() => setSelectedId(collection.id)} className={`shrink-0 px-3 py-2 rounded-xl text-xs font-black border ${selectedId === collection.id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
            {isAr ? collection.nameAr || collection.name : collection.name}
          </button>
        ))}
      </div>
      <div className="space-y-2">
        {visible.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-sm text-slate-500">
            <Bookmark className="w-7 h-7 mx-auto mb-2" />
            {isAr ? 'لسه مفيش حاجات محفوظة هنا.' : 'Nothing saved here yet.'}
          </div>
        ) : visible.map((item) => (
          <div key={item.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div><h3 className="text-sm font-black">{item.title}</h3><p className="text-[11px] text-slate-500 mt-1">{item.subject || item.type}</p></div>
              {item.isLiked && <Heart className="w-4 h-4 fill-current text-rose-500 shrink-0" />}
            </div>
            {item.snippet && <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">{item.snippet}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
