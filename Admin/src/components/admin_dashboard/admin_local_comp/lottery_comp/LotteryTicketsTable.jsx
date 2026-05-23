import React, { useState, useEffect } from 'react';
import { Search, AlertCircle } from 'lucide-react';
import { getLotteryTicketsApi } from '../../../../services/lotteryApi';

const LotteryTicketsTable = ({ lotteryId, lotteryName, onSelectWinner }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [lotteryId, statusFilter]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await getLotteryTicketsApi(lotteryId, statusFilter);

      if (response.success) {
        setTickets(response.data || []);
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketNumber.includes(searchTerm) ||
      (ticket.userName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (ticket.userEmail || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const stats = {
    total: tickets.length,
    available: tickets.filter((t) => t.status === 'available').length,
    sold: tickets.filter((t) => t.status === 'sold').length,
    claimed: tickets.filter((t) => t.status === 'claimed').length,
  };

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <AlertCircle size={20} className="text-red-600" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <h3 className="mb-3 font-bold text-black">{lotteryName} - Tickets</h3>

        <div className="grid grid-cols-4 gap-3 md:grid-cols-4">
          <div className="rounded-lg bg-black/5 p-3 text-center">
            <p className="text-xs text-black/60">Total</p>
            <p className="mt-1 text-xl font-black text-black">{stats.total}</p>
          </div>
          <div className="rounded-lg bg-blue-50 p-3 text-center">
            <p className="text-xs text-blue-600">Available</p>
            <p className="mt-1 text-xl font-black text-blue-600">{stats.available}</p>
          </div>
          <div className="rounded-lg bg-green-50 p-3 text-center">
            <p className="text-xs text-green-600">Sold</p>
            <p className="mt-1 text-xl font-black text-green-600">{stats.sold}</p>
          </div>
          <div className="rounded-lg bg-purple-50 p-3 text-center">
            <p className="text-xs text-purple-600">Claimed</p>
            <p className="mt-1 text-xl font-black text-purple-600">{stats.claimed}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-lg border border-black/10 bg-white px-3">
          <Search size={18} className="text-black/40" />
          <input
            type="text"
            placeholder="Search by ticket #, user name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 py-2 text-sm focus:outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-bold text-black focus:border-orange-500 focus:outline-none"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="claimed">Claimed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center py-8">
            <p className="text-black/60">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-black/60">No tickets found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-black/10 bg-black/5">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-black">Ticket #</th>
                  <th className="px-4 py-3 text-left font-bold text-black">Buyer Name</th>
                  <th className="px-4 py-3 text-left font-bold text-black">Email</th>
                  <th className="px-4 py-3 text-left font-bold text-black">Status</th>
                  <th className="px-4 py-3 text-left font-bold text-black">Winner</th>
                  <th className="px-4 py-3 text-left font-bold text-black">Purchased</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="border-b border-black/5 hover:bg-black/2"
                    onClick={() =>
                      ticket.status === 'sold' &&
                      onSelectWinner?.(ticket._id, ticket.ticketNumber)
                    }
                    style={{
                      cursor:
                        ticket.status === 'sold' ? 'pointer' : 'default',
                    }}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-black">
                      {ticket.ticketNumber}
                    </td>
                    <td className="px-4 py-3 text-black/70">
                      {ticket.userName || '—'}
                    </td>
                    <td className="px-4 py-3 text-black/70 text-xs">
                      {ticket.userEmail || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-bold uppercase tracking-wider ${
                          ticket.status === 'sold'
                            ? 'bg-green-100 text-green-700'
                            : ticket.status === 'available'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {ticket.isWinner ? (
                        <span className="inline-flex rounded-full bg-orange-100 px-2 py-1 text-xs font-bold text-orange-700">
                          ✓ WINNER
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-black/70 text-xs">
                      {ticket.purchasedAt
                        ? new Date(ticket.purchasedAt).toLocaleDateString()
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LotteryTicketsTable;
