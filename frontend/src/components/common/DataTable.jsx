import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export const DataTable = ({ columns, data, searchPlaceholder = 'Search records...', pageSize = 10 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = data.filter(row =>
    columns.some(col => {
      const val = col.accessor ? row[col.accessor] : col.cell ? col.cell(row) : null;
      if (!val) return false;
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-[#222222] border border-[#2D2D2D] rounded-[24px] shadow-2xl overflow-hidden">
      {/* Search Header */}
      <div className="p-4 sm:p-5 border-b border-[#2D2D2D] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#1A1A1A]">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-11 pr-4 py-2.5 text-xs font-semibold bg-[#242424] text-white border border-[#333333] rounded-full placeholder-[#666666] focus:outline-none focus:border-[#FF3B30] transition"
          />
        </div>
        <div className="text-xs font-extrabold text-[#8E8E93]">
          Showing <span className="text-white font-mono">{paginatedData.length}</span> of <span className="text-[#FF3B30] font-mono">{filteredData.length}</span> records
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#1A1A1A] text-[#8E8E93] font-black uppercase tracking-wider border-b border-[#2D2D2D]">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D2D2D]/60">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="bg-[#222222] hover:bg-[#2A2A2A] transition-colors duration-150">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-white font-medium">
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-[#8E8E93] font-extrabold">
                  No records match your search query.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[#2D2D2D] bg-[#1A1A1A] flex items-center justify-between">
          <span className="text-xs font-extrabold text-[#8E8E93]">
            Page <span className="text-white font-mono">{currentPage}</span> of <span className="text-white font-mono">{totalPages}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-[#333333] rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FF3B30] transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-[#333333] rounded-full text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#FF3B30] transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


