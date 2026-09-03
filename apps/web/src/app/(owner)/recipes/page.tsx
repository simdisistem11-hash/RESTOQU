'use client';

import React, { useEffect, useState } from 'react';
import { Utensils, Package, Plus, Trash2, ArrowLeft, CheckCircle2, RefreshCw, Layers, TrendingUp, Settings } from 'lucide-react';
import Link from 'next/link';

interface RecipeItem {
  ingredientName: string;
  quantityNeeded: number;
  unit: string;
}

interface ProductRecipe {
  productId: string;
  productName: string;
  category: string;
  price: number;
  calculatedHpp?: number;
  recipeItems: RecipeItem[];
}

export default function RecipesBOMPage() {
  const [recipes, setRecipes] = useState<ProductRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState<ProductRecipe | null>(null);
  const [newIngredient, setNewIngredient] = useState('');
  const [newQty, setNewQty] = useState(0.1);
  const [newUnit, setNewUnit] = useState('kg');

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/owner/recipes');
      const data = await res.json();
      if (data.success && data.recipes) {
        setRecipes(data.recipes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAddIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRecipe || !newIngredient) return;

    const updatedItems = [
      ...selectedRecipe.recipeItems,
      { ingredientName: newIngredient, quantityNeeded: newQty, unit: newUnit }
    ];

    try {
      await fetch('/api/owner/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedRecipe.productId,
          recipeItems: updatedItems
        })
      });
      fetchRecipes();
    } catch (err) {
      console.error(err);
    } finally {
      setNewIngredient('');
      setSelectedRecipe(null);
    }
  };

  const handleRemoveIngredient = async (prodId: string, ingIdx: number) => {
    const target = recipes.find(r => r.productId === prodId);
    if (!target) return;
    const updatedItems = target.recipeItems.filter((_, idx) => idx !== ingIdx);

    try {
      await fetch('/api/owner/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: prodId,
          recipeItems: updatedItems
        })
      });
      fetchRecipes();
    } catch (err) {
      console.error(err);
    }
  };

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
      paddingBottom: 40
    }}>
      {/* Mobile Header */}
      <header style={{
        padding: '20px 20px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#f8f5ef',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', color: '#1d2925', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <p style={{ fontSize: '0.72rem', color: '#247d68', fontWeight: 700 }}>BILL OF MATERIALS (BOM)</p>
            <h1 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1d2925', letterSpacing: -0.3 }}>Resep & Potong Stok</h1>
          </div>
        </div>

        <button onClick={fetchRecipes} style={{ width: 36, height: 36, borderRadius: '50%', background: '#ffffff', color: '#247d68', border: '1px solid #247d68', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <RefreshCw size={16} />
        </button>
      </header>

      {/* Main Content */}
      <main style={{ padding: '0 20px' }}>
        <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 16 }}>
          Setiap kali transaksi menu terbayar di Kasir/QR, stok bahan baku inventaris di bawah akan otomatis terpotong sesuai takaran resep.
        </p>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 30, color: '#6b7280', fontWeight: 700 }}>
            Memuat Resep BOM...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {recipes.map(r => (
              <div key={r.productId} style={{ background: '#ffffff', borderRadius: 22, padding: 18, boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#247d68', background: '#dff3e9', padding: '2px 8px', borderRadius: 9999 }}>
                      {r.category}
                    </span>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 900, marginTop: 4 }}>{r.productName}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#1d2925' }}>
                      Rp{r.price.toLocaleString('id-ID')}
                    </span>
                    {r.calculatedHpp !== undefined && (
                      <span style={{ fontSize: '0.68rem', color: '#6b7280', display: 'block', fontWeight: 700 }}>
                        HPP: Rp{r.calculatedHpp.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: 10, marginBottom: 12 }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', marginBottom: 6 }}>TAKARAN BAHAN BAKU (PER PORSI):</p>
                  
                  {r.recipeItems.length === 0 ? (
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', fontStyle: 'italic' }}>Belum ada resep bahan baku terdaftar.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {r.recipeItems.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb', padding: '8px 12px', borderRadius: 12, fontSize: '0.82rem' }}>
                          <span style={{ fontWeight: 700 }}>{item.ingredientName}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontWeight: 800, color: '#247d68' }}>{item.quantityNeeded} {item.unit}</span>
                            <button onClick={() => handleRemoveIngredient(r.productId, i)} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }}>
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedRecipe(r)}
                  style={{ width: '100%', padding: '10px', borderRadius: 12, background: '#f3f4f6', border: '1px solid #e5e7eb', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Plus size={14} /> Tambah Takaran Bahan
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Tambah Bahan ke Resep */}
      {selectedRecipe && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 360, background: '#ffffff', borderRadius: 24, padding: 20, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 900, marginBottom: 4 }}>Tambah Takaran Bahan</h3>
            <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 14 }}>Menu: <strong>{selectedRecipe.productName}</strong></p>

            <form onSubmit={handleAddIngredient}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', display: 'block', marginBottom: 2 }}>NAMA BAHAN BAKU</label>
                <input
                  type="text"
                  value={newIngredient}
                  onChange={e => setNewIngredient(e.target.value)}
                  placeholder="Contoh: Beras Premium"
                  required
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', display: 'block', marginBottom: 2 }}>JUMLAH TAKARAN</label>
                  <input
                    type="number"
                    step="0.001"
                    value={newQty}
                    onChange={e => setNewQty(Number(e.target.value))}
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6b7280', display: 'block', marginBottom: 2 }}>SATUAN (UNIT)</label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={e => setNewUnit(e.target.value)}
                    placeholder="kg / liter / pcs"
                    required
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 10, background: '#f9fafb', border: '1px solid #e5e7eb', fontSize: '0.82rem', fontWeight: 700, outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => setSelectedRecipe(null)} style={{ flex: 1, padding: 10, borderRadius: 12, background: '#f3f4f6', border: 'none', fontWeight: 800, cursor: 'pointer' }}>
                  Batal
                </button>
                <button type="submit" style={{ flex: 1, padding: 10, borderRadius: 12, background: '#247d68', color: '#fff', border: 'none', fontWeight: 900, cursor: 'pointer' }}>
                  Simpan Bahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* FIXED OWNER BOTTOM NAVBAR */}
      <nav style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480, background: '#ffffff', borderTop: '1px solid #e5e7eb',
        padding: '8px 12px 14px', zIndex: 90, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 2,
        boxShadow: '0 -4px 20px rgba(0,0,0,0.06)'
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
    </div>
  );
}
