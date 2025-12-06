// HOW IT WORKS:
// This component provides a file upload interface for project files
// It handles file selection, preview, and upload to the backend

import React, { useState } from 'react';

const FileUploader = ({ onUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Reset error when selecting a new file
      setError('');
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      // Use the correct API base URL
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002';
      
      const response = await fetch(`${API_BASE_URL}/api/uploads`, {
        method: 'POST',
        body: formData
      });
      
      // Check if response is OK
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      
      onUpload(data);
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Upload error:', error);
      setError(`Upload failed: ${error.message}`);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="card p-4">
      <h3 className="font-semibold mb-3">Upload Files</h3>
      
      {error && (
        <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-3">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>
      
      {preview && (
        <div className="mb-3">
          <img src={preview} alt="Preview" className="max-h-40 rounded" />
        </div>
      )}
      
      {selectedFile && (
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <div className="font-medium">{selectedFile.name}</div>
            <div className="text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          </div>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="btn-primary"
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;