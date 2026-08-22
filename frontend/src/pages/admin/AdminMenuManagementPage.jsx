import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { MenuItemFormModal } from '../../components/admin/MenuItemFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCredits } from '../../utils/formatters';
import { Plus, Edit2, Trash2 } from 'lucide-react';

export const AdminMenuManagementPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get('/menu');
      if (res.success) {
        setMenuItems(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (selectedItem) {
        await api.patch(`/admin/menu/${selectedItem.id}`, formData);
      } else {
        await api.post('/admin/menu', formData);
      }
      setIsModalOpen(false);
      setSelectedItem(null);
      fetchMenu();
    } catch (err) {
      alert(err.message || 'Failed to save menu item.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/menu/${deleteId}`);
      setDeleteId(null);
      fetchMenu();
    } catch (err) {
      alert('Failed to delete item.');
    }
  };

  const columns = [
    {
      header: 'Item',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.imageUrl} alt={row.name} className="w-10 h-10 rounded-lg object-cover border border-[#242424]" />
          <div>
            <span className="font-bold text-white block">{row.name}</span>
            <span className="text-xs text-[#A3A3A3] line-clamp-1">{row.description}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      accessor: 'category',
      cell: (row) => <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-[#151515] text-[#A3A3A3] border border-[#242424]">{row.category}</span>
    },
    {
      header: 'Price',
      accessor: 'price',
      cell: (row) => <span className="font-extrabold text-[#E50914]">{formatCredits(row.price)}</span>
    },
    {
      header: 'Stock Qty',
      accessor: 'availableQuantity',
      cell: (row) => <span className="font-bold text-white">{row.availableQuantity} units</span>
    },
    {
      header: 'Availability',
      cell: (row) => {
        const isOut = !row.isAvailable || row.availableQuantity <= 0;
        return (
          <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${isOut ? 'bg-[#181818] text-[#737373] border-[#242424]' : 'bg-[#450A0A] text-[#FF2D2D] border-[#7F1D1D]'}`}>
            {isOut ? 'SOLD OUT' : 'Available'}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedItem(row);
              setIsModalOpen(true);
            }}
            className="p-1.5 text-[#A3A3A3] hover:text-white transition"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="p-1.5 text-[#A3A3A3] hover:text-[#EF4444] transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  if (loading) return <SkeletonLoader count={5} type="table" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Mess Menu Management</h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3]">Add food items, update prices, manage stock quantities, and upload image URLs.</p>
        </div>
        <button
          onClick={() => {
            setSelectedItem(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition shadow-md shadow-[#E50914]/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Food Item
        </button>
      </div>

      <DataTable columns={columns} data={menuItems} searchPlaceholder="Search food item or category..." pageSize={10} />

      <MenuItemFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedItem}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        message="Are you sure you want to delete this food item from the menu?"
        isDestructive
      />
    </div>
  );
};
