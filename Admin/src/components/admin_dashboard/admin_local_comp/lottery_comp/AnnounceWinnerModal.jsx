import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader, Wand2 } from 'lucide-react';
import { announceWinnerApi } from '../../../../services/lotteryApi';

const AnnounceWinnerModal = ({ lotteryId, selectedTicketId, selectedTicketNumber, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [winnerMode, setWinnerMode] = useState('manual');

  const handleAnnounce = async () => {
    setLoading(true);
    setStatus('announcing');

    try {
      const payload = {
        autoSelect: winnerMode === 'auto',
      };

      if (winnerMode === 'manual' && selectedTicketId) {
        payload.winningTicketId = selectedTicketId;
      } else if (winnerMode === 'manual' && selectedTicketNumber) {
        payload.manualWinningNumber = selectedTicketNumber;
      }

      const response = await announceWinnerApi(lotteryId, payload);

      if (response.success) {
        setStatus('success');
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
    } catch (err) {
      setStatus('error');
      alert(err.message || 'Failed to announce winner');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {status === 'success' ? (
          <div className="flex flex-col items-center gap-3">
            <CheckCircle size={48} className="text-green-600" />
            <h2 className="text-xl font-black text-green-600">Winner Announced!</h2>
            <p className="text-center text-sm text-black/60">
              The lottery result has been published successfully.
            </p>
            <button
              onClick={onCancel}
              className="mt-4 w-full rounded-lg bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="mb-2 text-xl font-black text-black">Announce Winner</h2>
              <p className="text-sm text-black/70">
                Choose how to select the winning ticket.
              </p>
            </div>

            <div className="mb-6 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-black/10 p-4 transition hover:border-orange-300">
                <input
                  type="radio"
                  name="winner-mode"
                  value="manual"
                  checked={winnerMode === 'manual'}
                  onChange={(e) => setWinnerMode(e.target.value)}
                  className="h-4 w-4"
                />
                <div>
                  <p className="font-bold text-black">Manual Selection</p>
                  <p className="text-xs text-black/60">
                    {selectedTicketId || selectedTicketNumber
                      ? 'You have selected a ticket'
                      : 'Select a ticket from the list'}
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-black/10 p-4 transition hover:border-orange-300">
                <input
                  type="radio"
                  name="winner-mode"
                  value="auto"
                  checked={winnerMode === 'auto'}
                  onChange={(e) => setWinnerMode(e.target.value)}
                  className="h-4 w-4"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-black">Auto Selection</p>
                    <Wand2 size={16} className="text-orange-500" />
                  </div>
                  <p className="text-xs text-black/60">
                    Random selection from sold tickets
                  </p>
                </div>
              </label>
            </div>

            <div className="mb-6 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-yellow-600" />
              <div className="text-xs text-yellow-700">
                <p className="font-bold">This action cannot be undone.</p>
                <p className="mt-1">
                  The winning ticket and amount will be publicly visible.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleAnnounce}
                disabled={
                  loading ||
                  (winnerMode === 'manual' && !selectedTicketId && !selectedTicketNumber)
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {loading && <Loader size={16} className="animate-spin" />}
                {loading ? 'Announcing...' : 'Announce Winner'}
              </button>
              <button
                onClick={onCancel}
                disabled={loading}
                className="rounded-lg border border-black/10 px-4 py-3 font-bold text-black hover:bg-black/5 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AnnounceWinnerModal;
