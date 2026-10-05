/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, KeyRound, Mail, User, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ParentAuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const ParentAuthModal: React.FC<ParentAuthModalProps> = ({ onClose, onSuccess }) => {
  const { parentAccount, linkParent, verifyAndEnterParentMode, language, t } = useApp();
  const isAr = language === 'ar';

  const isAlreadyLinked = Boolean(parentAccount && parentAccount.isLinked);

  // Form states
  const [parentEmail, setParentEmail] = useState<string>(parentAccount?.parentEmail || '');
  const [parentName, setParentName] = useState<string>(parentAccount?.parentName || '');
  const [pin, setPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin.length < 4) {
      setError(isAr ? 'يجب أن يتكون رمز المرور (PIN) من 4 أرقام على الأقل.' : 'PIN must be at least 4 digits.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isAlreadyLinked) {
        // Verification login mode
        const valid = await verifyAndEnterParentMode(pin);
        if (valid) {
          onSuccess();
        } else {
          setError(isAr ? 'رمز المرور (PIN) غير صحيح.' : 'Incorrect parent PIN.');
        }
      } else {
        // Setup mode
        if (pin !== confirmPin) {
          setError(isAr ? 'رمز المرور غير متطابق.' : 'PIN confirmation does not match.');
          setIsSubmitting(false);
          return;
        }
        if (!parentEmail.includes('@')) {
          setError(isAr ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
          setIsSubmitting(false);
          return;
        }

        await linkParent({
          parentEmail,
          parentName: parentName || (isAr ? 'ولي الأمر' : 'Parent'),
          pin,
        });
        await verifyAndEnterParentMode(pin);
        onSuccess();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-linear-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold">
                {isAlreadyLinked
                  ? isAr ? 'تسجيل دخول ولي الأمر' : 'Parent Login'
                  : isAr ? 'ربط وتفعيل حساب ولي الأمر' : 'Link Parent Account'}
              </h3>
              <p className="text-[10px] text-slate-300">
                {isAr ? 'ملخص أسبوعي وإشراف آمن باحترام كامل لخصوصية الطالب' : 'Weekly summary & safe settings with full student privacy'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {!isAlreadyLinked ? (
            <>
              {/* Transparency Notice */}
              <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/40 text-[11px] text-indigo-900 dark:text-indigo-200 space-y-1">
                <span className="font-bold block flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {isAr ? 'مبدأ الشفافية التامة:' : 'Full Transparency Principle:'}
                </span>
                <p className="leading-relaxed">
                  {isAr
                    ? 'يتم إشعار الطالب بارتباط حسابك. يعرض حساب ولي الأمر ملخص الإنجاز والواجبات، ولا يُظهر المحادثات الخاصة أو الأخطاء الفردية.'
                    : 'The student is informed about this linked account. It shows broad weekly progress without exposing private chats or individual wrong answers.'}
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  {isAr ? 'الاسم:' : 'Name:'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 rtl:left-auto top-2.5" />
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder={isAr ? 'مثال: أبو عمر / أم سارة' : 'e.g. John Doe'}
                    className="w-full pl-9 rtl:pr-9 rtl:pl-3 p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                  {isAr ? 'البريد الإلكتروني:' : 'Email Address:'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 rtl:right-3 rtl:left-auto top-2.5" />
                  <input
                    type="email"
                    required
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full pl-9 rtl:pr-9 rtl:pl-3 p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    {isAr ? 'رمز المرور (PIN):' : 'PIN (4 digits):'}
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="w-full p-2 text-center font-mono tracking-widest text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1 block">
                    {isAr ? 'تأكيد الرمز:' : 'Confirm PIN:'}
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value)}
                    placeholder="••••"
                    className="w-full p-2 text-center font-mono tracking-widest text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 mx-auto flex items-center justify-center mb-2">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {isAr ? 'أدخل رمز المرور السري (PIN)' : 'Enter Parent PIN'}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {parentAccount?.parentName} ({parentAccount?.parentEmail})
                </p>
              </div>

              <div>
                <input
                  type="password"
                  maxLength={6}
                  autoFocus
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="••••"
                  className="w-full p-3 text-center font-mono tracking-widest text-lg rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="py-2 px-5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 shadow-sm flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>
                {isAlreadyLinked
                  ? isAr ? 'دخول لوحة التحكم' : 'Unlock Dashboard'
                  : isAr ? 'تأكيد وربط الحساب' : 'Link & Activate'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
