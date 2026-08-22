import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { MenuAvailabilityTable } from '../../components/chef/MenuAvailabilityTable';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const ChefMenuAvailabilityPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenu = async () => {
    try {
      setLoading(true);
      const res = await api.get('/menu');
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
  }, []);

  const handleToggleAvailability = async (itemId, isAvailable, currentQty) => {
    try {
      const res = await api.patch(`/chef/menu/${itemId}/availability`, {
        isAvailable,
        availableQuantity: currentQty
      });
      if (res.success) {
        fetchMenu();
      }
    } catch (err) {
      alert('Failed to update availability.');
    }
  };

  const handleUpdateQuantity = async (itemId, newQty) => {
    try {
      const res = await api.patch(`/chef/menu/${itemId}/availability`, {
        availableQuantity: newQty,
        isAvailable: newQty > 0
      });
      if (res.success) {
        fetchMenu();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <SkeletonLoader count={5} type="table" />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">Kitchen Stock & Availability</h1>
        <p className="text-xs sm:text-sm text-slate-400">Update stock quantities and mark items as Sold Out. Changes reflect instantly for students.</p>
      </div>

      <MenuAvailabilityTable
        items={items}
        onToggleAvailability={handleToggleAvailability}
        onUpdateQuantity={handleUpdateQuantity}
      />
    </div>
  );
};
