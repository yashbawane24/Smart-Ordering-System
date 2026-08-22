import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { CreditCard } from '../../components/student/CreditCard';
import { DataTable } from '../../components/common/DataTable';
import { formatCredits, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { ArrowDownRight, ArrowUpRight, RefreshCw, AlertCircle } from 'lucide-react';

export const CreditHistoryPage = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [walletRes, txRes] = await Promise.all([
        api.get('/credits'),
        api.get('/credits/transactions')
      ]);

      if (walletRes.success) setWallet(walletRes.data);
      if (txRes.success) setTransactions(txRes.data);
    } catch (err) {
      console.error('Failed to fetch credit wallet data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      header: 'Transaction ID',
      accessor: 'id',
      cell: (row) => <span className="font-mono text-xs font-black text-white">#{row.id.slice(0, 8)}</span>
    },
    {
      header: 'Type',
      accessor: 'type',
      cell: (row) => {
        const isCredit = row.amount > 0;
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 text-[11px] font-extrabold rounded-full text-white shadow-md ${
            isCredit
              ? 'bg-[#22C55E]'
              : 'bg-[#FF3B30]'
          }`}>
            {isCredit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            {row.type.replace('_', ' ')}
          </span>
        );
      }
    },
    {
      header: 'Description',
      accessor: 'description',
      cell: (row) => <span className="text-xs font-bold text-white">{row.description}</span>
    },
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (row) => (
        <span className={`font-black font-mono ${row.amount > 0 ? 'text-[#22C55E]' : 'text-[#FF3B30]'}`}>
          {row.amount > 0 ? `+${formatCredits(row.amount)}` : formatCredits(row.amount)}
        </span>
      )
    },
    {
      header: 'Balance After',
      accessor: 'balanceAfter',
      cell: (row) => <span className="font-mono text-xs font-black text-[#8E8E93]">{formatCredits(row.balanceAfter)}</span>
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (row) => <span className="text-xs text-[#8E8E93] font-medium">{formatDate(row.createdAt)}</span>
    }
  ];

  if (loading) return <SkeletonLoader count={4} type="card" />;

  return (
    <div className="space-y-8 max-w-[1250px] mx-auto pb-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Credit Wallet & Ledger</h1>
        <p className="text-xs font-bold text-[#FF3B30]">Monthly credit allocations, meal debits, and transaction logs.</p>
      </div>

      {/* Credit Card & Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <CreditCard
          studentName={user?.name}
          studentIdStr={wallet?.student?.studentIdStr}
          remainingCredits={wallet?.remainingCredit || 8700}
          usedCredits={wallet?.usedCredit || 300}
          monthlyCredits={wallet?.monthlyCredit || 9000}
        />

        <div className="bg-[#222222] border border-[#2D2D2D] rounded-[24px] p-6 shadow-xl space-y-4">
          <h3 className="font-black text-white text-base tracking-tight">Monthly Credit Rules</h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 p-3.5 bg-[#1A1A1A] rounded-2xl border border-[#2D2D2D]">
              <RefreshCw className="w-5 h-5 text-[#FF3B30] shrink-0" />
              <div>
                <h4 className="font-extrabold text-white">Automatic 9,000 Credit Reset</h4>
                <p className="text-[#8E8E93]">Every 1st of the month, 9,000 fresh credits are allocated to your wallet.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 bg-[#1A1A1A] rounded-2xl border border-[#2D2D2D]">
              <AlertCircle className="w-5 h-5 text-[#FF3B30] shrink-0" />
              <div>
                <h4 className="font-extrabold text-white">Instant Credit Refund</h4>
                <p className="text-[#8E8E93]">Cancelling a pending order immediately restores credits to your balance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="space-y-3 pt-2">
        <h2 className="text-base font-black text-white tracking-tight">Transaction History</h2>
        <div className="bg-[#222222] border border-[#2D2D2D] rounded-[24px] p-4 shadow-2xl overflow-hidden">
          <DataTable columns={columns} data={transactions} searchPlaceholder="Search description or type..." pageSize={10} />
        </div>
      </div>
    </div>
  );
};

