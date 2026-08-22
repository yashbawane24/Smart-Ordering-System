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
    <div className="bg-[#111111] border border-[#242424] rounded-2xl shadow-sm overflow-hidden">
      {/* Search Header */}
      <div className="p-4 border-b border-[#242424] flex flex-col sm:flex-row justify-between items-center gap-4 bg-[#0F0F0F]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#737373]" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 text-xs font-medium bg-[#0F0F0F] text-white border border-[#2A2A2A] rounded-lg placeholder-[#666666] focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914]/50 transition"
          />
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Showing {paginatedData.length} of {filteredData.length} records
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#151515] text-[#A3A3A3] font-bold uppercase tracking-wider border-b border-[#242424]">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-3.5">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C1C]">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="bg-[#0F0F0F] hover:bg-[#181010] transition">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 text-white">
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-[#737373]">
                  No records match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-[#242424] bg-[#0F0F0F] flex items-center justify-between">
          <span className="text-xs text-[#A3A3A3]">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-[#2A2A2A] rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#181010] hover:border-[#7F1D1D] transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-[#2A2A2A] rounded-lg text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#181010] hover:border-[#7F1D1D] transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
