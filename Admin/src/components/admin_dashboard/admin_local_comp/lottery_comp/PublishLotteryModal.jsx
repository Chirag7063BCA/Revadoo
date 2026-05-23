import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { publishLotteryApi } from '../../../../services/lotteryApi';

const PublishLotteryModal = ({ lotteryId, lotteryName, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const handlePublish = async () => {
    setLoading(true);
    setStatus('publishing');

    try {
      const response = await publishLotteryApi(lotteryId);

      if (response.success) {
        setStatus('success');
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      }
    } catch (err) {
      setStatus('error');
      alert(err.message || 'Failed to publish lottery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6">
          {status === 'success' ? (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle size={48} className="text-green-600" />
              <h2 className="text-xl font-black text-green-600">Lottery Published!</h2>
              <p className="text-center text-sm text-black/60">
                All tickets have been generated and are ready for purchase.
              </p>
            </div>
          ) : (
            <>
              <h2 className="mb-2 text-xl font-black text-black">Publish Lottery?</h2>
              <p className="text-sm text-black/70">{lotteryName}</p>
            </>
          )}
        </div>

        {status !== 'success' && (
          <>
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-yellow-600" />
              <div className="text-sm text-yellow-700">
                <p className="font-bold">This action cannot be undone.</p>
                <p className="mt-1">All lottery tickets will be generated and made available for purchase.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePublish}
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {loading && <Loader size={16} className="animate-spin" />}
                {loading ? 'Publishing...' : 'Publish Lottery'}
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

        {status === 'success' && (
          <button
            onClick={onCancel}
            className="w-full rounded-lg bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default PublishLotteryModal;
