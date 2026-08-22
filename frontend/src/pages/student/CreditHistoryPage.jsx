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
      cell: (row) => <span className="font-mono text-xs font-bold text-[#737373]">#{row.id.slice(0, 8)}</span>
    },
    {
      header: 'Type',
      accessor: 'type',
      cell: (row) => {
        const isCredit = row.amount > 0;
        return (
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${
            isCredit
              ? 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/20'
              : 'bg-[#450A0A] text-[#FF2D2D] border-[#7F1D1D]'
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
      cell: (row) => <span className="text-xs font-medium text-white">{row.description}</span>
    },
    {
      header: 'Amount',
      accessor: 'amount',
      cell: (row) => (
        <span className={`font-extrabold ${row.amount > 0 ? 'text-[#22C55E]' : 'text-[#FF2D2D]'}`}>
          {row.amount > 0 ? `+${formatCredits(row.amount)}` : formatCredits(row.amount)}
        </span>
      )
    },
    {
      header: 'Balance After',
      accessor: 'balanceAfter',
      cell: (row) => <span className="font-mono text-xs font-bold text-[#A3A3A3]">{formatCredits(row.balanceAfter)}</span>
    },
    {
      header: 'Date',
      accessor: 'createdAt',
      cell: (row) => <span className="text-xs text-[#737373]">{formatDate(row.createdAt)}</span>
    }
  ];

  if (loading) return <SkeletonLoader count={4} type="card" />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Credit Wallet & Ledger</h1>
        <p className="text-xs sm:text-sm text-[#A3A3A3]">Track monthly credit allocations, order debits, refunds, and balance resets.</p>
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

        <div className="bg-[#111111] border border-[#242424] rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="font-bold text-white text-lg">Monthly Credit Rules</h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#1C1C1C]">
              <RefreshCw className="w-5 h-5 text-[#E50914] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-white">Automatic Reset</h4>
                <p className="text-[#A3A3A3]">Every 1st of the month, 9,000 fresh credits are allocated to your wallet.</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#1C1C1C]">
              <AlertCircle className="w-5 h-5 text-[#FF2D2D] flex-shrink-0" />
              <div>
                <h4 className="font-bold text-white">Instant Order Refunds</h4>
                <p className="text-[#A3A3A3]">Cancelling a pending order instantly restores credits to your account.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Ledger Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white">Transaction History</h2>
        <DataTable columns={columns} data={transactions} searchPlaceholder="Search description or type..." pageSize={10} />
      </div>
    </div>
  );
};
