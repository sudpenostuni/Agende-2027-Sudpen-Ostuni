import React, { useState, useEffect } from 'react';
import { AgendaModel, ColorOption } from './types';
import { loadStoredCatalog, saveStoredCatalog, resetStoredCatalog } from './data/catalog';
import { Header } from './components/Header';
import { CatalogSection } from './components/CatalogSection';
import { CompareSection } from './components/CompareSection';
import { CustomizeSection } from './components/CustomizeSection';
import { OrderSheet } from './components/OrderSheet';
import { PrintTechniqueModal } from './components/PrintTechniqueModal';
import { PriceManagementModal } from './components/PriceManagementModal';
import { PdfCroppingTool } from './components/PdfCroppingTool';
import { Footer } from './components/Footer';
import { User as FirebaseUser } from 'firebase/auth';
import { initAuth, googleSignIn, googleLogout } from './utils/driveService';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [activePage, setActivePage] = useState<'catalog' | 'compare' | 'customize' | 'checkout'>('catalog');

  const [techniqueModalOpen, setTechniqueModalOpen] = useState(false);
  const [priceManagerOpen, setPriceManagerOpen] = useState(false);
  const [pdfCropperOpen, setPdfCropperOpen] = useState(false);
  const [catalogModels, setCatalogModels] = useState<AgendaModel[]>(() => loadStoredCatalog());
  const [availableCoverFiles, setAvailableCoverFiles] = useState<string[]>([]);

  // Google Authentication State
  const [googleUser, setGoogleUser] = useState<FirebaseUser | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

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

    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
      }
    } catch (err) {
      console.error('Error signing in:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    try {
      await googleLogout();
      setGoogleUser(null);
      setGoogleToken(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Handlers for Page 1 & 2 "Confronto" list
  const handleAddToCompare = (agenda: AgendaModel, colore: ColorOption) => {
    setCompareItems((prev) => {
      const existing = prev.find(
        (item) => item.agenda.id === agenda.id && item.colore.nome === colore.nome
      );
      if (existing) {
        // Already in comparison list, do nothing or let them know
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

  const handleSaveCatalog = (updatedModels: AgendaModel[]) => {
    saveStoredCatalog(updatedModels);
    setCatalogModels(updatedModels);
  };

  const handleResetCatalog = () => {
    const defaultModels = resetStoredCatalog();
    setCatalogModels(defaultModels);
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
    handleSaveCatalog(updated);
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
        onOpenPriceManager={() => setPriceManagerOpen(true)}
        onOpenPdfCropper={() => setPdfCropperOpen(true)}
        compareCount={compareItems.length}
        cartCount={cartItems.length}
        googleUser={googleUser}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      {/* Main Pages router */}
      <main className="flex-1">
        {activePage === 'catalog' && (
          <CatalogSection
            models={catalogModels}
            compareItems={compareItems}
            onAddToCompare={handleAddToCompare}
            onOpenPriceManager={() => setPriceManagerOpen(true)}
            onOpenPdfCropper={() => setPdfCropperOpen(true)}
            availableCoverFiles={availableCoverFiles}
            onGoToComparePage={() => {
              setActivePage('compare');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
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
            googleUser={googleUser}
            googleToken={googleToken}
            onGoogleLogin={handleGoogleLogin}
            onGoogleLogout={handleGoogleLogout}
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

      {/* Price and Stock Management Modal */}
      <PriceManagementModal
        isOpen={priceManagerOpen}
        onClose={() => setPriceManagerOpen(false)}
        models={catalogModels}
        onSaveCatalog={handleSaveCatalog}
        onResetCatalog={handleResetCatalog}
      />

      {/* PDF Cropping and Extraction Tool */}
      <PdfCroppingTool
        isOpen={pdfCropperOpen}
        onClose={() => setPdfCropperOpen(false)}
        onImageSaved={handleImageSaved}
      />

      {/* Global Reserved Area Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        googleUser={googleUser}
        onLogin={handleGoogleLogin}
        onLogout={handleGoogleLogout}
        isLoggingIn={isLoggingIn}
      />

      <Footer />
    </div>
  );
}
