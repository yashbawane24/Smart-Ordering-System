import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { CreditAdjustmentModal } from '../../components/admin/CreditAdjustmentModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCredits } from '../../utils/formatters';
import { RefreshCw, PlusCircle } from 'lucide-react';

export const CreditManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const fetchCreditsData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/credits');
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditsData();
  }, []);

  const handleAdjustCredit = async (payload) => {
    try {
      const res = await api.patch('/admin/credits/adjust', payload);
      if (res.success) {
        setIsAdjustModalOpen(false);
        fetchCreditsData();
      }
    } catch (err) {
      alert(err.message || 'Failed to adjust credit balance.');
    }
  };

  const handleResetMonthly = async () => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);
      const res = await api.post('/admin/credits/allocate', { monthYear: currentMonth });
      if (res.success) {
        setIsResetConfirmOpen(false);
        fetchCreditsData();
        alert(`Successfully allocated 9,000 monthly credits to all student accounts.`);
      }
    } catch (err) {
      alert('Failed to execute monthly credit reset.');
    }
  };

  const columns = [
    {
      header: 'Student Reg ID',
      accessor: 'studentIdStr',
      cell: (row) => <span className="font-mono font-bold text-[#E50914]">{row.studentIdStr}</span>
    },
    {
      header: 'Student Name',
      cell: (row) => (
        <div>
          <span className="font-bold text-white block">{row.user?.name}</span>
          <span className="text-xs text-[#A3A3A3]">{row.user?.email}</span>
        </div>
      )
    },
    {
      header: 'Monthly Limit',
      cell: (row) => <span className="text-xs font-semibold text-[#A3A3A3]">{formatCredits(row.creditAccount?.monthlyCredit || 9000)}</span>
    },
    {
      header: 'Used Credits',
      cell: (row) => <span className="font-bold text-white">{formatCredits(row.creditAccount?.usedCredit || 0)}</span>
    },
    {
      header: 'Remaining Credits',
      cell: (row) => <span className="font-extrabold text-[#E50914]">{formatCredits(row.creditAccount?.remainingCredit || 9000)}</span>
    },
    {
      header: 'Actions',
      cell: (row) => (
        <button
          onClick={() => {
            setSelectedStudent(row);
            setIsAdjustModalOpen(true);
          }}
          className="px-3 py-1.5 text-xs font-bold text-white bg-[#450A0A] border border-[#7F1D1D] hover:bg-[#E50914] rounded-lg transition flex items-center gap-1"
        >
          <PlusCircle className="w-3.5 h-3.5 text-[#FF2D2D]" /> Adjust Credits
        </button>
      )
    }
  ];

  if (loading) return <SkeletonLoader count={5} type="table" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Mess Credit Wallet Administration</h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3]">View student balance ledgers, execute manual top-ups, and trigger monthly 9,000 credit resets.</p>
        </div>

        <button
          onClick={() => setIsResetConfirmOpen(true)}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition shadow-md shadow-[#E50914]/20 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Reset Monthly Credits (9,000)
        </button>
      </div>

      <DataTable columns={columns} data={students} searchPlaceholder="Search student ID, name..." pageSize={10} />

      <CreditAdjustmentModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        onSubmit={handleAdjustCredit}
        student={selectedStudent}
      />

      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetMonthly}
        title="Trigger Monthly Credit Allocation"
        message="Are you sure you want to reset all student credit balances back to 9,000 credits for the current month? This action will generate audit ledger transaction records for every student."
      />
    </div>
  );
};
