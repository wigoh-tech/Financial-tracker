'use client';

import { useState } from 'react';

export default function DownloadCSVButton({ month }: { month: string }) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/export.csv?month=${month}`);

      if (!res.ok) throw new Error('Failed to download');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${month}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      disabled={loading}
    >
      {loading ? 'Downloading...' : `Download CSV for ${month}`}
    </button>
  );
}
