
import React, { useRef, useState } from 'react';
import { Plus, Trash2, Link as LinkIcon, ExternalLink, Info, Upload, File as FileIcon, ChevronDown, MousePointer2 } from 'lucide-react';
import { getMimeTypeFromUrl } from '../utils/mimeTypes';

export type InputItem = 
  | { id: string; type: 'url'; url: string; mimeType: string }
  | { id: string; type: 'file'; file: File; mimeType: string };

interface UrlListProps {
  items: InputItem[];
  setItems: React.Dispatch<React.SetStateAction<InputItem[]>>;
  unified?: boolean;
}

const MAX_SIZE_PDF = 50 * 1024 * 1024;
const MAX_SIZE_GENERAL = 100 * 1024 * 1024;

const EXAMPLES = [
  { 
    name: 'med_gemini.pdf', 
    url: 'https://storage.googleapis.com/generativeai-downloads/data/med_gemini.pdf' 
  },
  { 
    name: 'Japanese_Bento.png', 
    url: 'https://storage.googleapis.com/generativeai-downloads/images/Japanese_Bento.png' 
  }
];

export const UrlList: React.FC<UrlListProps> = ({ items, setItems, unified }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showExamples, setShowExamples] = useState(false);

  const addUrl = (customUrl?: string) => {
    const urlToAdd = customUrl || '';
    setItems([...items, { 
      id: crypto.randomUUID(), 
      type: 'url', 
      url: urlToAdd, 
      mimeType: getMimeTypeFromUrl(urlToAdd) 
    }]);
    setShowExamples(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const limit = file.type === 'application/pdf' ? MAX_SIZE_PDF : MAX_SIZE_GENERAL;
    if (file.size > limit) {
      alert(`File too large. Limit is ${limit / (1024 * 1024)}MB.`);
      e.target.value = '';
      return;
    }

    setItems([...items, { 
      id: crypto.randomUUID(), 
      type: 'file', 
      file: file, 
      mimeType: file.type || 'application/octet-stream' 
    }]);

    e.target.value = '';
  };

  const removeUrl = (id: string) => {
    setItems(items.filter((u) => u.id !== id));
  };

  const updateUrl = (id: string, field: keyof Extract<InputItem, { type: 'url' }>, value: string) => {
    setItems(items.map((u) => {
      if (u.id !== id || u.type !== 'url') return u;
      const updated = { ...u, [field]: value };
      if (field === 'url') {
        updated.mimeType = getMimeTypeFromUrl(value);
      }
      return updated;
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => addUrl()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-700 text-xs font-semibold border border-slate-100 transition-all active:scale-95"
          >
            <LinkIcon size={14} />
            <span>Add URI</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-700 text-xs font-semibold border border-slate-100 transition-all active:scale-95"
          >
            <Upload size={14} />
            <span>Upload File</span>
          </button>
        </div>
        
        {/* Select Example Feature moved to right side */}
        <div className="relative ml-auto">
          <button
            onClick={() => setShowExamples(!showExamples)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-95 ${
              showExamples 
                ? 'bg-brand-500 text-white border-brand-600' 
                : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <MousePointer2 size={14} />
            <span>Select Example:</span>
            <ChevronDown size={14} className={`transition-transform duration-200 ${showExamples ? 'rotate-180' : ''}`} />
          </button>
          
          {showExamples && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-1.5 space-y-1">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.name}
                    onClick={() => addUrl(ex.url)}
                    className="w-full text-left px-3 py-2 text-[11px] font-bold text-slate-600 hover:bg-brand-50 hover:text-brand-700 rounded-xl transition-colors flex items-center justify-between group"
                  >
                    <span className="truncate mr-2">{ex.name}</span>
                    <Plus size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileUpload}
        />
      </div>

      <div className="flex items-start gap-3 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
        <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
          <Info size={14} className="text-blue-500" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="space-y-1 text-[11px] text-slate-600 leading-snug">
            <p>
              <strong className="text-slate-800">Local Files:</strong> Max 100MB (50MB for PDFs). Uploaded directly.
            </p>
            <p>
              <strong className="text-slate-800">URIs:</strong> Public URLs or Signed URLs (AWS S3, Azure Blob).
            </p>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a 
              href="https://docs.aws.amazon.com/AmazonS3/latest/userguide/ShareObjectPreSignedURL.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
            >
              AWS S3 Docs <ExternalLink size={10} />
            </a>
            <a 
              href="https://learn.microsoft.com/en-us/azure/storage/common/storage-sas-overview"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors"
            >
              Azure SAS Docs <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>

      {items.length > 0 && (
        <div className="max-h-[400px] overflow-y-auto pr-2 -mr-2 scrollbar-thin">
          <div className="grid grid-cols-1 gap-4">
            {items.map((entry) => (
              <div 
                key={entry.id} 
                className="group flex flex-col gap-2 bg-white p-4 rounded-2xl border border-slate-100 hover:border-brand-200 transition-all hover:shadow-sm"
              >
                {entry.type === 'url' ? (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand-600 transition-colors shrink-0">
                       <LinkIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <input
                        type="text"
                        value={entry.url}
                        onChange={(e) => updateUrl(entry.id, 'url', e.target.value)}
                        placeholder="https://example.com/file.pdf"
                        className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-300 font-semibold text-slate-700"
                      />
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="shrink-0 text-[10px] text-slate-400 font-black uppercase tracking-widest">Mime Type</span>
                        <input 
                           type="text"
                           value={entry.mimeType}
                           onChange={(e) => updateUrl(entry.id, 'mimeType', e.target.value)}
                           className="flex-1 text-[10px] bg-slate-50 rounded px-2 py-1 text-slate-500 border border-slate-100 focus:border-brand-300 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => removeUrl(entry.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2 shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600 shrink-0">
                      <FileIcon size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 truncate">{entry.file.name}</p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-0.5">
                        {entry.mimeType} • {(entry.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => removeUrl(entry.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-2 shrink-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {items.length === 0 && !unified && (
        <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
          <p className="text-xs text-slate-400 font-medium">No attachments added</p>
        </div>
      )}
    </div>
  );
};
