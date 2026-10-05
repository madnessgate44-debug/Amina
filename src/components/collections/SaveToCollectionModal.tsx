/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SavableType } from '../../types';
import { Bookmark, Plus, X, Check, Heart, FileText } from 'lucide-react';

interface SaveToCollectionModalProps {
  item: {
    type: SavableType;
    sourceId: string;
    title: string;
    subject?: string;
    snippet?: string;
  };
  onClose: () => void;
}

export const SaveToCollectionModal: React.FC<SaveToCollectionModalProps> = ({ item, onClose }) => {
  const { collections, savedItems, saveContent, createCollection, language, t } = useApp();
  const isAr = language === 'ar';

  const existingSaved = savedItems.find((s) => s.sourceId === item.sourceId);

  const [selectedColIds, setSelectedColIds] = useState<string[]>(
    existingSaved ? existingSaved.collectionIds : []
  );
  const [note, setNote] = useState<string>(existingSaved?.note || '');
  const [newColName, setNewColName] = useState<string>('');
  const [showAddColInput, setShowAddColInput] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const toggleCollection = (colId: string) => {
    setSelectedColIds((prev) =>
      prev.includes(colId) ? prev.filter((id) => id !== colId) : [...prev, colId]
    );
  };

  const handleCreateCollection = async () => {
    if (!newColName.trim()) return;
    const created = await createCollection(newColName.trim());
    setSelectedColIds((prev) => [...prev, created.id]);
    setNewColName('');
    setShowAddColInput(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveContent({
        type: item.type,
        sourceId: item.sourceId,
        title: item.title,
        subject: item.subject,
        snippet: item.snippet,
        note: note.trim() || undefined,
        collectionIds: selectedColIds,
      });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                {isAr ? 'حفظ إلى المجموعات الخاصة' : 'Save to Collections'}
              </h3>
              <p className="text-[10px] text-slate-400 truncate max-w-[240px]">
                {item.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* Collection Picker */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">
              {isAr ? 'اختر المجموعات:' : 'Select Collections:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {collections.map((col) => {
                const isSelected = selectedColIds.includes(col.id);
                return (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => toggleCollection(col.id)}
                    className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{isAr && col.nameAr ? col.nameAr : col.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Create new collection inline */}
            {!showAddColInput ? (
              <button
                type="button"
                onClick={() => setShowAddColInput(true)}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAr ? 'إنشاء مجموعة جديدة...' : 'Create new collection...'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={newColName}
                  onChange={(e) => setNewColName(e.target.value)}
                  placeholder={isAr ? 'اسم المجموعة الجديدة' : 'New collection name'}
                  className="flex-1 p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={handleCreateCollection}
                  className="py-2 px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                >
                  {isAr ? 'إضافة' : 'Add'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddColInput(false)}
                  className="p-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Attached Note */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-500" />
              <span>{isAr ? 'ملاحظة شخصية خاصة بك (اختياري):' : 'Personal Note (Optional):'}</span>
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب ملاحظة لنفسك لمراجعتها لاحقاً (مثال: أراجع المسألة رقم 3 مع الأستاذ)...'
                  : 'Add a personal note to review later...'
              }
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Privacy Notice: Self Only, No Public Sharing */}
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 leading-snug">
            {isAr
              ? '🔒 المحفوظات والملاحظات خاصة بك وحدك ولا تتم مشاركتها مع أي شخص.'
              : '🔒 Collections and notes are strictly private to you and never shared publicly.'}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="py-1.5 px-3.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
          >
            {t.common.cancel}
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="py-1.5 px-4 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-sm flex items-center gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>{isAr ? 'حفظ التغييرات' : 'Save Item'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
