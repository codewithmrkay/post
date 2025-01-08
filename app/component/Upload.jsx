'use client'

import { Loader } from 'lucide-react';
import { useState } from 'react';
export default function Upload({ onUploadComplete }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [saving, isSaving] = useState(false);
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setFileType(file.type.split('/')[0]); // 'image' or 'video'
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      setFileType(null);
    }
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    isSaving(true);
    e.preventDefault();
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch('/api/upload',{
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      isSaving(false);
      alert('Upload successful , See in MyPost..!');
      setFile(null);
      onUploadComplete();
    }
  };

  return (
    // <div className="max-w-md mx-auto mt-8 p-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-2xl">
    //   <h2>Upload Media</h2>
    //   <form onSubmit={handleSubmit}>
    //     <input type="file" onChange={handleFileChange} accept="image/*,video/*" />
    //     <button 
    //       type="submit" 
    //       className="w-full px-4 py-3 text-white font-semibold bg-purple-600 rounded-md shadow-md hover:bg-purple-700 ease-in-out transform"
    //     >
    //       Upload
    //     </button>
    //   </form>
      
    // </div>
    <div>
      <div className="max-w-md mx-auto p-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Upload Media</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative group">
          <input 
            type="file" 
            className="hidden" 
            id="file-upload" 
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
          <label 
            htmlFor="file-upload" 
            className="flex flex-col items-center justify-center w-full h-64 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-purple-400 focus:outline-none overflow-hidden"
          >
            {preview ? (
              fileType === 'image' ? (
                <img src={preview} alt="Preview" className="h-full object-contain" />
              ) : fileType === 'video' ? (
                <video src={preview} className="h-full" controls>
                  Your browser does not support the video tag.
                </video>
              ) : null
            ) : (
              <>
                <span className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span className="font-medium text-gray-600">
                    Drop files to Attach, or
                    <span className="text-purple-600 underline ml-1">browse</span>
                  </span>
                </span>
                <p className="mt-2 text-xs text-gray-500">Support for image and video upload. Strictly prohibit from uploading company data or other sensitive files.</p>
              </>
            )}
          </label>
        </div>
        {preview && (
          <button 
            type="button"
            onClick={() => { setPreview(null); setFileType(null); }}
            className="w-full px-4 py-2 text-purple-600 font-semibold bg-white rounded-md shadow-md hover:bg-gray-100"
          >
            Remove {fileType}
          </button>
        )}
        <button 
          type="submit" 
          className="w-full justify-center flex items-center gap-3 px-4 py-3 text-white font-semibold bg-purple-600 rounded-md shadow-md hover:bg-purple-700"
        >
         {saving ? (
          <>
            <Loader className="animate-spin" />
            Uploading...
          </>
        ) :
          'Upload'}
        </button>
      </form>
    </div>
    </div>
  );
}

