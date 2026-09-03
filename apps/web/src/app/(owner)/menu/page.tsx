'use client';

import React, { useEffect, useState } from 'react';
import {
  Utensils, Plus, Search, Edit2, Trash2, ArrowLeft, Check, X,
  AlertCircle, Tag, DollarSign, Image as ImageIcon, ToggleLeft, ToggleRight, Sparkles, Filter,
  BookOpen, ChefHat, Package, Scale, Layers, TrendingUp, Settings
} from 'lucide-react';
import Link from 'next/link';

export default function MenuManagementPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [showAddEditModal, setShowAddEditModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Recipe BOM Modal State
  const [showRecipeModal, setShowRecipeModal] = useState<boolean>(false);
  const [recipeTargetProduct, setRecipeTargetProduct] = useState<any | null>(null);
  const [recipeItems, setRecipeItems] = useState<any[]>([]);
  const [availableStockItems, setAvailableStockItems] = useState<any[]>([]);
  const [newRecipeIngName, setNewRecipeIngName] = useState<string>('');
  const [newRecipeQtyNeeded, setNewRecipeQtyNeeded] = useState<number>(0.1);
  const [newRecipeUnit, setNewRecipeUnit] = useState<string>('kg');

  // Form State
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    description: '',
    price: 0,
    costPrice: 0,
    category: 'Makanan Utama',
    status: 'AVAILABLE',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    variants: [{ name: '' }]
  });

  // Image Presets
  const imagePresets = [
    { label: 'Nasi Goreng', url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=400&q=80' },
    { label: 'Ayam Bakar', url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=400&q=80' },
    { label: 'Kopi Aren', url: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=400&q=80' },
    { label: 'Es Teh', url: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80' },
    { label: 'Cireng/Snack', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80' },
    { label: 'Burger', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' }
  ];

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/owner/menu');
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  // Quick 1-Click Toggle Stock Status (Available <-> Sold Out)
  const handleToggleStatus = async (prodId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'AVAILABLE' ? 'SOLD_OUT' : 'AVAILABLE';

    setProducts(prev => prev.map(p => p.id === prodId ? { ...p, status: nextStatus } : p));

    try {
      await fetch('/api/owner/menu/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: prodId, status: nextStatus })
      });
    } catch (err) {
      console.error(err);
      fetchMenuData();
    }
  };

  // Open Form for Adding
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      id: '',
      name: '',
      description: '',
      price: 25000,
      costPrice: 12000,
      category: categories[0]?.name || 'Makanan Utama',
      status: 'AVAILABLE',
      imageUrl: imagePresets[0].url,
      variants: [{ name: '' }]
    });
    setShowAddEditModal(true);
  };

  // Open Form for Editing
  const handleOpenEditModal = (prod: any) => {
    setEditingProduct(prod);
    setFormData({
      id: prod.id,
      name: prod.name,
      description: prod.description || '',
      price: prod.price || 0,
      costPrice: prod.costPrice || Math.round(prod.price * 0.5),
      category: prod.category || 'Makanan Utama',
      status: prod.status || 'AVAILABLE',
      imageUrl: prod.imageUrl || imagePresets[0].url,
      variants: prod.variants && prod.variants.length > 0 ? prod.variants : [{ name: '' }]
    });
    setShowAddEditModal(true);
  };

  // Open Recipe BOM Modal
  const handleOpenRecipeModal = async (prod: any) => {
    setRecipeTargetProduct(prod);
    setShowRecipeModal(true);
    try {
      const res = await fetch(`/api/owner/recipes?productId=${prod.id}`);
      const data = await res.json();
      if (data.success && data.recipeItems && data.recipeItems.length > 0) {
        setRecipeItems(data.recipeItems);
      } else {
        setRecipeItems([
          { ingredientName: 'Beras Premium', quantityNeeded: 0.2, unit: 'kg' },
          { ingredientName: 'Minyak Goreng', quantityNeeded: 0.02, unit: 'liter' }
        ]);
      }

      const invRes = await fetch('/api/owner/inventory');
      const invData = await invRes.json();
      if (invData.success && invData.items) {
        setAvailableStockItems(invData.items);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRecipeIngredient = () => {
    if (!newRecipeIngName.trim()) return;
    setRecipeItems(prev => [
      ...prev,
      { ingredientName: newRecipeIngName, quantityNeeded: Number(newRecipeQtyNeeded), unit: newRecipeUnit }
    ]);
    setNewRecipeIngName('');
  };

  const handleRemoveRecipeIngredient = (idx: number) => {
    setRecipeItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveRecipeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeTargetProduct) return;
    try {
      const res = await fetch('/api/owner/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: recipeTargetProduct.id,
          recipeItems
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowRecipeModal(false);
        fetchMenuData();
      }
    } catch (err) {
      console.error(err);
      setShowRecipeModal(false);
    }
  };

  // Submit Menu Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/owner/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          variants: formData.variants.filter(v => v.name.trim().length > 0)
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowAddEditModal(false);
        fetchMenuData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Menu
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus menu ini?')) return;
    try {
      await fetch(`/api/owner/menu?id=${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'ALL' || p.category === selectedCategory || p.categoryId === selectedCategory;
    const matchStatus = selectedStatus === 'ALL' || p.status === selectedStatus;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchStatus && matchSearch;
  });

  const totalCount = products.length;
  const availableCount = products.filter(p => p.status === 'AVAILABLE').length;
  const soldOutCount = products.filter(p => p.status === 'SOLD_OUT').length;

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      background: '#f8f5ef',
      color: '#1d2925',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      maxWidth: 480,
      margin: '0 auto',
      position: 'relative',
      boxShadow: '0 0 40px rgba(0,0,0,0.1)',
      paddingBottom: 90
    }}>
      {/* Header */}
      <header style={{
        padding: '20px 20px 14px',
        background: '#f8f5ef',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/" style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#1d2925', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p style={{ fontSize: '0.7rem', color: '#247d68', fontWeight: 800, textTransform: 'uppercase' }}>RESTOQU KATALOG</p>
              <h1 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#1d2925', letterSpacing: -0.3 }}>Kelola Menu & Stok</h1>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            style={{ padding: '8px 14px', borderRadius: 9999, background: '#247d68', color: '#ffffff', border: 'none', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 12px rgba(36,125,104,0.3)' }}
          >
            <Plus size={16} /> Menu Baru
          </button>
        </div>
      </header>

      <main style={{ padding: '0 20px' }}>
        {/* Metric Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', padding: 12, borderRadius: 18 }}>
            <span style={{ fontSize: '0.65rem', color: '#6b7280', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>TOTAL MENU</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: 2, color: '#1d2925' }}>{totalCount} <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Produk</span></h3>
          </div>

          <div style={{ background: '#dcfce7', border: '1px solid #bbf7d0', padding: 12, borderRadius: 18 }}>
            <span style={{ fontSize: '0.65rem', color: '#166534', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>TERSEDIA</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: 2, color: '#166534' }}>{availableCount} <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Aktif</span></h3>
          </div>

          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', padding: 12, borderRadius: 18 }}>
            <span style={{ fontSize: '0.65rem', color: '#991b1b', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>STOK HABIS</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginTop: 2, color: '#991b1b' }}>{soldOutCount} <span style={{ fontSize: '0.7rem', fontWeight: 600 }}>Sold Out</span></h3>
          </div>
        </div>

        {/* Search Bar & Category Filter */}
        <div style={{ marginBottom: 12, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#9ca3af' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama menu / deskripsi..."
            style={{ width: '100%', padding: '8px 10px 8px 36px', borderRadius: 12, background: '#ffffff', border: '1px solid #e5e7eb', fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
          />
        </div>

        {/* Category Pills & Status Filter */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 14 }}>
          <button
            onClick={() => setSelectedCategory('ALL')}
            style={{
              padding: '6px 12px', borderRadius: 9999, border: 'none', fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap', cursor: 'pointer',
              background: selectedCategory === 'ALL' ? '#247d68' : '#ffffff',
              color: selectedCategory === 'ALL' ? '#ffffff' : '#4b5563',
              boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
            }}
          >
            Semua ({products.length})
          </button>
          {categories.map(c => (
            <button
              key={c.id || c.name}
              onClick={() => setSelectedCategory(c.name)}
              style={{
                padding: '6px 12px', borderRadius: 9999, border: 'none', fontSize: '0.75rem', fontWeight: 800, whiteSpace: 'nowrap', cursor: 'pointer',
                background: selectedCategory === c.name ? '#247d68' : '#ffffff',
                color: selectedCategory === c.name ? '#ffffff' : '#4b5563',
                boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
              }}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Product Catalog Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#6b7280', fontWeight: 700 }}>
            Memuat Katalog Menu...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ background: '#ffffff', borderRadius: 20, padding: 30, textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Utensils size={36} style={{ color: '#9ca3af', margin: '0 auto 10px' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>Menu Tidak Ditemukan</h4>
            <p style={{ fontSize: '0.78rem', color: '#6b7280', marginTop: 4 }}>
              Coba ubah kata kunci pencarian atau tambah menu baru.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredProducts.map(p => {
              const isAvailable = p.status === 'AVAILABLE';
              const marginRp = p.price - (p.costPrice || 0);

              return (
                <div key={p.id} style={{
                  background: '#ffffff', borderRadius: 20, padding: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  display: 'flex', gap: 12, borderLeft: isAvailable ? '4px solid #247d68' : '4px solid #dc2626'
                }}>
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 14, flexShrink: 0, opacity: isAvailable ? 1 : 0.6 }}
                  />

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 9999, fontWeight: 800, background: '#f3f4f6', color: '#4b5563' }}>
                            {p.category}
                          </span>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1d2925', marginTop: 2 }}>{p.name}</h4>
                        </div>

                        {/* Quick 1-Click Toggle Switcher */}
                        <button
                          onClick={() => handleToggleStatus(p.id, p.status)}
                          style={{
                            padding: '4px 8px', borderRadius: 9999, border: 'none', fontSize: '0.68rem', fontWeight: 800, cursor: 'pointer',
                            background: isAvailable ? '#dcfce7' : '#fee2e2',
                            color: isAvailable ? '#166534' : '#991b1b'
                          }}
                          title="Klik untuk ubah status ketersediaan"
                        >
                          {isAvailable ? '🟢 Tersedia' : '🔴 Stok Habis'}
                        </button>
                      </div>

                      {p.description && (
                        <p style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: 2, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {p.description}
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                      <div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#247d68' }}>
                          Rp{p.price.toLocaleString('id-ID')}
                        </span>
                        {p.costPrice > 0 && (
                          <span style={{ fontSize: '0.65rem', color: '#6b7280', display: 'block' }}>
                            HPP: Rp{p.costPrice.toLocaleString('id-ID')} (Margin: Rp{marginRp.toLocaleString('id-ID')})
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          onClick={() => handleOpenRecipeModal(p)}
                          style={{ padding: '4px 8px', borderRadius: 8, background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                          title="Atur Resep BOM & Takaran Bahan"
                        >
                          <BookOpen size={12} /> Resep BOM
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(p)}
                          style={{ width: 28, height: 28, borderRadius: '50%', background: '#f3f4f6', border: 'none', color: '#1d2925', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          style={{ width: 28, height: 28, borderRadius: '50%', background: '#fee2e2', border: 'none', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* PERMANENT FIXED OWNER BOTTOM NAVBAR */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#ffffff', borderTop: '1px solid #e5e7eb',
        padding: '10px 12px calc(14px + env(safe-area-inset-bottom, 0px))', zIndex: 99999, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.12)'
      }}>
        <Link href="/dashboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#9ca3af', padding: '4px 0' }}>
          <Layers size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Home</span>
        </Link>
        <Link href="/menu" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#247d68', padding: '4px 0' }}>
          <Utensils size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 900 }}>Menu</span>
        </Link>
        <Link href="/reports" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#9ca3af', padding: '4px 0' }}>
          <TrendingUp size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Laporan</span>
        </Link>
        <Link href="/inventory" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#9ca3af', padding: '4px 0' }}>
          <Package size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Stok</span>
        </Link>
        <Link href="/settings" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, textDecoration: 'none', color: '#9ca3af', padding: '4px 0' }}>
          <Settings size={20} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700 }}>Setting</span>
        </Link>
      </nav>

      {/* MODAL RESEP BOM & HPP INTEGRATION */}
      {showRecipeModal && recipeTargetProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 120, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', borderRadius: '28px 28px 0 0', padding: 24, background: '#ffffff', boxShadow: '0 -10px 30px rgba(0,0,0,0.2)', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#247d68', fontWeight: 800, textTransform: 'uppercase' }}>KONFIGURASI RESEP BOM</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900 }}>{recipeTargetProduct.name}</h3>
              </div>
              <button onClick={() => setShowRecipeModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveRecipeSubmit}>
              {/* Recipe Ingredients List */}
              <div style={{ background: '#f9fafb', borderRadius: 16, padding: 14, marginBottom: 14, border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#4b5563' }}>TAKARAN BAHAN BAKU PER PORSI</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#247d68' }}>{recipeItems.length} Bahan</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                  {recipeItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ffffff', padding: '8px 12px', borderRadius: 10, border: '1px solid #e5e7eb', fontSize: '0.82rem' }}>
                      <div>
                        <span style={{ fontWeight: 800 }}>{item.ingredientName}</span>
                        <span style={{ fontSize: '0.72rem', color: '#6b7280', display: 'block' }}>
                          Takaran: <strong>{item.quantityNeeded} {item.unit}</strong> per porsi
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipeIngredient(idx)}
                        style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new ingredient to recipe */}
                <div style={{ borderTop: '1px dashed #d1d5db', paddingTop: 10 }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 4 }}>+ TAMBAH BAHAN KE RESEP</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 60px', gap: 6, marginBottom: 6 }}>
                    <input
                      type="text"
                      value={newRecipeIngName}
                      onChange={e => setNewRecipeIngName(e.target.value)}
                      placeholder="Nama Bahan (contoh: Beras)"
                      style={{ padding: '8px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', fontSize: '0.78rem', fontWeight: 700, outline: 'none' }}
                    />
                    <input
                      type="number"
                      step="0.001"
                      value={newRecipeQtyNeeded}
                      onChange={e => setNewRecipeQtyNeeded(Number(e.target.value))}
                      style={{ padding: '8px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', fontSize: '0.78rem', fontWeight: 700, outline: 'none' }}
                    />
                    <input
                      type="text"
                      value={newRecipeUnit}
                      onChange={e => setNewRecipeUnit(e.target.value)}
                      placeholder="kg / liter"
                      style={{ padding: '8px', borderRadius: 8, background: '#ffffff', border: '1px solid #d1d5db', fontSize: '0.78rem', fontWeight: 700, outline: 'none' }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddRecipeIngredient}
                    style={{ width: '100%', padding: '8px', borderRadius: 8, background: '#247d68', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                  >
                    + Tambahkan Bahan
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowRecipeModal(false)}
                  style={{ flex: 1, padding: 12, borderRadius: 14, background: '#f3f4f6', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: 12, borderRadius: 14, background: '#247d68', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 12px rgba(36,125,104,0.3)' }}
                >
                  Simpan Resep & Hitung HPP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH / EDIT MENU */}
      {showAddEditModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 110, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', borderRadius: '28px 28px 0 0', padding: 24, background: '#ffffff', boxShadow: '0 -10px 30px rgba(0,0,0,0.2)', maxHeight: '92vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900 }}>
                {editingProduct ? 'Edit Menu Restoran' : 'Tambah Menu Baru'}
              </h3>
              <button onClick={() => setShowAddEditModal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              {/* Nama Menu */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 2 }}>NAMA MENU</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Nasi Goreng Spesial RestoQu"
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.88rem', fontWeight: 700, outline: 'none' }}
                />
              </div>

              {/* Kategori */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 2 }}>KATEGORI</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.88rem', fontWeight: 700, outline: 'none' }}
                >
                  {categories.map(c => (
                    <option key={c.id || c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Harga Jual & Harga Modal */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 2 }}>HARGA JUAL (RP)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.9rem', fontWeight: 800, color: '#247d68', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 2 }}>HPP / MODAL (RP)</label>
                  <input
                    type="number"
                    value={formData.costPrice}
                    onChange={e => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.9rem', fontWeight: 700, outline: 'none' }}
                  />
                </div>
              </div>

              {/* Deskripsi */}
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 2 }}>DESKRIPSI SIKAT MENU</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Penjelasan singkat rasa, bahan baku, atau porsi..."
                  rows={2}
                  style={{ width: '100%', padding: '10px', borderRadius: 12, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.82rem', fontWeight: 600, outline: 'none' }}
                />
              </div>

              {/* URL Gambar Preset Selector */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 4 }}>FOTO / GAMBAR PRODUK</label>
                <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6, marginBottom: 8 }}>
                  {imagePresets.map((img, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: img.url })}
                      style={{
                        padding: '4px 10px', borderRadius: 8, fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap',
                        background: formData.imageUrl === img.url ? '#247d68' : '#f3f4f6',
                        color: formData.imageUrl === img.url ? '#fff' : '#4b5563', border: 'none'
                      }}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.78rem', outline: 'none' }}
                />
              </div>

              {/* Status Stock Availability */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#4b5563', display: 'block', marginBottom: 4 }}>STATUS KETERSEDIAAN STOK</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'AVAILABLE' })}
                    style={{
                      padding: '10px', borderRadius: 12, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                      background: formData.status === 'AVAILABLE' ? '#dcfce7' : '#f9fafb',
                      color: formData.status === 'AVAILABLE' ? '#166534' : '#6b7280',
                      border: formData.status === 'AVAILABLE' ? '2px solid #247d68' : '1px solid #e5e7eb'
                    }}
                  >
                    🟢 Tersedia (Active)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 'SOLD_OUT' })}
                    style={{
                      padding: '10px', borderRadius: 12, fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer',
                      background: formData.status === 'SOLD_OUT' ? '#fee2e2' : '#f9fafb',
                      color: formData.status === 'SOLD_OUT' ? '#991b1b' : '#6b7280',
                      border: formData.status === 'SOLD_OUT' ? '2px solid #dc2626' : '1px solid #e5e7eb'
                    }}
                  >
                    🔴 Stok Habis (Sold Out)
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowAddEditModal(false)}
                  style={{ flex: 1, padding: 12, borderRadius: 14, background: '#f3f4f6', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: 12, borderRadius: 14, background: '#247d68', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 12px rgba(36,125,104,0.3)' }}
                >
                  {editingProduct ? 'Simpan Perubahan' : 'Tambah Menu Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
