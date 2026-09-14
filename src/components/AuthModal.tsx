import React from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { X, ShieldAlert, LogOut, Loader2, Cloud, Lock, Scissors, SlidersHorizontal } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  googleUser: FirebaseUser | null;
  onLogin: () => Promise<void>;
  onLogout: () => Promise<void>;
  isLoggingIn: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  googleUser,
  onLogin,
  onLogout,
  isLoggingIn
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Content */}
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 z-10 flex flex-col">
        {/* Top bar with logo and close */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <img src="/sudpen-icon.png" alt="SUDPEN" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.src = '/sudpen-logo.png' }} />
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
              Area Riservata Sudpen
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 transition text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {!googleUser ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">Autenticazione Richiesta</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Accedi con il tuo account Google aziendale o autorizzato per sbloccare le funzionalità protette:
                </p>
              </div>

              {/* Locked Features Grid */}
              <div className="grid grid-cols-1 gap-2.5 max-w-xs mx-auto text-left py-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700">
                  <Cloud className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Esportazione e Salvataggio su Google Drive</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Modifica Listino Prezzi & Sconti</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold text-slate-700">
                  <Scissors className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>Ritaglio e Scontornamento PDF</span>
                </div>
              </div>

              <button
                onClick={async () => {
                  await onLogin();
                  onClose();
                }}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition active:scale-95 disabled:opacity-50 cursor-pointer mt-2"
              >
                {isLoggingIn ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#ffffff" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.18 4.114-3.5 0-6.353-2.853-6.353-6.353s2.853-6.353 6.353-6.353c1.558 0 2.977.562 4.09 1.493l3.056-3.056C19.23 2.503 15.93 1.2 12.24 1.2c-5.964 0-10.8 4.836-10.8 10.8 0 5.964 4.836 10.8 10.8 10.8 5.618 0 10.45-4.04 10.45-10.8 0-.648-.073-1.296-.2-1.915H12.24z" />
                  </svg>
                )}
                <span>Accedi con Google</span>
              </button>
            </div>
          ) : (
            <div className="space-y-5 text-center">
              {/* User profile picture / info */}
              <div className="flex flex-col items-center gap-2">
                <div className="relative">
                  {googleUser.photoURL ? (
                    <img
                      src={googleUser.photoURL}
                      alt={googleUser.displayName || 'Utente'}
                      className="w-16 h-16 rounded-full border-2 border-[#9e2a3b] shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-[#9e2a3b] text-white rounded-full flex items-center justify-center text-xl font-black shadow-md">
                      {googleUser.displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-xs">
                    <CheckIcon className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="space-y-0.5 mt-2">
                  <h4 className="text-base font-extrabold text-slate-900 leading-tight">
                    {googleUser.displayName}
                  </h4>
                  <p className="text-xs text-slate-400">{googleUser.email}</p>
                </div>
              </div>

              {/* Verified Badge / Success Message */}
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-left flex items-start gap-3">
                <span className="p-1 bg-emerald-500 text-white rounded-lg text-xs mt-0.5">✓</span>
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-emerald-900 uppercase tracking-wider block">
                    Accesso Autorizzato
                  </span>
                  <p className="text-[11px] text-emerald-700">
                    Sei correttamente autenticato. Tutte le funzionalità (Google Drive, Listino e Scontornamento PDF) sono sbloccate e attive.
                  </p>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={async () => {
                  await onLogout();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 h-12 rounded-xl text-xs font-bold transition active:scale-95 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                <span>Scollega Account Google</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
