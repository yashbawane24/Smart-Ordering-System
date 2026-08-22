import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { ChefFormModal } from '../../components/admin/ChefFormModal';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { Plus, UserCheck, UserX } from 'lucide-react';

export const ChefManagementPage = () => {
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchChefs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/chefs');
      if (res.success) {
        setChefs(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, []);

  const handleCreateChef = async (formData) => {
    try {
      const res = await api.post('/admin/chefs', formData);
      if (res.success) {
        setIsModalOpen(false);
        fetchChefs();
      }
    } catch (err) {
      alert(err.message || 'Failed to create chef.');
    }
  };

  const handleToggleActive = async (chef) => {
    try {
      await api.patch(`/admin/chefs/${chef.id}/status`, { isActive: !chef.isActive });
      fetchChefs();
    } catch (err) {
      alert('Failed to update chef status.');
    }
  };

  const columns = [
    {
      header: 'Chef ID',
      accessor: 'chefIdStr',
      cell: (row) => <span className="font-mono font-bold text-[#E50914]">{row.chefIdStr}</span>
    },
    {
      header: 'Name',
      cell: (row) => (
        <div>
          <span className="font-bold text-white block">{row.user?.name}</span>
          <span className="text-xs text-[#A3A3A3]">{row.user?.email}</span>
        </div>
      )
    },
    {
      header: 'Phone',
      cell: (row) => <span className="text-xs text-[#A3A3A3]">{row.user?.phone || 'N/A'}</span>
    },
    {
      header: 'Status',
      cell: (row) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${
          row.isActive ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20' : 'bg-[#450A0A] text-[#EF4444] border-[#EF4444]/30'
        }`}>
          {row.isActive ? 'Active' : 'Deactivated'}
        </span>
      )
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => handleToggleActive(row)}
          className={`px-3 py-1 text-xs font-bold rounded-lg border transition flex items-center gap-1.5 ${
            row.isActive ? 'border-[#EF4444]/30 text-[#EF4444] hover:bg-[#450A0A]' : 'border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/10'
          }`}
        >
          {row.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
          {row.isActive ? 'Deactivate' : 'Activate'}
        </button>
      )
    }
  ];

  if (loading) return <SkeletonLoader count={4} type="table" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Kitchen Chef Staff</h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3]">Manage kitchen chef accounts and toggle active staff access.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition shadow-md shadow-[#E50914]/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Chef Staff
        </button>
      </div>

      <DataTable columns={columns} data={chefs} searchPlaceholder="Search chef ID, name..." pageSize={10} />

      <ChefFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateChef}
      />
    </div>
  );
};
