import { useState, useEffect } from 'react';
import adminCssString from '../admin.css?raw';

export default function AdminDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  
  const [activePanel, setActivePanel] = useState('dashboard');
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState({});
  const [hero, setHero] = useState({});
  const [overlay, setOverlay] = useState({});
  const [coupons, setCoupons] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // States for Modals/Forms
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      const handleFocus = () => fetchData();
      window.addEventListener('focus', handleFocus);
      return () => window.removeEventListener('focus', handleFocus);
    }
  }, [isLoggedIn]);

  async function fetchData() {
    try {
      const [resP, resC, resS, resH, resO, resCoupons] = await Promise.all([
        fetch('/api/products').then(r => r.json()),
        fetch('/api/categories').then(r => r.json()),
        fetch('/api/settings').then(r => r.json()),
        fetch('/api/hero').then(r => r.json()),
        fetch('/api/overlay').then(r => r.json()),
        fetch('/api/coupons').then(r => r.json())
      ]);
      if (Array.isArray(resP)) setProducts(resP);
      if (Array.isArray(resC)) setCategories(resC);
      if (resS && resS._id) {
        setSettings(resS);
        setAnnouncements(resS.announcements || []);
      }
      if (resH && resH._id) setHero(resH);
      if (resO && resO._id) setOverlay(resO);
      if (Array.isArray(resCoupons)) setCoupons(resCoupons);
    } catch (e) {
      console.error("API Error:", e);
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    const storedPass = localStorage.getItem('bw_admin_password') || '909035';
    if (password === storedPass) {
      setIsLoggedIn(true);
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleImageUpload = async (files) => {
    setUploading(true);
    const uploadedUrls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      const url = await new Promise((resolve) => {
        reader.onloadend = async () => {
          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: reader.result })
            });
            if (!res.ok) {
                console.error("Upload failed with status", res.status);
                // Return base64 as fallback if Cloudinary fails (temporary workaround)
                resolve(reader.result);
                return;
            }
            const data = await res.json();
            resolve(data.url);
          } catch (error) {
            console.error("Upload failed", error);
            resolve(reader.result); // Fallback to base64
          }
        };
        reader.readAsDataURL(file);
      });
      if (url) uploadedUrls.push(url);
    }
    setUploading(false);
    return uploadedUrls;
  };

  // --- CRUD Functions ---
  const saveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = {
      title: { ar: formData.get('title_ar'), en: formData.get('title_en') },
      categoryId: formData.get('categoryId'),
      tag: formData.get('tag'),
      stock: Number(formData.get('stock')) || 0,
      prices: {},
      images: editingProduct?.images || []
    };
    const sizes = formData.getAll('size_name');
    const prices = formData.getAll('size_price');
    sizes.forEach((s, i) => { if (s && prices[i]) productData.prices[s] = Number(prices[i]); });
    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput?.files?.length > 0) {
      const filesToUpload = Array.from(fileInput.files).slice(0, 4);
      const urls = await handleImageUpload(filesToUpload);
      if (urls.length > 0) {
        productData.images = urls;
        productData.mainImage = urls[0];
      }
    }
    const method = editingProduct?._id ? 'PUT' : 'POST';
    const url = editingProduct?._id ? `/api/products/${editingProduct.id}` : '/api/products';
    productData.id = editingProduct ? editingProduct.id : Date.now().toString();
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(productData) });
    setIsProductModalOpen(false);
    fetchData();
  };

  const deleteProduct = async (id) => {
    if(window.confirm('هل أنت متأكد من الحذف؟')) {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const catData = { name: { ar: formData.get('name_ar'), en: formData.get('name_en') } };
    const method = editingCategory?._id ? 'PUT' : 'POST';
    const url = editingCategory?._id ? `/api/categories/${editingCategory.id}` : '/api/categories';
    catData.id = editingCategory ? editingCategory.id : Date.now().toString();
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(catData) });
    setIsCategoryModalOpen(false);
    fetchData();
  };

  const deleteCategory = async (id) => {
    if(window.confirm('هل أنت متأكد من الحذف؟')) {
      await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const saveCoupon = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const couponData = {
      code: formData.get('code'),
      type: formData.get('type'),
      value: Number(formData.get('value')),
      isActive: formData.get('isActive') === 'on'
    };
    const method = editingCoupon?._id ? 'PUT' : 'POST';
    const url = editingCoupon?._id ? `/api/coupons/${editingCoupon.id}` : '/api/coupons';
    couponData.id = editingCoupon ? editingCoupon.id : Date.now().toString();
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(couponData) });
    setIsCouponModalOpen(false);
    fetchData();
  };

  const deleteCoupon = async (id) => {
    if(window.confirm('هل أنت متأكد من الحذف؟')) {
      await fetch(`/api/coupons/${id}`, { method: 'DELETE' });
      fetchData();
    }
  };

  const saveHero = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const heroData = { ...hero,
      headline: { ar: formData.get('headline_ar'), en: formData.get('headline_en') },
      styledWord: { ar: formData.get('styledWord_ar'), en: formData.get('styledWord_en') },
      tagline: { ar: formData.get('tagline_ar'), en: formData.get('tagline_en') },
      productLabel: { ar: formData.get('productLabel_ar'), en: formData.get('productLabel_en') },
      badge: { ar: formData.get('badge_ar'), en: formData.get('badge_en') },
      heroPrice: Number(formData.get('heroPrice') || 299),
      bgType: formData.get('bgType'),
      bgColor: formData.get('bgColor'),
      bgOpacity: Number(formData.get('bgOpacity') || 100)
    };
    const fileInput = e.target.querySelector('input[type="file"]');
    if (fileInput?.files?.length > 0) {
      const url = await handleImageUpload({target: fileInput});
      if(url) heroData.image = url;
    }
    await fetch('/api/hero', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(heroData) });
    alert('تم الحفظ بنجاح');
    fetchData();
  };

  const saveOverlay = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const overlayData = { color: formData.get('color'), opacity: Number(formData.get('opacity')), type: formData.get('type') };
    await fetch('/api/overlay', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(overlayData) });
    alert('تم الحفظ بنجاح');
    fetchData();
  };

  const saveSettings = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const settingsData = {
      whatsappNumber: formData.get('whatsappNumber'),
      facebookUrl: formData.get('facebookUrl'),
      instagramUrl: formData.get('instagramUrl'),
      tiktokUrl: formData.get('tiktokUrl'),
      announcements: announcements
    };
    await fetch('/api/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settingsData) });
    alert('تم الحفظ بنجاح');
    fetchData();
  };

  return (
    <>
      <style>{adminCssString}</style>
      <div className="admin-body">
        {!isLoggedIn ? (
          <div className="login-screen">
            <div className="login-card">
              <img src="/main-logo.jpeg" alt="Logo" className="login-logo" />
              <h1 className="login-title">Black & White</h1>
              <p className="login-sub">لوحة تحكم الإدارة</p>
              <form onSubmit={handleLogin}>
                <input 
                  type="password" 
                  className="login-input" 
                  placeholder="••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ borderColor: loginError ? 'var(--danger)' : '' }}
                />
                <button type="submit" className="login-btn">تسجيل الدخول</button>
                {loginError && <div className="login-error" style={{display:'block'}}>كلمة المرور غير صحيحة</div>}
              </form>
            </div>
          </div>
        ) : (
          <div className="admin-layout" dir="rtl">
            
            <aside className="sidebar">
              <div className="sidebar-header">
                <img src="/main-logo.jpeg" alt="Logo" className="sidebar-logo" />
                <div className="sidebar-brand">
                  <span className="sidebar-brand-name">Black & White</span>
                  <span className="sidebar-brand-sub">لوحة التحكم</span>
                </div>
              </div>
              
              <nav className="sidebar-nav">
                <div className="sidebar-section-label">الرئيسية</div>
                <button className={`sidebar-link ${activePanel === 'dashboard' ? 'active' : ''}`} onClick={() => setActivePanel('dashboard')}>
                  <i className="fa-solid fa-chart-pie"></i> الإحصائيات
                </button>
                
                <div className="sidebar-section-label">المتجر</div>
                <button className={`sidebar-link ${activePanel === 'products' ? 'active' : ''}`} onClick={() => setActivePanel('products')}>
                  <i className="fa-solid fa-shirt"></i> المنتجات
                </button>
                <button className={`sidebar-link ${activePanel === 'categories' ? 'active' : ''}`} onClick={() => setActivePanel('categories')}>
                  <i className="fa-solid fa-tags"></i> التصنيفات
                </button>
                <button className={`sidebar-link ${activePanel === 'coupons' ? 'active' : ''}`} onClick={() => setActivePanel('coupons')}>
                  <i className="fa-solid fa-ticket"></i> أكواد الخصم
                </button>
                
                <div className="sidebar-section-label">الواجهة</div>
                <button className={`sidebar-link ${activePanel === 'hero' ? 'active' : ''}`} onClick={() => setActivePanel('hero')}>
                  <i className="fa-solid fa-image"></i> الرئيسية (Hero)
                </button>
                <button className={`sidebar-link ${activePanel === 'settings' ? 'active' : ''}`} onClick={() => setActivePanel('settings')}>
                  <i className="fa-solid fa-gear"></i> الإعدادات العامة
                </button>
              </nav>
              
              <div className="sidebar-footer">
                <a href="/" className="sidebar-back-link">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i> العودة للمتجر
                </a>
              </div>
            </aside>
            
            <main className="main-content">
              <div className="page-header">
                <div>
                  <h1 className="page-title">
                    {activePanel === 'dashboard' && 'الإحصائيات'}
                    {activePanel === 'products' && 'المنتجات'}
                    {activePanel === 'categories' && 'التصنيفات'}
                    {activePanel === 'coupons' && 'أكواد الخصم'}
                    {activePanel === 'hero' && 'إعدادات الواجهة'}
                    {activePanel === 'settings' && 'الإعدادات العامة'}
                  </h1>
                  <p className="page-subtitle">إدارة محتوى المتجر وتخصيص الواجهة</p>
                </div>
                {(activePanel === 'products' || activePanel === 'categories' || activePanel === 'coupons') && (
                  <button className="btn btn-primary" onClick={() => {
                    if(activePanel==='products') { setEditingProduct(null); setIsProductModalOpen(true); }
                    if(activePanel==='categories') { setEditingCategory(null); setIsCategoryModalOpen(true); }
                    if(activePanel==='coupons') { setEditingCoupon(null); setIsCouponModalOpen(true); }
                  }}>
                    <i className="fa-solid fa-plus"></i> إضافة جديد
                  </button>
                )}
              </div>

              {/* STATS PANEL */}
              {activePanel === 'dashboard' && (
                <div className="panel active">
                  <div className="stats-row">
                    <div className="stat-card">
                      <div className="stat-icon"><i className="fa-solid fa-shirt"></i></div>
                      <div><span className="stat-value">{products.length}</span><span className="stat-label">منتج</span></div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon" style={{background:'var(--info-bg)',color:'var(--info)'}}><i className="fa-solid fa-tags"></i></div>
                      <div><span className="stat-value">{categories.length}</span><span className="stat-label">تصنيف</span></div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-icon" style={{background:'var(--success-bg)',color:'var(--success)'}}><i className="fa-solid fa-ticket"></i></div>
                      <div><span className="stat-value">{coupons.length}</span><span className="stat-label">كود خصم</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* PRODUCTS PANEL */}
              {activePanel === 'products' && (
                <div className="panel active">
                  <div className="card">
                    <div className="card-header"><h3 className="card-title"><i className="fa-solid fa-shirt"></i> قائمة المنتجات</h3></div>
                    <div style={{overflowX: 'auto'}}>
                      <table className="data-table">
                        <thead><tr><th>الصورة</th><th>الاسم</th><th>التصنيف</th><th>السعر الأساسي</th><th>الإجراءات</th></tr></thead>
                        <tbody>
                          {products.map(p => (
                            <tr key={p._id || p.id}>
                              <td><img src={p.images?.[0]} className="product-thumb" alt=""/></td>
                              <td>{p.title?.ar || p.title || p.name}</td>
                              <td><span className="tag tag-accent">{p.categoryId || p.category}</span></td>
                              <td style={{color:'var(--accent)',fontWeight:700}}>{Math.min(...Object.values(p.prices || {}))} ج.م</td>
                              <td>
                                <div className="actions-cell">
                                  <button type="button" className="btn btn-outline btn-icon" onClick={() => {setEditingProduct(p); setIsProductModalOpen(true);}}><i className="fa-solid fa-pen"></i></button>
                                  <button type="button" className="btn btn-danger btn-icon" onClick={() => deleteProduct(p.id)}><i className="fa-solid fa-trash"></i></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* CATEGORIES PANEL */}
              {activePanel === 'categories' && (
                <div className="panel active">
                  <div className="card">
                    <div className="card-header"><h3 className="card-title"><i className="fa-solid fa-tags"></i> الأقسام المتاحة</h3></div>
                    <table className="data-table">
                      <thead><tr><th>الاسم</th><th>الإجراءات</th></tr></thead>
                      <tbody>
                        {categories.map(c => (
                          <tr key={c._id || c.id || c.name?.ar || c.name}>
                            <td>{c.name?.ar || c.name}</td>
                            <td>
                              <div className="actions-cell">
                                <button type="button" className="btn btn-outline btn-icon" onClick={() => {setEditingCategory(c); setIsCategoryModalOpen(true);}}><i className="fa-solid fa-pen"></i></button>
                                <button type="button" className="btn btn-danger btn-icon" onClick={() => deleteCategory(c.id)}><i className="fa-solid fa-trash"></i></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* COUPONS PANEL */}
              {activePanel === 'coupons' && (
                <div className="panel active">
                  <div className="card">
                    <div className="card-header"><h3 className="card-title"><i className="fa-solid fa-ticket"></i> أكواد الخصم</h3></div>
                    <table className="data-table">
                      <thead><tr><th>الكود</th><th>النوع</th><th>القيمة</th><th>الحالة</th><th>الإجراءات</th></tr></thead>
                      <tbody>
                        {coupons.map(c => (
                          <tr key={c._id || c.id}>
                            <td style={{letterSpacing:'2px',fontWeight:'800',color:'var(--white)'}}>{c.code}</td>
                            <td>{c.type === 'percentage' ? 'نسبة مئوية (%)' : 'مبلغ ثابت'}</td>
                            <td style={{color:'var(--accent)',fontWeight:700}}>{c.value} {c.type==='percentage'?'%':'ج.م'}</td>
                            <td>{c.isActive ? <span className="tag tag-success">نشط</span> : <span className="tag tag-info" style={{background:'var(--danger-bg)',color:'var(--danger)'}}>غير نشط</span>}</td>
                            <td>
                              <div className="actions-cell">
                                <button type="button" className="btn btn-outline btn-icon" onClick={() => {setEditingCoupon(c); setIsCouponModalOpen(true);}}><i className="fa-solid fa-pen"></i></button>
                                <button type="button" className="btn btn-danger btn-icon" onClick={() => deleteCoupon(c.id)}><i className="fa-solid fa-trash"></i></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* HERO PANEL */}
              {activePanel === 'hero' && (
                <div className="panel active">
                  <div className="card">
                    <div className="card-header"><h3 className="card-title"><i className="fa-solid fa-image"></i> إعدادات الهيرو (النصوص، الخلفية، الصور)</h3></div>
                    <form onSubmit={saveHero}>
                      
                      <h4 style={{marginBottom:'16px', color:'var(--accent)'}}>النصوص الأساسية</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">العنوان الرئيسي (العربية)</label>
                          <input type="text" name="headline_ar" className="form-input" defaultValue={hero.headline?.ar || hero.headline} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">العنوان الرئيسي (English)</label>
                          <input type="text" name="headline_en" className="form-input" defaultValue={hero.headline?.en} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">الكلمة المميزة (العربية)</label>
                          <input type="text" name="styledWord_ar" className="form-input" defaultValue={hero.styledWord?.ar || hero.styledWord} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">الكلمة المميزة (English)</label>
                          <input type="text" name="styledWord_en" className="form-input" defaultValue={hero.styledWord?.en} />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">الجملة الفرعية (العربية)</label>
                          <textarea name="tagline_ar" className="form-textarea" defaultValue={hero.tagline?.ar || hero.tagline}></textarea>
                        </div>
                        <div className="form-group">
                          <label className="form-label">الجملة الفرعية (English)</label>
                          <textarea name="tagline_en" className="form-textarea" defaultValue={hero.tagline?.en}></textarea>
                        </div>
                      </div>

                      <h4 style={{marginBottom:'16px', color:'var(--accent)', marginTop:'24px'}}>عناصر الصورة (الصورة التي تظهر يمين الشاشة)</h4>
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">نص الليبل العائم (العربية)</label>
                          <input type="text" name="productLabel_ar" className="form-input" defaultValue={hero.productLabel?.ar || hero.productLabel} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">نص الليبل العائم (English)</label>
                          <input type="text" name="productLabel_en" className="form-input" defaultValue={hero.productLabel?.en} />
                        </div>
                      </div>
                      <div className="form-row-3">
                        <div className="form-group">
                          <label className="form-label">نص البادج المائل (العربية)</label>
                          <input type="text" name="badge_ar" className="form-input" defaultValue={hero.badge?.ar || hero.badge} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">نص البادج المائل (English)</label>
                          <input type="text" name="badge_en" className="form-input" defaultValue={hero.badge?.en} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">السعر المعروض على الصورة (ج.م)</label>
                          <input type="number" name="heroPrice" className="form-input" defaultValue={hero.heroPrice} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label">الصورة الرئيسية للواجهة</label>
                        <input type="file" accept="image/*" className="form-input" />
                        {uploading && <div className="form-hint" style={{color:'var(--accent)'}}>جاري رفع الصورة...</div>}
                      </div>

                      <h4 style={{marginBottom:'16px', color:'var(--accent)', marginTop:'24px'}}>خلفية النصوص (الجزء الأيسر)</h4>
                      <div className="form-row-3">
                        <div className="form-group">
                          <label className="form-label">نوع الخلفية</label>
                          <select name="bgType" className="form-select" defaultValue={hero.bgType || 'solid'}>
                            <option value="solid">لون ثابت</option>
                            <option value="gradient">تدرج لوني</option>
                            <option value="transparent">شفاف</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">لون الخلفية</label>
                          <div className="color-picker-wrapper">
                            <input type="color" name="bgColor" className="color-picker-input" defaultValue={hero.bgColor || '#0a0a0a'} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label className="form-label">شفافية الخلفية (0 - 100)</label>
                          <input type="range" name="bgOpacity" className="opacity-slider" min="0" max="100" defaultValue={hero.bgOpacity || 100} style={{marginTop:'12px'}} />
                        </div>
                      </div>

                      <button type="submit" className="btn btn-primary" disabled={uploading} style={{marginTop:'24px'}}>حفظ التغييرات</button>
                    </form>
                  </div>
                </div>
              )}

              {/* SETTINGS PANEL */}
              {activePanel === 'settings' && (
                <div className="panel active">
                  <div className="card">
                    <div className="card-header"><h3 className="card-title"><i className="fa-solid fa-gear"></i> الروابط والتواصل</h3></div>
                    <form onSubmit={saveSettings}>
                      <div className="form-group">
                        <label className="form-label">رقم واتساب للطلبات</label>
                        <input type="text" name="whatsappNumber" className="form-input" defaultValue={settings.whatsappNumber} placeholder="201000000000" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">رابط فيسبوك</label>
                        <input type="url" name="facebookUrl" className="form-input" defaultValue={settings.facebookUrl} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">رابط انستغرام</label>
                        <input type="url" name="instagramUrl" className="form-input" defaultValue={settings.instagramUrl} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">رابط تيك توك</label>
                        <input type="url" name="tiktokUrl" className="form-input" defaultValue={settings.tiktokUrl} />
                      </div>

                      <h4 style={{marginTop: '30px', color: 'var(--accent)', marginBottom: '15px'}}>شريط الإعلانات العلوي</h4>
                      <p style={{fontSize: '0.85rem', color: 'var(--gray-mid)', marginBottom: '15px'}}>أضف العبارات التي ستتحرك في الشريط الأبيض أعلى الموقع</p>
                      
                      {announcements.map((ann, idx) => (
                        <div key={idx} style={{display:'flex', gap:'10px', marginBottom:'10px', alignItems:'center', background:'var(--bg)', padding:'10px', borderRadius:'8px', border:'1px solid var(--border)'}}>
                          <input type="text" className="form-input" placeholder="النص (عربي)" value={ann.text?.ar || ''} onChange={(e) => {
                            const newAnn = [...announcements];
                            newAnn[idx] = { ...newAnn[idx], text: { ...newAnn[idx].text, ar: e.target.value } };
                            setAnnouncements(newAnn);
                          }} style={{flex: 1}} />
                          <input type="text" className="form-input" placeholder="النص (English)" value={ann.text?.en || ''} onChange={(e) => {
                            const newAnn = [...announcements];
                            newAnn[idx] = { ...newAnn[idx], text: { ...newAnn[idx].text, en: e.target.value } };
                            setAnnouncements(newAnn);
                          }} style={{flex: 1}} />
                          <input type="text" className="form-input" placeholder="أيقونة (مثل fa-solid fa-star)" value={ann.icon || ''} onChange={(e) => {
                            const newAnn = [...announcements];
                            newAnn[idx] = { ...newAnn[idx], icon: e.target.value };
                            setAnnouncements(newAnn);
                          }} style={{flex: 0.5}} />
                          <button type="button" className="btn btn-danger btn-icon" onClick={() => {
                            setAnnouncements(announcements.filter((_, i) => i !== idx));
                          }}><i className="fa-solid fa-trash"></i></button>
                        </div>
                      ))}
                      
                      <button type="button" className="btn btn-outline" style={{marginTop:'10px', fontSize:'0.9rem'}} onClick={() => {
                        setAnnouncements([...announcements, { text: { ar: '', en: '' }, icon: 'fa-solid fa-star' }]);
                      }}><i className="fa-solid fa-plus"></i> إضافة إعلان جديد</button>

                      <hr style={{borderColor:'var(--border)', margin:'30px 0'}} />

                      <button type="submit" className="btn btn-primary" style={{marginTop:'20px'}}>حفظ التغييرات</button>
                    </form>
                  </div>
                </div>
              )}
            </main>

          </div>
        )}

        {/* MODALS */}
        {/* Product Modal */}
        <div className={`admin-modal-overlay ${isProductModalOpen ? 'active' : ''}`}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
              <button type="button" className="admin-modal-close" onClick={() => setIsProductModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={saveProduct}>
              <div className="admin-modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">الاسم (العربية)</label>
                    <input type="text" name="title_ar" className="form-input" defaultValue={editingProduct?.title?.ar || editingProduct?.title || editingProduct?.name} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">الاسم (English)</label>
                    <input type="text" name="title_en" className="form-input" defaultValue={editingProduct?.title?.en} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">التصنيف</label>
                    <select name="categoryId" className="form-select" defaultValue={editingProduct?.categoryId || editingProduct?.category} required>
                      {categories.map(c => <option key={c._id || c.name?.ar || c.name} value={c.name?.ar || c.name}>{c.name?.ar || c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">تاج مميز (اختياري)</label>
                    <input type="text" name="tag" className="form-input" placeholder="مثال: جديد" defaultValue={editingProduct?.tag} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group" style={{ width: '100%' }}>
                    <label className="form-label">الكمية المتاحة (المخزون)</label>
                    <input type="number" name="stock" className="form-input" defaultValue={editingProduct?.stock || 0} required />
                  </div>
                </div>
                <div className="form-group" style={{background:'var(--bg)',padding:'20px',borderRadius:'var(--radius-sm)',border:'1px solid var(--border)'}}>
                  <label className="form-label" style={{marginBottom:'16px',color:'var(--accent)'}}>المقاسات المتاحة وأسعارها</label>
                  <div className="size-price-list">
                    {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                      <div className="size-price-row" key={size}>
                        <input type="text" name="size_name" className="form-input" value={size} readOnly style={{maxWidth:'80px',textAlign:'center',background:'var(--bg-elevated)'}} />
                        <input type="number" name="size_price" className="form-input" placeholder="السعر بالجنيه (اتركه فارغاً للإلغاء)" defaultValue={editingProduct?.prices?.[size] || ''} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">الصور (بحد أقصى 4 صور - الأولى هي الرئيسية)</label>
                  <input type="file" multiple accept="image/*" className="form-input" />
                  {uploading && <div className="form-hint" style={{color:'var(--accent)', marginTop:'8px'}}>جاري رفع الصور، يرجى الانتظار...</div>}
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="submit" className="btn btn-primary" disabled={uploading}>{uploading ? 'جاري الرفع...' : 'حفظ المنتج'}</button>
                <button type="button" className="btn btn-outline" onClick={() => setIsProductModalOpen(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>

        {/* Category Modal */}
        <div className={`admin-modal-overlay ${isCategoryModalOpen ? 'active' : ''}`}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">{editingCategory ? 'تعديل التصنيف' : 'إضافة تصنيف'}</h2>
              <button type="button" className="admin-modal-close" onClick={() => setIsCategoryModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={saveCategory}>
              <div className="admin-modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">الاسم (العربية)</label>
                    <input type="text" name="name_ar" className="form-input" defaultValue={editingCategory?.name?.ar || editingCategory?.name} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">الاسم (English)</label>
                    <input type="text" name="name_en" className="form-input" defaultValue={editingCategory?.name?.en} />
                  </div>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="submit" className="btn btn-primary">حفظ</button>
                <button type="button" className="btn btn-outline" onClick={() => setIsCategoryModalOpen(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>

        {/* Coupon Modal */}
        <div className={`admin-modal-overlay ${isCouponModalOpen ? 'active' : ''}`}>
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">{editingCoupon ? 'تعديل الكود' : 'إضافة كود خصم'}</h2>
              <button type="button" className="admin-modal-close" onClick={() => setIsCouponModalOpen(false)}><i className="fa-solid fa-xmark"></i></button>
            </div>
            <form onSubmit={saveCoupon}>
              <div className="admin-modal-body">
                <div className="form-group">
                  <label className="form-label">كود الخصم</label>
                  <input type="text" name="code" className="form-input" defaultValue={editingCoupon?.code} required style={{textTransform:'uppercase',letterSpacing:'2px'}} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">النوع</label>
                    <select name="type" className="form-select" defaultValue={editingCoupon?.type || 'percentage'} required>
                      <option value="percentage">نسبة مئوية (%)</option>
                      <option value="fixed">مبلغ ثابت</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">القيمة</label>
                    <input type="number" name="value" className="form-input" defaultValue={editingCoupon?.value} required />
                  </div>
                </div>
                <div className="form-group" style={{display:'flex',alignItems:'center',gap:'10px',marginTop:'10px'}}>
                  <input type="checkbox" name="isActive" defaultChecked={editingCoupon ? editingCoupon.isActive : true} style={{width:'18px',height:'18px'}} />
                  <label className="form-label" style={{margin:0}}>تفعيل الكود (يمكن للعملاء استخدامه)</label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="submit" className="btn btn-primary">حفظ</button>
                <button type="button" className="btn btn-outline" onClick={() => setIsCouponModalOpen(false)}>إلغاء</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </>
  );
}
