import React, { useMemo, useState } from 'react';
import { AlertCircle, Calendar, ChevronLeft, ChevronRight, Loader, Save, Sparkles, X } from 'lucide-react';
import { createLotteryApi } from '../../../../services/lotteryApi';

const DEFAULT_FORM = {
  name: '',
  description: '',
  prizePool: '',
  entryFee: '',
  totalTickets: '',
  winnerSelectionMode: 'auto',
  preselectedWinningNumber: '',
  publishAt: '',
  drawEndAt: '',
};

const generateTicketNumbers = (count) => {
  const safeCount = Math.max(0, Number(count) || 0);
  const numbers = new Set();

  while (numbers.size < safeCount) {
    numbers.add(String(Math.floor(100000 + Math.random() * 900000)));
  }

  return Array.from(numbers);
};

const stepTitles = [
  'Lottery Details',
  'Prize Setup',
  'Tickets & Winner',
  'Schedule & Publish',
];

const CreateLotteryForm = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [generatedTickets, setGeneratedTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const previewTickets = useMemo(() => generatedTickets.slice(0, 60), [generatedTickets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateTickets = () => {
    const total = Number(formData.totalTickets);
    if (!total || total < 1) {
      setError('Please enter a valid total tickets count first.');
      return;
    }

    if (total > 5000) {
      setError('For performance, max 5000 tickets are allowed per draw in this panel.');
      return;
    }

    const numbers = generateTicketNumbers(total);
    setGeneratedTickets(numbers);

    if (formData.winnerSelectionMode === 'manual') {
      setFormData((prev) => ({ ...prev, preselectedWinningNumber: numbers[0] || '' }));
    }

    setError('');
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) return 'Lottery name is required.';
      return null;
    }

    if (step === 2) {
      if (!formData.prizePool || Number(formData.prizePool) < 0) return 'Valid prize pool is required.';
      if (!formData.entryFee || Number(formData.entryFee) < 0) return 'Valid entry fee is required.';
      return null;
    }

    if (step === 3) {
      if (!formData.totalTickets || Number(formData.totalTickets) < 1) return 'Total tickets is required.';
      if (generatedTickets.length !== Number(formData.totalTickets)) return 'Generate ticket numbers first.';
      if (formData.winnerSelectionMode === 'manual' && !formData.preselectedWinningNumber) {
        return 'Select a manual winning number.';
      }
      return null;
    }

    if (step === 4) {
      if (!formData.publishAt) return 'Publish date & time is required.';
      if (!formData.drawEndAt) return 'Draw end date & time is required.';

      const publishAt = new Date(formData.publishAt).getTime();
      const endAt = new Date(formData.drawEndAt).getTime();

      if (publishAt >= endAt) return 'Publish date must be before draw end date.';
      return null;
    }

    return null;
  };

  const nextStep = () => {
    const stepError = validateStep();
    if (stepError) {
      setError(stepError);
      return;
    }
    setError('');
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const stepError = validateStep();
    if (stepError) {
      setError(stepError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        prizePool: Number(formData.prizePool),
        entryFee: Number(formData.entryFee),
        totalTickets: Number(formData.totalTickets),
        winnerSelectionMode: formData.winnerSelectionMode,
        preselectedWinningNumber:
          formData.winnerSelectionMode === 'manual' ? formData.preselectedWinningNumber : null,
        preGeneratedTicketNumbers: generatedTickets,
        publishAt: new Date(formData.publishAt).toISOString(),
        drawEndAt: new Date(formData.drawEndAt).toISOString(),
      };

      const response = await createLotteryApi(payload);
      if (response.success) {
        setFormData(DEFAULT_FORM);
        setGeneratedTickets([]);
        setStep(1);
        onSuccess?.(response.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to create lottery');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-black">Create Lottery Wizard</h2>
            <p className="mt-1 text-sm text-black/60">
              Step {step} of 4 - {stepTitles[step - 1]}
            </p>
          </div>
          <button onClick={onCancel} className="text-black/50 hover:text-black">
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 grid grid-cols-4 gap-2">
          {stepTitles.map((title, idx) => {
            const active = step === idx + 1;
            const done = step > idx + 1;
            return (
              <div
                key={title}
                className={`rounded-lg border px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.12em] ${
                  active
                    ? 'border-orange-400 bg-orange-50 text-orange-700'
                    : done
                    ? 'border-green-200 bg-green-50 text-green-700'
                    : 'border-black/10 bg-black/5 text-black/45'
                }`}
              >
                {title}
              </div>
            );
          })}
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-3">
            <AlertCircle size={18} className="text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {step === 1 && (
            <>
              <div>
                <label className="mb-2 block text-sm font-bold text-black/70">Lottery Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Evening Mega Bumper"
                  className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-black/70">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe this lucky draw"
                  className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-bold text-black/70">Prize Pool (₹) *</label>
                <input
                  type="number"
                  name="prizePool"
                  min="0"
                  value={formData.prizePool}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-bold text-black/70">Entry Fee (₹) *</label>
                <input
                  type="number"
                  name="entryFee"
                  min="0"
                  value={formData.entryFee}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-black/70">Total Tickets *</label>
                  <input
                    type="number"
                    name="totalTickets"
                    min="1"
                    max="5000"
                    value={formData.totalTickets}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleGenerateTickets}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-500"
                  >
                    <Sparkles size={16} />
                    Generate Ticket Numbers
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-black/70">Winner Selection</label>
                  <select
                    name="winnerSelectionMode"
                    value={formData.winnerSelectionMode}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                  >
                    <option value="auto">Automatic (Random)</option>
                    <option value="manual">Manual (Admin chooses ticket)</option>
                  </select>
                </div>

                {formData.winnerSelectionMode === 'manual' && (
                  <div>
                    <label className="mb-2 block text-sm font-bold text-black/70">Manual Winning Ticket</label>
                    <select
                      name="preselectedWinningNumber"
                      value={formData.preselectedWinningNumber}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                    >
                      <option value="">Select ticket number</option>
                      {generatedTickets.map((ticket) => (
                        <option key={ticket} value={ticket}>
                          {ticket}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-bold text-black">Generated Tickets Preview</p>
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-black/50">
                    Total: {generatedTickets.length}
                  </p>
                </div>
                {generatedTickets.length === 0 ? (
                  <p className="text-sm text-black/55">No tickets generated yet.</p>
                ) : (
                  <div className="grid max-h-52 grid-cols-3 gap-2 overflow-auto sm:grid-cols-5 lg:grid-cols-6">
                    {previewTickets.map((ticket) => (
                      <div
                        key={ticket}
                        className={`rounded-md border px-2 py-1 text-center font-mono text-xs font-bold ${
                          formData.preselectedWinningNumber === ticket
                            ? 'border-orange-400 bg-orange-100 text-orange-800'
                            : 'border-black/10 bg-white text-black/75'
                        }`}
                      >
                        {ticket}
                      </div>
                    ))}
                  </div>
                )}
                {generatedTickets.length > previewTickets.length && (
                  <p className="mt-2 text-xs text-black/50">
                    Showing first {previewTickets.length} tickets only.
                  </p>
                )}
              </div>
            </>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                  <Calendar size={14} /> Publish At *
                </label>
                <input
                  type="datetime-local"
                  name="publishAt"
                  value={formData.publishAt}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-black/70">
                  <Calendar size={14} /> Draw Ending At *
                </label>
                <input
                  type="datetime-local"
                  name="drawEndAt"
                  value={formData.drawEndAt}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm focus:border-orange-500 focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={step === 1 || loading}
              className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-4 py-2.5 text-sm font-bold text-black hover:bg-black/5 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-500"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                  {loading ? 'Creating...' : 'Create Lottery'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLotteryForm;
