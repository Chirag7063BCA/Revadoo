import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Send, AlertCircle } from 'lucide-react';
import { deleteLotteryApi, getAdminLotteriesApi } from '../../../../services/lotteryApi';

const LotteryList = ({ onSelectLottery, refreshTrigger }) => {
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLotteries();
  }, [refreshTrigger]);

  const fetchLotteries = async () => {
    setLoading(true);
    try {
      const response = await getAdminLotteriesApi();
      if (response.success) {
        setLotteries(response.data || []);
        setError('');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch lotteries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure? Draft lotteries can only be deleted.')) {
      return;
    }

    try {
      const response = await deleteLotteryApi(id);
      if (response.success) {
        setLotteries((prev) => prev.filter((l) => l._id !== id));
      }
    } catch (err) {
      alert(err.message || 'Failed to delete lottery');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-700',
      published: 'bg-blue-100 text-blue-700',
      announced: 'bg-green-100 text-green-700',
      completed: 'bg-purple-100 text-purple-700',
    };

    return (
      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${styles[status] || 'bg-gray-100 text-gray-700'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="text-black/60">Loading lotteries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
        <AlertCircle size={20} className="text-red-600" />
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (lotteries.length === 0) {
    return (
      <div className="rounded-lg border border-black/10 bg-white p-8 text-center">
        <p className="text-black/60">No lotteries created yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-black/10 bg-black/5">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-black">Lottery Name</th>
              <th className="px-4 py-3 text-left font-bold text-black">Prize Pool</th>
              <th className="px-4 py-3 text-left font-bold text-black">Entry Fee</th>
              <th className="px-4 py-3 text-left font-bold text-black">Tickets</th>
              <th className="px-4 py-3 text-left font-bold text-black">Status</th>
              <th className="px-4 py-3 text-right font-bold text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {lotteries.map((lottery) => (
              <tr key={lottery._id} className="border-b border-black/5 hover:bg-black/2">
                <td className="px-4 py-3 font-semibold text-black">{lottery.name}</td>
                <td className="px-4 py-3 text-black/70">₹{lottery.prizePool.toLocaleString('en-IN')}</td>
                <td className="px-4 py-3 text-black/70">₹{lottery.entryFee}</td>
                <td className="px-4 py-3 text-black/70">
                  {lottery.ticketsSold}/{lottery.totalTickets}
                </td>
                <td className="px-4 py-3">{getStatusBadge(lottery.status)}</td>
                <td className="flex justify-end gap-2 px-4 py-3">
                  <button
                    onClick={() => onSelectLottery(lottery, 'view')}
                    className="rounded-lg bg-black/10 p-2 hover:bg-black/20"
                    title="View Details"
                  >
                    <Eye size={16} className="text-black" />
                  </button>

                  {lottery.status === 'draft' && (
                    <>
                      <button
                        onClick={() => handleDelete(lottery._id)}
                        className="rounded-lg bg-red-100 p-2 hover:bg-red-200"
                        title="Delete"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </>
                  )}

                  {lottery.status === 'published' && (
                    <button
                      onClick={() => onSelectLottery(lottery, 'announce')}
                      className="rounded-lg bg-green-100 p-2 hover:bg-green-200"
                      title="Go To Tickets / Announce"
                    >
                      <Send size={16} className="text-green-600" />
                    </button>
                  )}

                  {lottery.status === 'draft' && (
                    <button
                      onClick={() => onSelectLottery(lottery, 'publish')}
                      className="rounded-lg bg-blue-100 p-2 hover:bg-blue-200"
                      title="Publish Lottery"
                    >
                      <Send size={16} className="text-blue-600" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LotteryList;
