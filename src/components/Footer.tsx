import React from 'react';
import { BookOpen, ShieldCheck, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-xl bg-white p-1 overflow-hidden flex items-center justify-center">
                <img
                  src="/sudpen-logo.png"
                  alt="SUDPEN"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/sudpen-icon.png';
                  }}
                />
              </div>
              <span className="font-extrabold text-base tracking-tight">
                AGENDE <span className="text-[#9e2a3b]">SUDPEN 2027</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Tipografia, cartoleria e stampa promozionale specializzata in agende personalizzate, legatoria e merchandising aziendale.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Servizi & Garanzie
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>• Bozza grafica digitale gratuita</li>
              <li>• Incisione a caldo con clichè in magnesio</li>
              <li>• Consegna espressa con corriere tracciato</li>
              <li>• Campionatura fisica su richiesta</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Formati Disponibili
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>• A5 Giornaliera 15x21 cm classica</li>
              <li>• Settimanale 17x24 cm con elastico</li>
              <li>• Tascabile Mignon 9x13 cm</li>
              <li>• Executive A4 da scrivania in vera pelle</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Contatti & Assistenza
            </h4>
            <div className="space-y-2 text-[11px]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#f5c2c7]" />
                <span>0831 331209 • WA: 391 7972545</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#f5c2c7]" />
                <span>sudpenostuni@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#f5c2c7]" />
                <span>Via Cav. Vittorio Veneto 56, Ostuni (BR)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2027 SUDPEN - Collezione Agende 2027. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Configuratore Tecnico d&apos;Ordine</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
