import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FoodCard } from '../../components/student/FoodCard';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { EmptyState } from '../../components/common/EmptyState';
import { MENU_CATEGORIES } from '../../utils/constants';
import { Search, ArrowUpDown } from 'lucide-react';

export const MenuPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('');
  const [availableOnly, setAvailableOnly] = useState(false);

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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Digital Mess Menu</h1>
        <p className="text-xs sm:text-sm text-[#A3A3A3]">Browse categories, check live stock availability, and add items to your cart.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition border ${
              selectedCategory === cat
                ? 'bg-[#E50914] text-white border-[#E50914] shadow-md'
                : 'bg-[#111111] border-[#242424] text-[#A3A3A3] hover:bg-[#181010] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#111111] border border-[#242424] rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food items (e.g. Biryani, Dosa, Chai)..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 py-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#737373]" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-[#111111]">Default Order</option>
              <option value="price-asc" className="bg-[#111111]">Price: Low to High</option>
              <option value="price-desc" className="bg-[#111111]">Price: High to Low</option>
              <option value="name" className="bg-[#111111]">Name (A-Z)</option>
            </select>
          </div>

          {/* Available Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg px-3 py-2 text-xs font-semibold text-white">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-3.5 h-3.5 text-[#E50914] rounded focus:ring-[#E50914] cursor-pointer"
            />
            <span>In Stock Only</span>
          </label>
        </div>
      </div>

      {/* Food Grid */}
      {loading ? (
        <SkeletonLoader count={6} type="card" />
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
