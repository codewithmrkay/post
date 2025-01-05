'use client'

import { useState } from 'react';

export default function Upload({ onUploadComplete }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      setFile(null);
      onUploadComplete();
    }
  };

  return (
    <div>
      <h2>Upload Media</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*,video/*" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}

