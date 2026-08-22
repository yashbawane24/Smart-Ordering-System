import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { DataTable } from '../../components/common/DataTable';
import { StudentFormModal } from '../../components/admin/StudentFormModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';
import { formatCredits } from '../../utils/formatters';
import { Plus, Edit2, Trash2, UserCheck, UserX } from 'lucide-react';

export const StudentManagementPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/students');
      if (res.success) {
        setStudents(res.data.students);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (selectedStudent) {
        await api.patch(`/admin/students/${selectedStudent.id}`, formData);
      } else {
        await api.post('/admin/students', formData);
      }
      setIsModalOpen(false);
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      alert(err.message || 'Failed to save student.');
    }
  };

  const handleToggleActive = async (student) => {
    try {
      await api.patch(`/admin/students/${student.id}`, { isActive: !student.isActive });
      fetchStudents();
    } catch (err) {
      alert('Failed to update student status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/admin/students/${deleteId}`);
      setDeleteId(null);
      fetchStudents();
    } catch (err) {
      alert('Failed to delete student.');
    }
  };

  const columns = [
    {
      header: 'Student ID',
      accessor: 'studentIdStr',
      cell: (row) => <span className="font-mono font-bold text-[#E50914]">{row.studentIdStr}</span>
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
      header: 'Hostel & Room',
      cell: (row) => <span className="text-xs font-medium text-[#A3A3A3]">{row.hostel} ({row.roomNumber})</span>
    },
    {
      header: 'Wallet Balance',
      cell: (row) => <span className="font-extrabold text-[#E50914]">{formatCredits(row.creditAccount?.remainingCredit || 9000)}</span>
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
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleActive(row)}
            title={row.isActive ? 'Deactivate Account' : 'Activate Account'}
            className="p-1.5 text-[#A3A3A3] hover:text-white transition"
          >
            {row.isActive ? <UserX className="w-4 h-4 text-[#EF4444]" /> : <UserCheck className="w-4 h-4 text-[#22C55E]" />}
          </button>
          <button
            onClick={() => {
              setSelectedStudent(row);
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Student Directory</h1>
          <p className="text-xs sm:text-sm text-[#A3A3A3]">Manage student registrations, hostel room assignments, and active accounts.</p>
        </div>
        <button
          onClick={() => {
            setSelectedStudent(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 text-xs font-bold text-white bg-[#E50914] hover:bg-[#FF2D2D] rounded-lg transition shadow-md shadow-[#E50914]/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      <DataTable columns={columns} data={students} searchPlaceholder="Search student ID, name, email..." pageSize={10} />

      <StudentFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedStudent}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Student Account"
        message="Are you sure you want to delete this student account? All order and credit history will be permanently deleted."
        isDestructive
      />
    </div>
  );
};
