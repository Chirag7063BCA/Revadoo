import { useEffect, useMemo, useRef, useState } from "react";
import { Save, RefreshCw, Trash2, Power, Edit3, Upload, X } from "lucide-react";

const BASE = "http://localhost:5000";

const PRESETS = [
  {
    value: "starter",
    label: "Starter",
    description: "Fast flow for high CTR",
    timerSeconds: 10,
    verificationMethod: "checkbox",
  },
  {
    value: "standard",
    label: "Standard",
    description: "Balanced quality + speed",
    timerSeconds: 20,
    verificationMethod: "math",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Higher quality traffic",
    timerSeconds: 30,
    verificationMethod: "math",
  },
  {
    value: "premium",
    label: "Premium",
    description: "Strictest user flow",
    timerSeconds: 45,
    verificationMethod: "math",
  },
];

const EMPTY_FORM = {
  code: "",
  title: "",
  reward: "",
  startAfterHours: "0",
  durationDays: "1",
  expiryDateTime: "",
  topImageUrl: "",
  topText: "",
  middleImageUrl: "",
  middleText: "",
  extraText: "",
  actionButtonLabel: "Redirect to Website",
  shortlinkType: "starter",
  timerSeconds: "10",
  verificationMethod: "checkbox",
  isActive: true,
};

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700 outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-100";

const AdminShortLinksManager = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const topImageFileRef = useRef(null);

  const getAuthHeaders = (json = false) => {
    const token = localStorage.getItem("token");
    return {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/api/shortlinks/admin/list`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to load shortlinks");
      setLinks(data.links || []);
    } catch (err) {
      setError(err.message || "Failed to load shortlinks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const applyPreset = (presetValue) => {
    const preset = PRESETS.find((item) => item.value === presetValue);
    if (!preset) return;

    setForm((prev) => ({
      ...prev,
      shortlinkType: preset.value,
      timerSeconds: String(preset.timerSeconds),
      verificationMethod: preset.verificationMethod,
      title: prev.title || `${preset.label} Shortlink`,
    }));
  };

  const handleField = (key) => (event) => {
    const value = key === "isActive" ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleTopImageFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Top photo must be an image file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Top photo must be under 4 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, topImageUrl: String(reader.result || "") }));
      setError("");
    };
    reader.onerror = () => {
      setError("Failed to read top photo file.");
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const validate = () => {
    if (!form.code.trim()) return "Code is required.";
    if (!form.reward || Number(form.reward) <= 0) return "Reward must be greater than 0.";
    if (!form.timerSeconds || Number(form.timerSeconds) < 3) return "Timer must be at least 3 seconds.";
    return "";
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      code: form.code.trim().toLowerCase(),
      title: form.title.trim() || "Shortlink",
      reward: Number(form.reward),
      startAfterHours: Number(form.startAfterHours),
      durationDays: Number(form.durationDays),
      expiryDateTime: form.expiryDateTime,
      topImageUrl: form.topImageUrl.trim(),
      topText: form.topText.trim(),
      middleImageUrl: form.middleImageUrl.trim(),
      middleText: form.middleText.trim(),
      extraText: form.extraText.trim(),
      actionButtonLabel: form.actionButtonLabel.trim() || "Redirect to Website",
      shortlinkType: form.shortlinkType,
      timerSeconds: Number(form.timerSeconds),
      verificationMethod: form.verificationMethod,
      isActive: form.isActive,
    };

    try {
      const url = editingId
        ? `${BASE}/api/shortlinks/admin/${editingId}`
        : `${BASE}/api/shortlinks/admin`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Failed to save shortlink");

      showToast(editingId ? "Shortlink updated" : "Shortlink created");
      resetForm();
      load();
    } catch (err) {
      setError(err.message || "Failed to save shortlink");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      code: item.code || "",
      title: item.title || "",
      reward: String(item.reward || ""),
      startAfterHours: String(item.startAfterHours ?? 0),
      durationDays: String(item.durationDays ?? 1),
      expiryDateTime: item.scheduledEndAt ? new Date(item.scheduledEndAt).toISOString().slice(0, 16) : "",
      topImageUrl: item.topImageUrl || "",
      topText: item.topText || "",
      middleImageUrl: item.middleImageUrl || "",
      middleText: item.middleText || "",
      extraText: item.extraText || "",
      actionButtonLabel: item.actionButtonLabel || "Redirect to Website",
      shortlinkType: item.shortlinkType || "starter",
      timerSeconds: String(item.timerSeconds || 10),
      verificationMethod: item.verificationMethod || "checkbox",
      isActive: item.isActive !== false,
    });
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BASE}/api/shortlinks/admin/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Delete failed");
      showToast("Shortlink deleted");
      if (editingId === id) resetForm();
      load();
    } catch (err) {
      setError(err.message || "Delete failed");
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${BASE}/api/shortlinks/admin/${id}/toggle`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Toggle failed");
      showToast("Shortlink status updated");
      load();
    } catch (err) {
      setError(err.message || "Toggle failed");
    }
  };

  const selectedPreset = useMemo(
    () => PRESETS.find((item) => item.value === form.shortlinkType),
    [form.shortlinkType]
  );

  const previewUrl = form.middleImageUrl.trim();
  const canPreviewWebsite =
    previewUrl.startsWith("http://") || previewUrl.startsWith("https://");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      {toast && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
          {toast}
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-4">
          <h2 className="text-lg font-bold text-gray-800">
            {editingId ? "Edit Shortlink" : "Create Shortlink"}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Timer {"->"} unlock button {"->"} human verification {"->"} redirect button flow
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => applyPreset(preset.value)}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  form.shortlinkType === preset.value
                    ? "border-orange-400 bg-orange-50"
                    : "border-gray-200 bg-gray-50 hover:border-orange-200"
                }`}
              >
                <p className="text-sm font-bold text-gray-900">{preset.label}</p>
                <p className="mt-1 text-xs text-gray-500">Select this shortlink type</p>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Code</label>
              <input
                value={form.code}
                onChange={handleField("code")}
                placeholder="abc123"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Title</label>
              <input
                value={form.title}
                onChange={handleField("title")}
                placeholder="My Sponsor Link"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Reward</label>
              <input
                type="number"
                min="1"
                value={form.reward}
                onChange={handleField("reward")}
                placeholder="20"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Timer (seconds)</label>
              <input
                type="number"
                min="3"
                value={form.timerSeconds}
                onChange={handleField("timerSeconds")}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Start After (hours)</label>
              <input
                type="number"
                min="0"
                value={form.startAfterHours}
                onChange={handleField("startAfterHours")}
                className={inputCls}
              />
              <p className="mt-1 text-[11px] text-gray-400">Use 24 for "after 24 hours". Set 0 for immediate availability.</p>
            </div>
            {!form.expiryDateTime && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-600">Active For (days)</label>
                <input
                  type="number"
                  min="1"
                  value={form.durationDays}
                  onChange={handleField("durationDays")}
                  className={inputCls}
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Expiry Date & Time</label>
              <input
                type="datetime-local"
                value={form.expiryDateTime}
                onChange={handleField("expiryDateTime")}
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Human Verification</label>
              <select
                value={form.verificationMethod}
                onChange={handleField("verificationMethod")}
                className={inputCls}
              >
                <option value="checkbox">Checkbox</option>
                <option value="math">Math Question</option>
              </select>
            </div>
            <div className="flex items-end">
              <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={handleField("isActive")}
                  className="h-4 w-4 rounded border-gray-300"
                />
                Active
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Top Photo (Select File)</label>
              <input
                ref={topImageFileRef}
                type="file"
                accept="image/*"
                onChange={handleTopImageFile}
                className="hidden"
              />

              {form.topImageUrl ? (
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-2">
                  <img
                    src={form.topImageUrl}
                    alt="Top preview"
                    className="h-32 w-full rounded-lg object-cover"
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => topImageFileRef.current?.click()}
                      className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                    >
                      <Upload size={12} /> Change
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, topImageUrl: "" }))}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <X size={12} /> Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => topImageFileRef.current?.click()}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-6 text-sm font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-500"
                >
                  <Upload size={14} /> Select Top Photo
                </button>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Second Photo URL</label>
              <input
                value={form.middleImageUrl}
                onChange={handleField("middleImageUrl")}
                placeholder="https://example.com/second-image.jpg"
                className={inputCls}
              />
              {canPreviewWebsite && (
                <div className="mt-2 overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <div className="border-b border-gray-200 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Live Preview
                  </div>
                  <iframe
                    title="Second photo preview"
                    src={previewUrl}
                    className="h-64 w-full bg-white"
                    loading="lazy"
                  />
                  <div className="px-3 py-2 text-[11px] text-gray-400">
                    Some sites block iframe previews. If this stays blank, the link is still saved.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Text Box 1</label>
            <textarea
              value={form.topText}
              onChange={handleField("topText")}
              rows={2}
              placeholder="Write first text for users"
              className={inputCls}
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-600">Text Box 2</label>
            <textarea
              value={form.middleText}
              onChange={handleField("middleText")}
              rows={2}
              placeholder="Write second text for users"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Additional Text</label>
              <textarea
                value={form.extraText}
                onChange={handleField("extraText")}
                rows={2}
                placeholder="More instructions for users"
                className={inputCls}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-600">Button Label</label>
              <input
                value={form.actionButtonLabel}
                onChange={handleField("actionButtonLabel")}
                placeholder="Redirect to Website"
                className={inputCls}
              />
            </div>
          </div>

          {selectedPreset && (
            <p className="rounded-lg border border-orange-100 bg-orange-50 px-3 py-2 text-xs text-orange-700">
              Active preset: {selectedPreset.label}. This applies timer and verification defaults which you can still edit.
            </p>
          )}

          <div className="flex flex-col gap-2 sm:flex-row">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 sm:w-auto"
              >
                Cancel Edit
              </button>
            )}
            <button
              type="submit"
              disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white hover:bg-orange-600 disabled:opacity-60 sm:w-auto"
            >
              <Save size={14} />
              {saving ? "Saving..." : editingId ? "Update Shortlink" : "Create Shortlink"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Shortlinks</h2>
            <p className="text-xs text-gray-500 mt-1">Manage existing shortlinks and presets</p>
          </div>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:border-orange-300 hover:text-orange-500"
          >
            <RefreshCw size={12} /> Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Code</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Flow</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Reward</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(6)].map((__, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 animate-pulse rounded bg-gray-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : links.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">
                    No shortlinks yet.
                  </td>
                </tr>
              ) : (
                links.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">{item.code}</p>
                      <p className="text-xs text-gray-500">{item.title}</p>
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-700">{item.shortlinkType || "starter"}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">
                      {item.timerSeconds || 10}s {"->"} {item.verificationMethod || "checkbox"}
                    </td>
                    <td className="px-4 py-3 font-bold text-orange-600">{item.reward} TKN</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          item.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(item)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white"
                          title="Edit"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggle(item._id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-yellow-50 text-yellow-600 hover:bg-yellow-500 hover:text-white"
                          title="Toggle"
                        >
                          <Power size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item._id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-400 hover:bg-red-500 hover:text-white"
                          title="Delete"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminShortLinksManager;
