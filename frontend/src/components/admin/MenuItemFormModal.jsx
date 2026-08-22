import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { MENU_CATEGORIES } from '../../utils/constants';

export const MenuItemFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Breakfast',
    price: '',
    availableQuantity: 100,
    imageUrl: '',
    isAvailable: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        category: initialData.category || 'Breakfast',
        price: initialData.price || '',
        availableQuantity: initialData.availableQuantity ?? 100,
        imageUrl: initialData.imageUrl || '',
        isAvailable: initialData.isAvailable ?? true
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Breakfast',
        price: 50,
        availableQuantity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        isAvailable: true
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const categories = MENU_CATEGORIES.filter(c => c !== 'All');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Menu Item' : 'Add New Food Item'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Food Item Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
            placeholder="e.g. Masala Dosa"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Description</label>
          <textarea
            rows="2"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
            placeholder="Brief item description..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#111111]">{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Price (Credits)</label>
            <input
              type="number"
              required
              min="1"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Initial Stock Quantity</label>
            <input
              type="number"
              min="0"
              value={formData.availableQuantity}
              onChange={(e) => setFormData({ ...formData, availableQuantity: parseInt(e.target.value) || 0 })}
              className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-[#A3A3A3] uppercase mb-1">Image URL</label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg focus:outline-none focus:border-[#E50914]"
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="w-4 h-4 text-[#E50914] rounded focus:ring-[#E50914] cursor-pointer"
          />
          <label htmlFor="isAvailable" className="text-xs font-semibold text-white cursor-pointer">
            Item Available for Ordering
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#2A2A2A]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-[#A3A3A3] hover:text-white bg-[#151515] border border-[#242424] rounded-lg transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition shadow-md shadow-[#E50914]/20"
          >
            {initialData ? 'Update Item' : 'Add Item'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
