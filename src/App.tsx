import React, { useState, useEffect } from 'react';
import { AgendaModel, ColorOption } from './types';
import { loadStoredCatalog } from './data/catalog';
import { Header } from './components/Header';
import { CatalogSection } from './components/CatalogSection';
import { CompareSection } from './components/CompareSection';
import { CustomizeSection } from './components/CustomizeSection';
import { OrderSheet } from './components/OrderSheet';
import { PrintTechniqueModal } from './components/PrintTechniqueModal';
import { PdfCroppingTool } from './components/PdfCroppingTool';
import { CatalogPageModal } from './components/CatalogPageModal';
import { ImageZoomModal } from './components/ImageZoomModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';

export default function App() {
  const [activePage, setActivePage] = useState<'catalog' | 'compare' | 'customize' | 'checkout'>('catalog');

  const [techniqueModalOpen, setTechniqueModalOpen] = useState(false);
  const [pdfCropperOpen, setPdfCropperOpen] = useState(false);
  const [catalogPageModalOpen, setCatalogPageModalOpen] = useState(false);
  const [catalogPageAgenda, setCatalogPageAgenda] = useState<AgendaModel | null>(null);
  const [catalogPageColor, setCatalogPageColor] = useState<ColorOption | null>(null);

  // Mobile Simple Zoom State
  const [mobileZoomOpen, setMobileZoomOpen] = useState(false);
  const [mobileZoomAgenda, setMobileZoomAgenda] = useState<AgendaModel | null>(null);
  const [mobileZoomColor, setMobileZoomColor] = useState<ColorOption | null>(null);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [catalogModels, setCatalogModels] = useState<AgendaModel[]>(() => loadStoredCatalog());
  const [availableCoverFiles, setAvailableCoverFiles] = useState<string[]>([]);

  const handleProductImageClick = (agenda: AgendaModel, color?: ColorOption) => {
    const chosenColor = color || agenda.colori?.[0] || null;
    if (isMobile) {
      // Nella versione mobile (NB): elimina del tutto l'accesso all'approfondimento catalogo ufficiale
      // e sostituisci con un semplice zoom immagine touch-friendly
      setMobileZoomAgenda(agenda);
      setMobileZoomColor(chosenColor);
      setMobileZoomOpen(true);
    } else {
      // Versione desktop: approfondimento catalogo ufficiale
      setCatalogPageAgenda(agenda);
      setCatalogPageColor(chosenColor);
      setCatalogPageModalOpen(true);
    }
  };

  // Page 2 State: selections added for comparison
  const [compareItems, setCompareItems] = useState<{ id: string; agenda: AgendaModel; colore: ColorOption; qty: number }[]>([]);

  // Page 3 & 4 State: cart items chosen for custom production
  const [cartItems, setCartItems] = useState<{ id: string; agenda: AgendaModel; colore: ColorOption; qty: number }[]>([]);

  // Global Personalization variables
  const [tecnica, setTecnica] = useState<'neutra' | 'termoincisione' | 'stampa_caldo'>('stampa_caldo');
  const [coloreStampa, setColoreStampa] = useState<string>('Oro');
  const [testoPersonalizzato, setTestoPersonalizzato] = useState<string>('');
  const [stileCarattere, setStileCarattere] = useState<string>('Script Corsivo');
  const [usaLogo, setUsaLogo] = useState<boolean>(false);

  // Committente variables editable directly in Step 4
  const [cliente, setCliente] = useState({
    nome: '',
    azienda: '',
    piva: '',
    tel: '',
    email: '',
    citta: 'Ostuni',
    note: ''
  });

  const [codiceOrdine] = useState(() => `AG-2027-${Math.floor(1000 + Math.random() * 9000)}`);
  const [dataCreazione] = useState(() => new Date().toLocaleDateString('it-IT'));

  // Fetch available crops list from disk
  const refreshAvailableCrops = async () => {
    try {
      const res = await fetch('/api/crop-status');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data.covers)) {
          setAvailableCoverFiles(data.covers);
        }
      }
    } catch (err) {
      console.error('Error fetching crops list:', err);
    }
  };

  useEffect(() => {
    refreshAvailableCrops();
  }, []);

  // Handlers for Page 1 & 2 "Confronto" list
  const handleAddToCompare = (agenda: AgendaModel, colore: ColorOption) => {
    setCompareItems((prev) => {
      const existing = prev.find(
        (item) => item.agenda.id === agenda.id && item.colore.nome === colore.nome
      );
      if (existing) {
        return prev;
      }
      return [
        ...prev,
        {
          id: `comp-${agenda.id}-${colore.nome.replace(/\s+/g, '-')}-${Date.now()}`,
          agenda,
          colore,
          qty: 1 // Default start quantity is 1 pz
        }
      ];
    });
  };

  const handleUpdateCompareQty = (id: string, qty: number) => {
    setCompareItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  const handleRemoveCompareItem = (id: string) => {
    // Also remove from cart if present
    const compItem = compareItems.find((item) => item.id === id);
    if (compItem) {
      setCartItems((prev) =>
        prev.filter(
          (c) => !(c.agenda.id === compItem.agenda.id && c.colore.nome === compItem.colore.nome)
        )
      );
    }
    setCompareItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Handlers for Page 3 & 4 "Carrello" list
  const handleAddToCart = (item: { id: string; agenda: AgendaModel; colore: ColorOption; qty: number }) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (c) => c.agenda.id === item.agenda.id && c.colore.nome === item.colore.nome
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], qty: item.qty };
        return updated;
      }
      return [
        ...prev,
        {
          ...item,
          id: `cart-${item.agenda.id}-${item.colore.nome.replace(/\s+/g, '-')}-${Date.now()}`
        }
      ];
    });
  };

  const handleRemoveFromCart = (compareId: string) => {
    const compItem = compareItems.find((item) => item.id === compareId);
    if (!compItem) return;
    setCartItems((prev) =>
      prev.filter(
        (c) => !(c.agenda.id === compItem.agenda.id && c.colore.nome === compItem.colore.nome)
      )
    );
  };

  const handleUpdateCartQty = (id: string, qty: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty } : item))
    );
  };

  const handleImageSaved = (code: string, type: 'covers' | 'interiors', newUrl: string, colorSlug?: string) => {
    refreshAvailableCrops();
    const updated = catalogModels.map((m) => {
      if (m.codice === code) {
        if (type === 'covers') {
          if (colorSlug) {
            const variants = { ...(m.immaginiVariantiColore || {}), [colorSlug]: newUrl };
            return {
              ...m,
              immaginiVariantiColore: variants
            };
          } else {
            return { ...m, immagine: newUrl };
          }
        } else {
          return { ...m, immagineInterno: newUrl };
        }
      }
      return m;
    });
    setCatalogModels(updated);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f3f5] text-slate-900 font-sans selection:bg-[#9e2a3b] selection:text-white transition-colors">
      {/* Top Navigation Bar with Step counters */}
      <Header
        activePage={activePage}
        onGoToPage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        compareCount={compareItems.length}
        cartCount={cartItems.length}
      />

      {/* Main Pages router */}
      <main className="flex-1 pb-28 md:pb-0">
        {activePage === 'catalog' && (
          <CatalogSection
            models={catalogModels}
            compareItems={compareItems}
            onAddToCompare={handleAddToCompare}
            availableCoverFiles={availableCoverFiles}
            onGoToComparePage={() => {
              setActivePage('compare');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCatalogPage={handleProductImageClick}
          />
        )}

        {activePage === 'compare' && (
          <CompareSection
            compareItems={compareItems}
            cartItems={cartItems}
            onUpdateQty={handleUpdateCompareQty}
            onRemoveItem={handleRemoveCompareItem}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onGoToPage={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            availableCoverFiles={availableCoverFiles}
            onOpenCatalogPage={handleProductImageClick}
          />
        )}

        {activePage === 'customize' && (
          <CustomizeSection
            cartItems={cartItems}
            tecnica={tecnica}
            coloreStampa={coloreStampa}
            onChangeTecnica={setTecnica}
            onChangeColoreStampa={setColoreStampa}
            testoPersonalizzato={testoPersonalizzato}
            onChangeTestoPersonalizzato={setTestoPersonalizzato}
            stileCarattere={stileCarattere}
            onChangeStileCarattere={setStileCarattere}
            usaLogo={usaLogo}
            onChangeUsaLogo={setUsaLogo}
            onOpenTechniqueModal={() => setTechniqueModalOpen(true)}
            onGoToPage={(page) => {
              setActivePage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            availableCoverFiles={availableCoverFiles}
          />
        )}

        {activePage === 'checkout' && (
          <OrderSheet
            cartItems={cartItems}
            tecnica={tecnica}
            coloreStampa={coloreStampa}
            testoPersonalizzato={testoPersonalizzato}
            stileCarattere={stileCarattere}
            usaLogo={usaLogo}
            cliente={cliente}
            onChangeCliente={(field, value) => {
              setCliente((prev) => ({ ...prev, [field]: value }));
            }}
            codiceOrdine={codiceOrdine}
            dataCreazione={dataCreazione}
            onUpdateCartQty={handleUpdateCartQty}
          />
        )}
      </main>

      {/* Technique Guide Modal */}
      <PrintTechniqueModal
        isOpen={techniqueModalOpen}
        onClose={() => setTechniqueModalOpen(false)}
        currentTechniqueId={tecnica}
        onSelectTechnique={(techId) => setTecnica(techId as any)}
      />

      {/* PDF Cropping Tool (Preservato nel codice per riattivazione su richiesta) */}
      {pdfCropperOpen && (
        <PdfCroppingTool
          isOpen={pdfCropperOpen}
          onClose={() => setPdfCropperOpen(false)}
          onImageSaved={handleImageSaved}
        />
      )}

      {/* Deep-dive PDF Catalog Page Modal: ESCLUSIVO DESKTOP (eliminato del tutto su mobile) */}
      {!isMobile && catalogPageModalOpen && (
        <CatalogPageModal
          isOpen={catalogPageModalOpen}
          onClose={() => setCatalogPageModalOpen(false)}
          initialAgenda={catalogPageAgenda}
          initialColor={catalogPageColor}
          allModels={catalogModels}
          onAddToCompare={handleAddToCompare}
          isAddedToCompare={
            catalogPageAgenda
              ? compareItems.some(item => item.agenda.id === catalogPageAgenda.id)
              : false
          }
        />
      )}

      {/* Semplice Zoom Immagine Touch-Friendly per la versione mobile */}
      <ImageZoomModal
        isOpen={mobileZoomOpen}
        onClose={() => setMobileZoomOpen(false)}
        agenda={mobileZoomAgenda}
        initialColor={mobileZoomColor}
        availableCoverFiles={availableCoverFiles}
        onAddToCompare={handleAddToCompare}
        isAddedToCompare={
          mobileZoomAgenda
            ? compareItems.some(item => item.agenda.id === mobileZoomAgenda.id)
            : false
        }
      />

      {/* MOBILE TOTAL SWIPE: Barra fissa inferiore di navigazione a step */}
      <MobileBottomNav
        activePage={activePage}
        onGoToPage={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        compareCount={compareItems.length}
        cartCount={cartItems.length}
      />

      <Footer />
    </div>
  );
}
