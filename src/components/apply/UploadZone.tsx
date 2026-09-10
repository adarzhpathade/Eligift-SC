"use client";

import React, { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useNativeHaptics } from '@/hooks/useNativeHaptics';

export type UploadZoneProps = {
  onUploadSuccess?: (file: { name: string; path: string; size: number }) => void;
  onUploadError?: (error: string) => void;
};

export function UploadZone({ onUploadSuccess, onUploadError }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { triggerSuccess, triggerError } = useNativeHaptics();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      return 'Invalid file type. Please upload a PDF, JPG, or PNG.';
    }
    if (file.size > 5 * 1024 * 1024) {
      return 'File size exceeds 5MB limit.';
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const errorMsg = validateFile(file);
    if (errorMsg) {
      onUploadError?.(errorMsg);
      triggerError();
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("Authentication required");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (error) {
        throw error;
      }

      onUploadSuccess?.({
        name: file.name,
        path: data.path,
        size: file.size,
      });
      triggerSuccess();

    } catch (err: unknown) {
      console.error("Upload error:", err);
      onUploadError?.((err as Error).message || "Failed to upload document.");
      triggerError();
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await uploadFile(files[0]);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-[20px] p-8 flex flex-col items-center justify-center text-center bg-background transition-all duration-300 cursor-pointer group ${
        isDragging ? 'border-foreground bg-muted/50' : 'border-border/50 hover:bg-muted/30 hover:border-foreground'
      } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileSelect}
        accept=".pdf,.jpg,.jpeg,.png"
      />
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <span className={`material-symbols-outlined text-[32px] text-foreground ${isUploading ? 'animate-[spin_2s_linear_infinite]' : ''}`}>
          {isUploading ? 'sync' : 'cloud_upload'}
        </span>
      </div>
      <h3 className="text-[24px] font-semibold text-foreground mb-2">
        {isUploading ? 'Uploading...' : 'Drag & Drop Documents'}
      </h3>
      <p className="text-[16px] text-muted-foreground mb-6 max-w-sm">
        {isUploading 
          ? 'Please wait while we securely upload your document.' 
          : 'Upload your missing certificates or drag them here. Supports PDF, JPG, PNG up to 5MB.'}
      </p>
      <button 
        className="bg-card text-foreground border border-foreground px-6 py-3 rounded-full text-[14px] font-semibold hover:bg-muted transition-colors shadow-sm"
        disabled={isUploading}
      >
        Browse Files
      </button>
    </div>
  )
}
