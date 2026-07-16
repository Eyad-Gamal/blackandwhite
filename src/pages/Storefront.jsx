import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Storefront() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [hero, setHero] = useState({});
  const [overlay, setOverlay] = useState({});
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeThumb, setActiveThumb] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderName, setOrderName] = useState('');
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (selectedProduct) {
      setOrderAddress('');
      setOrderName('');
      setOrderQuantity(1);
      setCheckoutStep(1);
    }
  }, [selectedProduct?.id, selectedProduct?._id]); // Only reset when opening a DIFFERENT product, not when stock updates

  useEffect(() => {
    if (selectedProduct && products.length > 0) {
      const updatedProduct = products.find(p => p._id === selectedProduct._id || p.id === selectedProduct.id);
      if (updatedProduct && updatedProduct.stock !== selectedProduct.stock) {
        setSelectedProduct(updatedProduct);
      }
    }
  }, [products, selectedProduct]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [resP, resC, resS, resH, resO] = await Promise.all([
          fetch('/api/products', { cache: 'no-store' }).then(r => r.json()),
          fetch('/api/categories', { cache: 'no-store' }).then(r => r.json()),
          fetch('/api/settings', { cache: 'no-store' }).then(r => r.json()),
          fetch('/api/hero', { cache: 'no-store' }).then(r => r.json()),
          fetch('/api/overlay', { cache: 'no-store' }).then(r => r.json())
        ]);

        if (Array.isArray(resP)) {
            setProducts(resP.map(p => ({
                ...p,
                prices: p.prices || (p.sizes ? p.sizes.reduce((acc, s) => ({...acc, [s.size]: s.price}), {}) : {})
            })));
        }
        if (Array.isArray(resC)) setCategories(resC);
        if (resS && resS._id) setSettings(resS);
        if (resH && resH._id) setHero(resH);
        if (resO && resO._id) setOverlay(resO);
      } catch (e) {
        console.error("API Error:", e);
      }
    }
    fetchData();

    const handleFocus = () => {
      fetchData();
    };
    window.addEventListener('focus', handleFocus);
    
    // Auto-reload data every 10 seconds for real-time stock updates
    const intervalId = setInterval(fetchData, 10000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [i18n.language]);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('siteHeader');
      if (header) {
        if (window.scrollY > 20) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProducts = products.filter(p => {
    const pName = p.title?.[i18n.language] || p.title?.ar || p.title || p.name || '';
    const pCat = p.categoryId || p.category || '';
    // Find the original arabic category name if the active filter is translated
    const activeCatFilter = categories.find(c => (c.name?.[i18n.language] || c.name?.ar || c.name) === activeFilter)?.name?.ar || activeFilter;
    const matchCategory = activeFilter === 'all' || pCat === activeCatFilter || pCat === activeFilter;
    const matchSearch = pName.toLowerCase().includes(searchQuery.toLowerCase()) || pCat.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getOverlayCSS = () => {
    if(!overlay.color) return 'none';
    const r = parseInt(overlay.color.slice(1, 3), 16);
    const g = parseInt(overlay.color.slice(3, 5), 16);
    const b = parseInt(overlay.color.slice(5, 7), 16);
    const a = (overlay.opacity || 85) / 100;
    if (overlay.type === 'gradient') return `linear-gradient(to top, rgba(${r},${g},${b},${a}) 0%, transparent 55%)`;
    if (overlay.type === 'solid') return `rgba(${r},${g},${b},${a})`;
    return 'none';
  };

  const getHeroTextBg = () => {
    if(overlay.type === 'transparent' || !overlay.color) return 'transparent';
    const r = parseInt(overlay.color.slice(1, 3), 16);
    const g = parseInt(overlay.color.slice(3, 5), 16);
    const b = parseInt(overlay.color.slice(5, 7), 16);
    const a = (overlay.opacity || 85) / 100;
    return `rgba(${r},${g},${b},${a})`;
  };

  const scrollToTop = (e) => {
    if (e) e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyCoupon = async () => {
    setCouponError('');
    if (!couponCode) return;
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode })
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponError(data.message);
        setAppliedCoupon(null);
      } else {
        setAppliedCoupon(data);
      }
    } catch (e) {
      setCouponError(i18n.language === 'ar' ? 'حدث خطأ أثناء تفعيل الكود' : 'Error applying coupon');
    }
  };

  const handleOrder = async () => {
    if(!orderName || orderName.trim() === '') {
      alert(i18n.language === 'ar' ? 'برجاء إدخال الاسم' : 'Please enter your name');
      return;
    }
    if(!orderPhone || orderPhone.length < 10) {
      alert(t('alert.enterPhone'));
      return;
    }
    if(!orderAddress || orderAddress.trim() === '') {
      alert(i18n.language === 'ar' ? 'برجاء إدخال العنوان بالتفصيل' : 'Please enter your detailed address');
      return;
    }

    let basePrice = selectedProduct.prices[selectedSize] * orderQuantity;
    let finalPrice = basePrice;
    let couponText = '';
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percentage') {
            finalPrice = basePrice - (basePrice * (appliedCoupon.value / 100));
        } else {
            finalPrice = Math.max(0, basePrice - appliedCoupon.value);
        }
        couponText = `\n${t('alert.whatsappCoupon')} ${appliedCoupon.code}\n${t('alert.whatsappDiscountPrice')} ${finalPrice} ${t('hero.currency')}`;
    }

    try {
      await fetch(`/api/products/${selectedProduct.id}/decrease-stock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: orderQuantity })
      });
    } catch (err) {
      console.error(err);
    }

    const pName = selectedProduct.title?.[i18n.language] || selectedProduct.title?.ar || selectedProduct.title || selectedProduct.name;
    const msg = `${t('alert.whatsappNewOrder')}\n${t('alert.whatsappProduct')} ${pName}\n${t('alert.whatsappSize')} ${selectedSize}\nQuantity: ${orderQuantity}\n${t('alert.whatsappBasePrice')} ${basePrice} ${t('hero.currency')}${couponText}\nName: ${orderName}\nPhone: ${orderPhone}\nAddress: ${orderAddress}`;
    const url = `https://wa.me/${settings.whatsappNumber || '201000000000'}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setShowSuccess(true);
    setTimeout(() => {
        setSelectedProduct(null);
    }, 3000);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .product-img-overlay { background: ${getOverlayCSS()} !important; }
        .hero-text { background: ${getHeroTextBg()} !important; }
      `}} />

      {/* ===== HEADER ===== */}
      <header className="site-header" id="siteHeader">
        <div className="header-inner">
          <a href="#hero" className="header-logo" onClick={scrollToTop}>
            <div className="logo-mark"><img src="/main-logo.jpeg" alt="Black & White" fetchpriority="high" /></div>
          </a>
          <nav className="header-nav">
            <a href="#hero" className="nav-link active">{t('header.home')}</a>
            <a href="#products" className="nav-link">{t('header.collection')}</a>
            <a href="#story" className="nav-link">{t('header.story')}</a>
            <a href="#footer" className="nav-link">{t('header.contact')}</a>
          </nav>
          <div className="header-actions">
            <button className="header-icon-btn lang-btn" onClick={toggleLanguage} aria-label="Toggle Language" style={{ fontSize: '0.9rem', fontWeight: 'bold', border: '1px solid var(--accent)', borderRadius: '4px', padding: '4px 8px', background: 'rgba(200, 169, 110, 0.05)', color: 'var(--accent)', cursor: 'pointer' }}>
              {i18n.language === 'ar' ? 'EN' : 'عربي'}
            </button>
            <button className="header-icon-btn" onClick={() => setIsSearchOpen(true)} aria-label={t('header.search')}>
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <button className="mobile-menu-btn" onClick={() => setIsMobileNavOpen(true)} aria-label="Menu">
              <i className="fa-solid fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {/* ===== MOBILE NAV ===== */}
      <div className={`mobile-nav-overlay ${isMobileNavOpen ? 'open' : ''}`} onClick={() => setIsMobileNavOpen(false)}></div>
      <div className={`mobile-nav ${isMobileNavOpen ? 'open' : ''}`}>
        <button className="mobile-nav-close" onClick={() => setIsMobileNavOpen(false)}><i className="fa-solid fa-xmark"></i></button>
        <button onClick={() => { toggleLanguage(); setIsMobileNavOpen(false); }} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '1rem', fontWeight: 'bold', padding: '14px 0', textAlign: 'right', width: '100%', cursor: 'pointer' }}>{i18n.language === 'ar' ? 'English' : 'عربي'}</button>
        <a href="#hero" onClick={() => setIsMobileNavOpen(false)}>{t('header.home')}</a>
        <a href="#products" onClick={() => setIsMobileNavOpen(false)}>{t('header.collection')}</a>
        <a href="#story" onClick={() => setIsMobileNavOpen(false)}>{t('header.story')}</a>
        <a href="#footer" onClick={() => setIsMobileNavOpen(false)}>{t('header.contact')}</a>
      </div>

      {/* ===== SEARCH OVERLAY ===== */}
      <div className={`search-overlay ${isSearchOpen ? 'active' : ''}`}>
        <button className="search-close-btn" onClick={() => setIsSearchOpen(false)}><i className="fa-solid fa-xmark"></i></button>
        <div className="search-container">
          <div className="search-input-wrapper">
            <i className="fa-solid fa-magnifying-glass search-icon-btn"></i>
            <input type="text" className="search-input" placeholder={t('header.search')}
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
          <div className="search-results">
            {searchQuery && filteredProducts.map(p => (
                <div key={p._id || p.name} className="search-result-card" onClick={() => { setSelectedProduct(p); setIsSearchOpen(false); }}>
                    <img src={p.images?.[0]} alt={p.name} loading="lazy" />
                    <h4>{p.name}</h4>
                </div>
            ))}
            {searchQuery && filteredProducts.length === 0 && (
                <div className="search-no-results">{t('search.no_results')}</div>
            )}
          </div>
        </div>
      </div>

      {/* ===== HERO ===== */}
      <section className="hero" id="hero">
        <div className="hero-bg-split">
          <div className="bg-left"></div>
          <div className="bg-right"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <img src="/main-logo.jpeg" alt="Black & White Logo" className="hero-text-logo" fetchpriority="high" />
            <h1 className="hero-headline" dangerouslySetInnerHTML={{ __html: (hero.headline?.[i18n.language] || hero.headline?.ar || hero.headline || t('hero.headline')).replace(hero.styledWord?.[i18n.language] || hero.styledWord?.ar || hero.styledWord || t('hero.styledWord'), `<span class="stroke-text">${hero.styledWord?.[i18n.language] || hero.styledWord?.ar || hero.styledWord || t('hero.styledWord')}</span><br>`) }}></h1>
            <p className="hero-tagline">{hero.tagline?.[i18n.language] || hero.tagline?.ar || hero.tagline || t('hero.tagline')}</p>
          </div>
          <div className="hero-visual">
            <div className="hero-main-img-wrapper">
              <img src={hero.image || "/Gemini_Generated_Image_.png"} alt="Black & White Collection" id="heroImg" fetchpriority="high" />
              <div className="hero-img-overlay"></div>
              <div className="hero-img-label">
                <span className="hero-img-name">{hero.productLabel?.[i18n.language] || hero.productLabel?.ar || hero.productLabel || t('hero.productLabel')}</span>
                <span className="hero-img-price">{hero.heroPrice ? `${t('hero.price')} ${hero.heroPrice}` : `${t('hero.startsFrom')} ${products.length > 0 ? Math.min(...Object.values(products[0].prices || {})) : 299}`} <span id="heroImgPrice"></span> {t('hero.currency')}</span>
              </div>
              <div className="hero-floating-badge">{hero.badge?.[i18n.language] || hero.badge?.ar || hero.badge || t('hero.badge')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ANNOUNCEMENT BAR ===== */}
      <div className="announcement-bar">
        <div className="announcement-track">
          {(() => {
            const arr = settings.announcements && settings.announcements.length > 0 
              ? settings.announcements 
              : [
                  { text: { ar: t('announcement.freeDelivery'), en: t('announcement.freeDelivery') }, icon: 'fa-solid fa-truck-fast' },
                  { text: { ar: t('announcement.launch'), en: t('announcement.launch') }, icon: 'fa-solid fa-star' },
                  { text: { ar: t('announcement.return'), en: t('announcement.return') }, icon: 'fa-solid fa-rotate-left' },
                  { text: { ar: t('announcement.guarantee'), en: t('announcement.guarantee') }, icon: 'fa-solid fa-shield-halved' }
                ];
            const repeatedArr = [...arr, ...arr]; // Repeat to create the infinite scroll effect
            return repeatedArr.map((ann, idx) => (
              <span key={idx}><i className={ann.icon || 'fa-solid fa-star'}></i> {ann.text?.[i18n.language] || ann.text?.ar || ''}</span>
            ));
          })()}
        </div>
      </div>

      {/* ===== PRODUCTS SECTION ===== */}
      <section className="products-section" id="products">
        <div className="section-header animate-in visible">
          <span className="section-eyebrow">{t('products.eyebrow')}</span>
          <h2 className="section-title">{t('products.title')}</h2>
          <p className="section-sub">{t('products.sub')}</p>
        </div>
        <div className="filter-bar">
          <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>{t('products.filterAll')}</button>
          {categories.map(cat => {
            const catNameStr = cat.name?.[i18n.language] || cat.name?.ar || cat.name;
            return <button key={cat._id || cat.id || catNameStr} className={`filter-btn ${activeFilter === catNameStr ? 'active' : ''}`} onClick={() => setActiveFilter(catNameStr)}>{catNameStr}</button>;
          })}
        </div>
        <div className="products-grid">
          {filteredProducts.map((p, idx) => {
            const minP = Math.min(...Object.values(p.prices || {}));
            const pName = p.title?.[i18n.language] || p.title?.ar || p.title || p.name;
            const pCatOriginal = p.categoryId || p.category;
            const pCat = categories.find(c => c.name?.ar === pCatOriginal || c.name === pCatOriginal)?.name?.[i18n.language] || pCatOriginal;
            return (
              <div key={p._id || idx} className="product-card animate-in visible" style={{ transitionDelay: `${idx * 0.06}s` }} onClick={() => { setSelectedProduct(p); setActiveThumb(0); setSelectedSize(''); setShowSuccess(false); }}>
                {p.stock <= 0 ? (
                  <div className="product-tag" style={{background: 'var(--danger)', color: 'white'}}>{i18n.language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}</div>
                ) : p.tag ? (
                  <div className={`product-tag ${p.tag === 'جديد' ? 'new-tag' : ''}`}>{p.tag === 'جديد' ? t('productCard.new') : p.tag}</div>
                ) : null}
                <div className="product-img-wrapper">
                  <img src={p.images?.[0]} alt={pName} loading="lazy" />
                  <div className="product-img-overlay"></div>
                  <button className="product-quick-btn" onClick={(e) => { e.stopPropagation(); setSelectedProduct(p); setActiveThumb(0); setSelectedSize(''); setShowSuccess(false); }}>{t('productCard.quickView')}</button>
                </div>
                <div className="product-info">
                  <div className="product-category">{pCat}</div>
                  <h3 className="product-name">{pName}</h3>
                  <div className="product-price-row">
                    <div className="product-price">{t('hero.startsFrom')} <strong>{minP} {t('hero.currency')}</strong></div>
                    <div className="product-sizes-preview">
                      {Object.keys(p.prices || {}).slice(0, 3).map(s => <div key={s} className="size-dot">{s}</div>)}
                    </div>
                  </div>
                  {p.stock <= 0 ? (
                    <div style={{color:'var(--danger)', fontSize:'0.75rem', marginTop:'8px', fontWeight:'bold', display:'flex', alignItems:'center', gap:'4px'}}>
                      <i className="fa-solid fa-circle-xmark"></i> {i18n.language === 'ar' ? 'نفذت الكمية' : 'Out of Stock'}
                    </div>
                  ) : p.stock > 0 ? (
                    <div style={{color:'var(--accent)', fontSize:'0.75rem', marginTop:'8px', fontWeight:'bold', display:'flex', alignItems:'center', gap:'4px'}}>
                      <i className="fa-solid fa-clock" style={{animation:'glowPulse 1.5s infinite'}}></i> {i18n.language === 'ar' ? `متبقي ${p.stock} قطعة` : `Only ${p.stock} left`}
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ===== BRAND STORY ===== */}
      <section className="brand-story" id="story">
        <div className="brand-story-inner">
          <div className="brand-story-images animate-in visible">
            <div className="brand-story-img" style={{ gridColumn: '1 / -1' }}>
                <img src="/Gemini_Generated_Image_ (2).png" alt="Brand Story" loading="lazy" style={{ height: '200px', width: '100%', objectFit: 'cover' }} />
            </div>
            <div className="brand-story-img">
                <img src="/Gemini_Generated_Image_ (4).png" alt="Brand Story" loading="lazy" style={{ height: '150px', width: '100%', objectFit: 'cover' }} />
            </div>
            <div className="brand-story-img">
                <img src="/Gemini_Generated_Image_ (5).png" alt="Brand Story" loading="lazy" style={{ height: '150px', width: '100%', objectFit: 'cover' }} />
            </div>
          </div>
          <div className="brand-story-text animate-in visible">
            <span className="section-eyebrow">{t('story.eyebrow')}</span>
            <h2 className="brand-story-title">{t('story.title')}</h2>
            <p className="brand-story-p">{t('story.p1')}</p>
            <p className="brand-story-p">{t('story.p2')}</p>
            <div className="brand-pillars">
              <div className="brand-pillar">
                <div className="pillar-icon"><i className="fa-solid fa-scissors"></i></div>
                <div className="pillar-text-wrap">
                  <div className="pillar-title">{t('story.pillar1.title')}</div>
                  <div className="pillar-desc">{t('story.pillar1.desc')}</div>
                </div>
              </div>
              <div className="brand-pillar">
                <div className="pillar-icon"><i className="fa-solid fa-star"></i></div>
                <div className="pillar-text-wrap">
                  <div className="pillar-title">{t('story.pillar2.title')}</div>
                  <div className="pillar-desc">{t('story.pillar2.desc')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL ACCOUNTS SECTION ===== */}
      <section className="social-accounts-section animate-in visible">
        <span className="social-section-eyebrow">{t('social.eyebrow')}</span>
        <h2 className="social-section-title">{t('social.title')}</h2>
        <p className="social-section-sub">{t('social.sub')}</p>
        <div className="social-accounts-icons">
          {settings.whatsappNumber && <a href={`https://wa.me/${settings.whatsappNumber}`} target="_blank" rel="noreferrer" className="wa-social" aria-label="WhatsApp"><i className="fa-brands fa-whatsapp"></i></a>}
          {settings.instagramUrl && <a href={settings.instagramUrl} target="_blank" rel="noreferrer" className="ig-social" aria-label="Instagram"><i className="fa-brands fa-instagram"></i></a>}
          {settings.facebookUrl && <a href={settings.facebookUrl} target="_blank" rel="noreferrer" className="fb-social" aria-label="Facebook"><i className="fa-brands fa-facebook-f"></i></a>}
          {settings.tiktokUrl && <a href={settings.tiktokUrl} target="_blank" rel="noreferrer" className="tt-social" aria-label="TikTok"><i className="fa-brands fa-tiktok"></i></a>}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="site-footer" id="footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '12px', padding: '16px 32px', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--gray-mid)' }}>
            © 2026 <strong style={{ color: 'var(--white)' }}>Black & White</strong> — {t('footer.copy')}
          </p>
        </div>
      </footer>

      {/* ===== MODAL ===== */}
      {selectedProduct && (
        <div className={`modal-overlay ${selectedProduct ? 'active' : ''}`} onClick={(e) => { if (e.target.className.includes('modal-overlay')) { setSelectedProduct(null); setAppliedCoupon(null); setCouponCode(''); setCouponError(''); } }}>
          <div className="modal-container">
            <button className="modal-close" onClick={() => { setSelectedProduct(null); setAppliedCoupon(null); setCouponCode(''); setCouponError(''); }} aria-label="Close"><i className="fa-solid fa-xmark"></i></button>
            <div className="modal-image-panel">
              <img src={selectedProduct.images?.[activeThumb]} className="modal-main-img" alt={selectedProduct.title?.[i18n.language] || selectedProduct.title?.ar || selectedProduct.title || selectedProduct.name} fetchpriority="high" />
              <div className="modal-thumbs">
                  {selectedProduct.images?.map((img, idx) => (
                      <img key={idx} src={img} alt="" className={`modal-thumb ${idx === activeThumb ? 'active' : ''}`} onClick={() => setActiveThumb(idx)} loading="lazy" />
                  ))}
              </div>
            </div>
            <div className="modal-info-panel">
              {checkoutStep === 1 ? (
                <>
                  <p className="modal-category">{categories.find(c => c.name?.ar === (selectedProduct.categoryId || selectedProduct.category) || c.name === (selectedProduct.categoryId || selectedProduct.category))?.name?.[i18n.language] || (selectedProduct.categoryId || selectedProduct.category)}</p>
                  <h2 className="modal-title">{selectedProduct.title?.[i18n.language] || selectedProduct.title?.ar || selectedProduct.title || selectedProduct.name}</h2>
                  <p className="modal-tagline">{t('products.sub')}</p>
                  
                  {selectedProduct.stock <= 0 ? (
                    <div style={{background:'var(--danger-bg)', border:'1px solid var(--danger)', color:'var(--danger)', padding:'10px', borderRadius:'8px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px', fontWeight:'bold'}}>
                      <i className="fa-solid fa-circle-xmark"></i> 
                      <span>{i18n.language === 'ar' ? 'عذراً، هذا المنتج غير متوفر حالياً (نفذت الكمية)' : 'Sorry, this product is currently out of stock.'}</span>
                    </div>
                  ) : selectedProduct.stock > 0 ? (
                    <div style={{background:'rgba(200, 169, 110, 0.1)', border:'1px solid var(--accent)', color:'var(--accent)', padding:'10px', borderRadius:'8px', marginBottom:'16px', display:'flex', alignItems:'center', gap:'8px', fontWeight:'bold'}}>
                      <i className="fa-solid fa-clock" style={{animation:'glowPulse 1.5s infinite'}}></i> 
                      <span>{i18n.language === 'ar' ? `متبقي ${selectedProduct.stock} قطعة فقط في المخزون` : `Only ${selectedProduct.stock} pieces left in stock.`}</span>
                    </div>
                  ) : null}
                  
                  <div id="sizeSection">
                    <p className="modal-label">{t('modal.chooseSize')}</p>
                    <div className="modal-size-options">
                        {Object.keys(selectedProduct.prices || {}).map(s => (
                            <button key={s} className={`size-btn ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>{s}</button>
                        ))}
                    </div>
                  </div>
                  <div className="modal-price-block">
                    <p className="modal-label">{t('hero.price')}</p>
                    <div style={{display:'flex',flexDirection:'column'}}>
                      <p className="modal-price" style={{ textDecoration: appliedCoupon ? 'line-through' : 'none', color: appliedCoupon ? '#999' : 'inherit', fontSize: appliedCoupon ? '1.2rem' : '1.75rem' }}>
                        {selectedSize ? selectedProduct.prices[selectedSize] : Math.min(...Object.values(selectedProduct.prices || {}))} <span className="currency">{t('hero.currency')}</span>
                      </p>
                      {appliedCoupon && (
                        <p className="modal-price" style={{ color: '#000', marginTop: '4px' }}>
                          {(() => {
                            let bp = selectedSize ? selectedProduct.prices[selectedSize] : Math.min(...Object.values(selectedProduct.prices || {}));
                            let fp = appliedCoupon.type === 'percentage' ? bp - (bp * (appliedCoupon.value / 100)) : Math.max(0, bp - appliedCoupon.value);
                            return fp;
                          })()} <span className="currency">{t('hero.currency')}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div style={{marginBottom:'24px'}}>
                    <div style={{display:'flex',gap:'8px'}}>
                      <input type="text" placeholder={t('modal.coupon')} value={couponCode} onChange={e => setCouponCode(e.target.value)} style={{flex:1,padding:'12px 16px',border:'1px solid var(--border-subtle)',borderRadius:'8px',textTransform:'uppercase',background:'var(--bg)',color:'var(--white)',outline:'none',fontSize:'0.9rem'}} />
                      <button onClick={handleApplyCoupon} style={{background:'var(--white)',color:'var(--bg)',border:'none',padding:'0 20px',borderRadius:'8px',cursor:'pointer',fontWeight:'bold'}}>{t('modal.applyCoupon')}</button>
                    </div>
                    {couponError && <p style={{color:'var(--danger)',fontSize:'0.8rem',marginTop:'6px'}}>{couponError}</p>}
                    {appliedCoupon && <p style={{color:'var(--success)',fontSize:'0.8rem',marginTop:'6px'}}>{t('modal.couponApplied')}</p>}
                  </div>
                  
                  <div className="modal-quantity-wrapper" style={{marginBottom:'24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <label style={{color: 'var(--gray-light)', fontSize: '0.9rem', fontWeight: 'bold'}}>{i18n.language === 'ar' ? 'الكمية:' : 'Quantity:'}</label>
                    <input type="number" min="1" max={selectedProduct.stock || 100} value={orderQuantity} onChange={(e) => setOrderQuantity(Number(e.target.value))} style={{width: '80px', padding: '8px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--white)', outline: 'none', textAlign: 'center', fontFamily: 'inherit'}} />
                  </div>
                  
                  <button onClick={() => {
                    if(!selectedSize) { alert(t('alert.selectSize')); return; }
                    if(orderQuantity < 1) { alert(i18n.language === 'ar' ? 'الكمية غير صحيحة' : 'Invalid quantity'); return; }
                    setCheckoutStep(2);
                  }} className="modal-order-btn" style={{ opacity: selectedProduct.stock <= 0 ? 0.5 : 1, cursor: selectedProduct.stock <= 0 ? 'not-allowed' : 'pointer' }} disabled={selectedProduct.stock <= 0}>
                    {selectedProduct.stock <= 0 ? (i18n.language === 'ar' ? 'نفذت الكمية' : 'Out of Stock') : (i18n.language === 'ar' ? 'متابعة الطلب' : 'Continue Order')}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setCheckoutStep(1)} style={{background:'none',border:'none',color:'var(--gray-light)',cursor:'pointer',marginBottom:'16px',display:'flex',alignItems:'center',gap:'8px'}}>
                    <i className={i18n.language === 'ar' ? "fa-solid fa-arrow-right" : "fa-solid fa-arrow-left"}></i> {i18n.language === 'ar' ? 'رجوع' : 'Back'}
                  </button>
                  <h3 style={{marginBottom:'24px', color:'var(--white)'}}>{i18n.language === 'ar' ? 'بيانات الاستلام' : 'Delivery Details'}</h3>
                  
                  <div className="modal-name-wrapper" style={{marginBottom:'12px', position: 'relative'}}>
                    <i className="fa-solid fa-user" style={{position: 'absolute', right: i18n.language === 'ar' ? '16px' : 'auto', left: i18n.language === 'ar' ? 'auto' : '16px', top: '14px', color: 'var(--accent)'}}></i>
                    <input type="text" placeholder={i18n.language === 'ar' ? 'الاسم ثلاثي' : 'Full Name'} value={orderName} onChange={(e) => setOrderName(e.target.value)} style={{width: '100%', padding: '12px 16px', paddingRight: i18n.language === 'ar' ? '44px' : '16px', paddingLeft: i18n.language === 'ar' ? '16px' : '44px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--white)', outline: 'none', fontFamily: 'inherit'}} />
                  </div>
                  
                  <div className="modal-phone-wrapper" style={{marginBottom:'12px'}}>
                    <i className="fa-solid fa-phone phone-icon"></i>
                    <input type="tel" className="modal-phone" placeholder={t('modal.phonePlaceholder')} maxLength="11" value={orderPhone} onChange={(e) => setOrderPhone(e.target.value)} />
                  </div>
                  
                  <div className="modal-address-wrapper" style={{marginBottom:'24px', position: 'relative'}}>
                    <i className="fa-solid fa-location-dot" style={{position: 'absolute', right: i18n.language === 'ar' ? '16px' : 'auto', left: i18n.language === 'ar' ? 'auto' : '16px', top: '14px', color: 'var(--accent)'}}></i>
                    <input type="text" className="modal-address" placeholder={i18n.language === 'ar' ? 'العنوان بالتفصيل' : 'Detailed Address'} value={orderAddress} onChange={(e) => setOrderAddress(e.target.value)} style={{width: '100%', padding: '12px 16px', paddingRight: i18n.language === 'ar' ? '44px' : '16px', paddingLeft: i18n.language === 'ar' ? '16px' : '44px', border: '1px solid var(--border-subtle)', borderRadius: '8px', background: 'var(--bg)', color: 'var(--white)', outline: 'none', fontFamily: 'inherit'}} />
                  </div>
                  
                  <button onClick={handleOrder} className="modal-order-btn">
                    <i className="fa-brands fa-whatsapp wa-icon"></i> {i18n.language === 'ar' ? 'تأكيد الطلب عبر واتساب' : 'Confirm Order via WhatsApp'}
                  </button>
                  
                  {showSuccess && (
                      <div className="modal-success visible">
                        <i className="fa-solid fa-circle-check"></i> {t('modal.orderSuccess')}
                      </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== FLOATING ===== */}
      <a href="#!" onClick={(e) => { e.preventDefault(); window.open(`https://wa.me/${settings.whatsappNumber || '201000000000'}`, '_blank'); }} className="whatsapp-float" aria-label="واتساب">
        <i className="fa-brands fa-whatsapp"></i>
      </a>
      <button className="scroll-top-btn" onClick={scrollToTop} aria-label="أعلى">
        <i className="fa-solid fa-arrow-up"></i>
      </button>
    </>
  );
}
