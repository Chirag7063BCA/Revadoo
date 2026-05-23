import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CreateLotteryForm from './CreateLotteryForm';
import LotteryList from './LotteryList';
import PublishLotteryModal from './PublishLotteryModal';
import LotteryTicketsTable from './LotteryTicketsTable';
import AnnounceWinnerModal from './AnnounceWinnerModal';

const LotteryManagement = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedLotteryId, setSelectedLotteryId] = useState(null);
  const [selectedLotteryName, setSelectedLotteryName] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showTicketsView, setShowTicketsView] = useState(false);
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicketNumber, setSelectedTicketNumber] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectLottery = (lottery, action) => {
    setSelectedLotteryId(lottery._id);
    setSelectedLotteryName(lottery.name || '');

    if (action === 'publish') {
      setShowPublishModal(true);
      return;
    }

    if (action === 'view' || action === 'announce') {
      setShowTicketsView(true);
    }
  };

  const handleSelectWinner = (ticketId, ticketNumber) => {
    setSelectedTicketId(ticketId);
    setSelectedTicketNumber(ticketNumber || '');
    setShowAnnounceModal(true);
  };

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handlePublishSuccess = () => {
    setShowPublishModal(false);
    setShowTicketsView(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleAnnounceSuccess = () => {
    setShowAnnounceModal(false);
    setShowTicketsView(false);
    setSelectedLotteryId(null);
    setSelectedLotteryName('');
    setSelectedTicketId(null);
    setSelectedTicketNumber('');
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-black">Lottery Management</h1>
          <p className="mt-1 text-sm text-black/60">
            Create, publish, and manage lottery draws
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600"
        >
          <Plus size={18} />
          New Lottery
        </button>
      </div>

      {showTicketsView && selectedLotteryId ? (
        <div className="space-y-4">
          <button
            onClick={() => {
              setShowTicketsView(false);
              setSelectedLotteryId(null);
            }}
            className="text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            ← Back to Lotteries
          </button>
          <LotteryTicketsTable
            lotteryId={selectedLotteryId}
            lotteryName={selectedLotteryName}
            onSelectWinner={handleSelectWinner}
          />
        </div>
      ) : (
        <LotteryList
          onSelectLottery={handleSelectLottery}
          refreshTrigger={refreshTrigger}
        />
      )}

      {showCreateForm && (
        <CreateLotteryForm
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {showPublishModal && selectedLotteryId && (
        <PublishLotteryModal
          lotteryId={selectedLotteryId}
          lotteryName={selectedLotteryName}
          onSuccess={handlePublishSuccess}
          onCancel={() => setShowPublishModal(false)}
        />
      )}

      {showAnnounceModal && selectedLotteryId && (
        <AnnounceWinnerModal
          lotteryId={selectedLotteryId}
          selectedTicketId={selectedTicketId}
          selectedTicketNumber={selectedTicketNumber}
          onSuccess={handleAnnounceSuccess}
          onCancel={() => {
            setShowAnnounceModal(false);
            setSelectedTicketId(null);
            setSelectedTicketNumber('');
          }}
        />
      )}
    </div>
  );
};

export default LotteryManagement;
