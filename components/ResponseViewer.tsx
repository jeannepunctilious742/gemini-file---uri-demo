
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Code, FileJson, Loader2, AlertCircle, ExternalLink, Clipboard, Check } from 'lucide-react';

interface ResponseViewerProps {
  loading: boolean;
  response: string | null;
  requestJson: any | null;
  error: string | null;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ loading, response, requestJson, error }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'json'>('preview');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!loading && !response && !requestJson && !error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-300 animate-in fade-in zoom-in duration-700">
        <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-100 flex items-center justify-center mb-6">
          <Code size={40} className="text-slate-200" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-semibold tracking-wide uppercase opacity-60">Waiting for analysis</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-w-0 bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden animate-in slide-in-from-right-4 duration-500">
      {/* Dynamic Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
        <div className="flex gap-1 p-1 bg-slate-200/50 rounded-xl">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 text-xs font-bold tracking-wider rounded-lg transition-all ${
              activeTab === 'preview' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Response
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`px-4 py-1.5 text-xs font-bold tracking-wider rounded-lg transition-all ${
              activeTab === 'json' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Request JSON
          </button>
        </div>

        {activeTab === 'preview' && response && !loading && (
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Clipboard size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 selection:bg-brand-50 selection:text-brand-900 min-h-0">
        {activeTab === 'preview' && (
          <div className="h-full">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-brand-600 space-y-4 animate-pulse">
                <Loader2 size={40} className="animate-spin text-brand-500" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-bold tracking-tight">Generating response...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50/50 text-red-700 p-6 rounded-2xl border border-red-100 flex items-start gap-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="shrink-0" size={20} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm mb-1 uppercase tracking-wider">Analysis Failed</h3>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap opacity-90">{error}</p>
                </div>
              </div>
            ) : response ? (
              <div className="prose prose-slate prose-brand max-w-none">
                <ReactMarkdown>{response}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 italic">
                <span>Response empty</span>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'json' && (
          <div className="h-full flex flex-col gap-4 min-h-0">
             <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
                <div className="flex items-center gap-2 text-[9px] font-bold text-slate-500 tracking-widest">
                   Structure matches the Content object API definition.
                </div>
                <a 
                  href="https://ai.google.dev/api/caching#Content" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-bold text-brand-600 hover:underline flex items-center gap-1"
                >
                  API Docs <ExternalLink size={12} />
                </a>
             </div>
            <pre className="text-xs font-mono bg-slate-900 text-slate-300 p-6 rounded-2xl overflow-auto flex-1 shadow-inner leading-relaxed min-h-0 max-w-full">
              {requestJson ? JSON.stringify(requestJson, null, 2) : '// No request payload captured'}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
