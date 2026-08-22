import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FoodCard } from '../../components/student/FoodCard';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { Search, ArrowUpDown } from 'lucide-react';

export const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

  // Category disk buttons matching reference design
  const categoryDisks = [
    { label: 'All', emoji: '🍔' },
    { label: 'Breakfast', emoji: '🍕' },
    { label: 'Lunch', emoji: '🍟' },
    { label: 'Dinner', emoji: '🍲' },
    { label: 'Snacks', emoji: '🥪' },
    { label: 'Beverages', emoji: '🍦' },
    { label: 'Dessert', emoji: '🍰' },
  ];

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      if (availableOnly) params.append('availableOnly', 'true');

      const res = await api.get(`/menu?${params.toString()}`);
      if (res.success) {
        setItems(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, [selectedCategory, search, sort, availableOnly]);

  return (
    <div className="space-y-6 max-w-[1250px] mx-auto pb-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Digital Mess Menu</h1>
        <p className="text-xs font-bold text-[#FF3B30]">Select your favorite dishes and order with Monthly Credits.</p>
      </div>

      {/* Top Search Bar (Reference UI design) */}
      <div className="relative w-full max-w-2xl">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Restaurant, Food, Cuisine or a Dish"
          className="w-full pl-5 pr-14 py-3.5 text-xs font-semibold bg-[#242424] text-white border border-[#333333] rounded-full focus:outline-none focus:border-[#FF3B30] transition placeholder:text-[#666666] shadow-xl"
        />
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#333333] text-[#8E8E93] flex items-center justify-center">
          <Search className="w-4 h-4" />
        </div>
      </div>

      {/* Circular Disk Categories (Reference UI horizontal scroll) */}
      <section className="space-y-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-[#8E8E93]">Categories</h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-2 pt-1 no-scrollbar">
          {categoryDisks.map((cat) => {
            const isSelected = selectedCategory === cat.label;
            return (
              <button
                key={cat.label}
                onClick={() => setSelectedCategory(cat.label)}
                className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl shrink-0 transition-all duration-300 shadow-xl border ${
                  isSelected
                    ? 'bg-[#FF3B30] text-white border-[#FF3B30] ring-4 ring-[#FF3B30]/30 scale-105'
                    : 'bg-[#262626] border-[#333333] text-white hover:border-[#FF3B30] hover:scale-105'
                }`}
                title={cat.label}
              >
                <span>{cat.emoji}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sort & Availability Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <span className="text-xs font-bold text-[#8E8E93]">
          Showing <span className="text-white font-mono font-black">{items.length}</span> dishes
        </span>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 bg-[#222222] border border-[#2D2D2D] rounded-full px-4 py-2 text-xs font-bold text-white">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#8E8E93]" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#222222]">Default Sort</option>
              <option value="price-asc" className="bg-[#222222]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#222222]">Price: High to Low</option>
              <option value="name" className="bg-[#222222]">Name (A-Z)</option>
            </select>
          </div>

          {/* Available Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-[#222222] border border-[#2D2D2D] rounded-full px-4 py-2 text-xs font-bold text-white">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-3.5 h-3.5 text-[#FF3B30] rounded focus:ring-[#FF3B30] cursor-pointer"
            />
            <span>In Stock</span>
          </label>
        </div>
      </div>

      {/* Pop-Out 3D Food Cards Grid */}
      {loading ? (
        <SkeletonLoader count={6} type="card" />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {items.map((item) => (
            <FoodCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No Food Items Found"
          message="Try clearing your search query or selecting a different category."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedCategory('All');
            setSearch('');
            setSort('');
            setAvailableOnly(false);
          }}
        />
      )}
    </div>
  );
};

