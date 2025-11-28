import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingCart, Search, Menu, X, Trash2, CheckCircle, Wallet, CreditCard, QrCode, Loader2,ShieldCheck, Star, Zap, User
} from 'lucide-react';

// ==================== CONFIGURATION & ASSETS ====================

// Menggunakan gambar placeholder berkualitas tinggi yang sesuai tema Neon/Gaming
// karena environment ini tidak mendukung import file lokal secara langsung.
const ASSETS = {
  heroBanner: "my-roblox-store/src/assets/hero-banner.jpg", // Cyberpunk City Look
  qris: "my-roblox-store/src/assets/qris-image.jpg", // Placeholder QRIS Image
};

// ==================== TYPES ====================

type Category = 'All' | 'Items' | 'Robux' | 'Others';

interface Product {
  id: string;
  category: Category;
  name: string;
  price: number;
  image: string; // Emoji atau URL
  rating: number;
  sold: number;
  tag?: string; // e.g. "Rare", "Best Seller"
}

interface CartItem extends Product {
  quantity: number;
}

// ==================== DATA ====================

const PRODUCTS: Product[] = [
  { id: '1', category: 'Items', name: 'Golden Dominus Aureus', price: 550000, image: '🏆', rating: 5.0, sold: 120, tag: 'LEGENDARY' },
  { id: '2', category: 'Robux', name: '1,000 Robux (Fast)', price: 150000, image: '💎', rating: 4.9, sold: 2500, tag: 'INSTANT' },
  { id: '3', category: 'Robux', name: '2,200 Robux (Tax Free)', price: 320000, image: '💰', rating: 4.8, sold: 890, tag: 'POPULAR' },
  { id: '4', category: 'Items', name: 'Neon Valkyrie Helm', price: 1250000, image: '🛡️', rating: 5.0, sold: 45, tag: 'RARE' },
  { id: '5', category: 'Items', name: 'Cyber Wings Pack', price: 75000, image: '🧚', rating: 4.7, sold: 600 },
  { id: '6', category: 'Others', name: 'Level 75+ Account', price: 250000, image: '🎮', rating: 4.6, sold: 150 },
  { id: '7', category: 'Items', name: 'Korblox Deathspeaker', price: 1800000, image: '💀', rating: 5.0, sold: 88, tag: 'EPIC' },
  { id: '8', category: 'Others', name: 'Joki Rank Up (1 Hour)', price: 50000, image: '⚡', rating: 4.8, sold: 300 },
];

const PAYMENT_METHODS = [
  { id: 'qris', name: 'QRIS (All E-Wallet)', icon: <QrCode className="w-6 h-6" />, fee: 0 },
  { id: 'dana', name: 'DANA', icon: <Wallet className="w-6 h-6" />, fee: 1000 },
  { id: 'bca', name: 'Bank BCA', icon: <CreditCard className="w-6 h-6" />, fee: 2500 },
];

// ==================== UTILITIES ====================

const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// ==================== COMPONENTS ====================

// 1. Toast Notification
const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-[#1e1136]/90 backdrop-blur-xl border border-purple-500/50 text-white px-6 py-4 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-400" />
        <span className="font-medium tracking-wide">{message}</span>
      </div>
    </div>
  );
};

// 2. Sidebar Navigation
const Sidebar = ({ activeCategory, setCategory }: { activeCategory: Category, setCategory: (c: Category) => void }) => {
  const menuItems: { id: Category; label: string; icon: React.ReactNode }[] = [
    { id: 'All', label: 'Semua Produk', icon: <Zap className="w-5 h-5" /> },
    { id: 'Items', label: 'Limited Items', icon: <Star className="w-5 h-5" /> },
    { id: 'Robux', label: 'Robux Store', icon: <Wallet className="w-5 h-5" /> },
    { id: 'Others', label: 'Jasa & Akun', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 h-full bg-[#0d0417]/80 backdrop-blur-2xl border-r border-white/5 p-6 fixed left-0 top-0 z-20">
      <div className="mb-10 px-2 flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-purple-500/30">R</div>
        <h1 className="text-2xl font-bold tracking-wider text-white">
          ROBLOX <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">HUB</span>
        </h1>
      </div>

      <div className="space-y-2 flex-1">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4 mb-4">Marketplace</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCategory(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              activeCategory === item.id 
                ? 'bg-gradient-to-r from-purple-600/20 to-transparent border-l-4 border-purple-500 text-white' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white border-l-4 border-transparent'
            }`}
          >
            <span className={`relative z-10 ${activeCategory === item.id ? 'text-purple-400' : 'group-hover:text-purple-300'}`}>{item.icon}</span>
            <span className="relative z-10 font-medium text-sm">{item.label}</span>
            {activeCategory === item.id && <div className="absolute inset-0 bg-purple-500/5 blur-xl" />}
          </button>
        ))}
      </div>

      <div className="mt-auto space-y-4">
        <div className="bg-[#150a22] p-4 rounded-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-cyan-400 w-5 h-5" />
            <span className="text-white font-bold text-sm">Jaminan Aman</span>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed">Setiap transaksi dilindungi garansi 100% uang kembali.</p>
        </div>
      </div>
    </aside>
  );
};

// 3. Product Card (The Revision Focus)
const ProductCard = ({ product, onAdd }: { product: Product; onAdd: (p: Product) => void }) => {
  return (
    <div className="group relative bg-[#130821]/60 backdrop-blur-md rounded-[2rem] border border-white/5 overflow-hidden hover:border-purple-500/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(168,85,247,0.2)]">
      
      {/* Image Container */}
      <div className="relative aspect-square p-8 flex items-center justify-center bg-gradient-to-b from-white/5 to-transparent">
        <div className="text-7xl filter drop-shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
          {product.image}
        </div>
        
        {/* Badges */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#0f0518]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-cyan-300 shadow-xl">
            {product.category}
          </span>
        </div>
        
        {product.tag && (
          <div className="absolute top-4 right-4">
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 px-2 py-1 rounded-md text-[10px] font-black text-white tracking-wider shadow-lg">
              {product.tag}
            </span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-3 mb-4 text-xs text-gray-400">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-bold">{product.rating}</span>
          </div>
          <span>•</span>
          <span>{product.sold} Terjual</span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">Harga</span>
            <span className="text-lg font-bold text-white">{formatRupiah(product.price)}</span>
          </div>
          
          {/* REVISION: Changed button to Icon + Keranjang */}
          <button 
            onClick={() => onAdd(product)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-purple-600 text-purple-300 hover:text-white rounded-xl border border-white/10 hover:border-purple-500 transition-all active:scale-95 group/btn"
          >
            <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            <span className="text-xs font-bold">+ Keranjang</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. Checkout Modal
const CheckoutModal = ({ isOpen, onClose, total, onClear }: any) => {
  const [step, setStep] = useState<'method' | 'processing' | 'qris' | 'success'>('method');
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (isOpen) {
      setStep('method');
      setSelectedPayment(null);
      setTimeLeft(300);
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: any;
    if (step === 'qris' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  if (!isOpen) return null;

  const handlePay = () => {
    setStep('processing');
    setTimeout(() => setStep(selectedPayment === 'qris' ? 'qris' : 'success'), 1500);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#130821] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#1a0f2e]">
          <h3 className="text-white font-bold text-lg">
            {step === 'method' && 'Pilih Pembayaran'}
            {step === 'processing' && 'Memproses...'}
            {step === 'qris' && 'Scan QRIS'}
            {step === 'success' && 'Berhasil!'}
          </h3>
          {step !== 'processing' && <button onClick={onClose}><X className="text-gray-400 hover:text-white" /></button>}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'method' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-900/20 to-cyan-900/20 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between text-gray-400 text-sm mb-1"><span>Total Tagihan</span></div>
                <div className="text-2xl font-bold text-white">{formatRupiah(total)}</div>
              </div>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                      selectedPayment === method.id 
                        ? 'bg-purple-600/20 border-purple-500 text-white' 
                        : 'bg-white/5 border-transparent hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/10 rounded-lg">{method.icon}</div>
                      <span className="font-medium">{method.name}</span>
                    </div>
                    {selectedPayment === method.id && <CheckCircle className="text-purple-400 w-5 h-5" />}
                  </button>
                ))}
              </div>
              <button 
                onClick={handlePay}
                disabled={!selectedPayment}
                className="w-full mt-4 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-bold text-white shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition-transform"
              >
                Bayar Sekarang
              </button>
            </div>
          )}

          {step === 'processing' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
              <p className="text-gray-400 animate-pulse">Menghubungkan ke gateway pembayaran...</p>
            </div>
          )}

          {step === 'qris' && (
            <div className="flex flex-col items-center text-center">
              <div className="bg-white p-3 rounded-2xl mb-4">
                <img src={ASSETS.qris} alt="QRIS" className="w-48 h-48 object-contain" />
              </div>
              <p className="text-gray-300 text-sm mb-2">Scan QRIS diatas sebelum waktu habis</p>
              <div className="bg-red-500/20 text-red-400 px-4 py-1 rounded-full font-mono font-bold mb-6">
                {formatTime(timeLeft)}
              </div>
              <button onClick={() => setStep('success')} className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-bold">
                Simulasi Bayar
              </button>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              <h4 className="text-2xl font-bold text-white mb-2">Pembayaran Diterima!</h4>
              <p className="text-gray-400 text-sm mb-6">Item Anda sedang dikirim ke akun secara otomatis.</p>
              <button 
                onClick={() => { onClear(); onClose(); }}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-bold"
              >
                Selesai
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN APP ====================

const RobloxStoreApp = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setToast(`${product.name} ditambahkan`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, quantity: Math.max(0, item.quantity + delta) };
      return item;
    }).filter(item => item.quantity > 0));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filtering
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCat = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#05010a] text-white font-sans selection:bg-purple-500/30">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/10 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <Sidebar activeCategory={activeCategory} setCategory={setActiveCategory} />

      {/* Main Layout */}
      <div className="lg:pl-72 relative z-10 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#05010a]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 flex items-center justify-between">
          
          <div className="lg:hidden flex items-center gap-3">
             <button onClick={() => setMobileMenuOpen(true)} className="p-2"><Menu /></button>
             <span className="font-bold text-lg">ROBLOX <span className="text-purple-400">HUB</span></span>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:block w-full max-w-xl relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Cari item, skin, atau layanan..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#130821] border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 bg-white/5 hover:bg-purple-600/20 rounded-full border border-white/10 hover:border-purple-500/50 transition-all group"
            >
              <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-purple-300" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#05010a] animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Mobile Search (Below Header) */}
        <div className="lg:hidden px-4 py-2 bg-[#05010a]">
           <input 
              type="text" 
              placeholder="Cari..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#130821] border border-white/10 rounded-lg py-2 px-4 text-sm text-white"
            />
        </div>

        {/* Scrollable Content */}
        <main className="flex-1 p-4 lg:p-8 space-y-8">
          
          {/* Hero Banner (Fixed with Proper Image) */}
          <section className="relative w-full h-[300px] lg:h-[350px] rounded-[2rem] overflow-hidden group shadow-2xl shadow-purple-900/20 border border-white/10">
            <img 
              src={ASSETS.heroBanner} 
              alt="Hero" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#05010a] via-[#05010a]/60 to-transparent" />
            <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-center max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-white/10 w-fit px-3 py-1 rounded-full backdrop-blur-md border border-white/10 mb-4">
                 <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                 <span className="text-xs font-bold text-white tracking-wider">EVENT SPESIAL</span>
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-white mb-4 leading-tight">
                LEVEL UP <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-gradient-x">
                  YOUR AVATAR
                </span>
              </h2>
              <p className="text-gray-300 mb-8 max-w-md text-sm lg:text-base leading-relaxed">
                Koleksi item terbatas dan paket Robux termurah se-Indonesia. Pengiriman instan dalam hitungan detik.
              </p>
              <button 
                onClick={() => { const el = document.getElementById('products'); el?.scrollIntoView({ behavior: 'smooth' }); }}
                className="w-fit px-8 py-4 bg-white text-black font-black rounded-full hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"
              >
                BELANJA SEKARANG
              </button>
            </div>
          </section>

          {/* Products Grid */}
          <section id="products">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                {activeCategory === 'All' ? 'Sedang Populer' : activeCategory}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onAdd={addToCart} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="py-20 text-center text-gray-500">
                <p>Tidak ada produk ditemukan.</p>
                <button onClick={() => { setSearchQuery(''); setActiveCategory('All'); }} className="text-purple-400 underline mt-2">Reset Filter</button>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-md bg-[#130821] h-full shadow-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1a0f2e]">
              <h2 className="text-xl font-bold text-white">Keranjang ({cartCount})</h2>
              <button onClick={() => setIsCartOpen(false)}><X className="text-gray-400 hover:text-white" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50 space-y-4">
                  <ShoppingCart className="w-16 h-16" />
                  <p>Kosong...</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl flex items-center justify-center text-3xl shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-white font-medium line-clamp-1">{item.name}</h4>
                        <div className="text-purple-300 text-sm">{formatRupiah(item.price)}</div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                         <div className="flex items-center bg-black/30 rounded-lg">
                            <button onClick={() => updateQuantity(item.id, -1)} className="p-1 px-3 hover:text-white text-gray-400 transition-colors">-</button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="p-1 px-3 hover:text-white text-gray-400 transition-colors">+</button>
                         </div>
                         <button onClick={() => updateQuantity(item.id, -item.quantity)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#1a0f2e]">
                <div className="flex justify-between items-center mb-4 text-lg">
                   <span className="text-gray-400">Total</span>
                   <span className="text-white font-bold text-xl">{formatRupiah(cartTotal)}</span>
                </div>
                <button 
                  onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-purple-500/30 hover:scale-[1.02] transition-transform"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#05010a] animate-in slide-in-from-left">
           <div className="p-6 flex justify-between items-center border-b border-white/10">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setMobileMenuOpen(false)}><X /></button>
           </div>
           <div className="p-6 space-y-4">
              {['All', 'Items', 'Robux', 'Others'].map(cat => (
                 <button 
                  key={cat}
                  onClick={() => { setActiveCategory(cat as any); setMobileMenuOpen(false); }}
                  className={`block w-full text-left text-lg py-2 ${activeCategory === cat ? 'text-purple-400 font-bold' : 'text-gray-300'}`}
                 >
                   {cat}
                 </button>
              ))}
           </div>
        </div>
      )}

      {/* Modals */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cart={cart}
        total={cartTotal}
        onClear={() => setCart([])}
      />

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

    </div>
  );
};

export default RobloxStoreApp;
