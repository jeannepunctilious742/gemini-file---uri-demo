
import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Send, Sparkles, Plus, Link as LinkIcon, Upload, Trash2, FileText, AlertCircle, Loader2, FilePlus, MessageSquare, Zap, Info, ExternalLink } from 'lucide-react';
import { UrlList, InputItem } from './components/UrlList';
import { ResponseViewer } from './components/ResponseViewer';

export default function App() {
  const [items, setItems] = useState<InputItem[]>([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [requestJson, setRequestJson] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSend = async () => {
    if (!prompt.trim() && items.length === 0) return;
    
    setLoading(true);
    setError(null);
    setResponse(null);
    setRequestJson(null);

    try {
      const parts: any[] = [];
      const jsonPreviewParts: any[] = [];

      for (const entry of items) {
        if (entry.type === 'url') {
          if (entry.url.trim()) {
            const part = {
              fileData: {
                fileUri: entry.url.trim(),
                mimeType: entry.mimeType,
              },
            };
            parts.push(part);
            jsonPreviewParts.push(part);
          }
        } else if (entry.type === 'file') {
          const base64Data = await fileToBase64(entry.file);
          const part = {
            inlineData: {
              data: base64Data,
              mimeType: entry.mimeType,
            },
          };
          parts.push(part);
          jsonPreviewParts.push({
            inlineData: {
              data: `<base64_string_length_${base64Data.length}_truncated_for_preview>`,
              mimeType: entry.mimeType,
            }
          });
        }
      }

      if (prompt.trim()) {
        const textPart = { text: prompt.trim() };
        parts.push(textPart);
        jsonPreviewParts.push(textPart);
      }

      const displayContents = { parts: jsonPreviewParts };
      setRequestJson(displayContents); 

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts },
      });

      setResponse(result.text || 'No text content returned.');
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const hasResult = response || loading || error;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-brand-100 selection:text-brand-900 overflow-x-hidden">
      {/* Dynamic Header */}
      <header className={`transition-all duration-500 flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10 ${hasResult ? 'shadow-sm' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-2 rounded-xl text-white shadow-lg shadow-brand-200">
            <Sparkles size={20} fill="currentColor" className="opacity-90" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">Gemini File & URI Demo</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">ANALYZE FILES</p>
          </div>
        </div>
        
        {hasResult && (
          <button 
            onClick={() => { setResponse(null); setPrompt(''); setItems([]); setRequestJson(null); setError(null); }}
            className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            New Session
          </button>
        )}
      </header>

      <main className={`p-4 md:p-8 transition-all duration-700 ease-in-out ${hasResult ? 'max-w-full' : 'max-w-4xl mx-auto pt-16 md:pt-24'}`}>
        <div className={`grid gap-8 transition-all duration-500 ${hasResult ? 'lg:grid-cols-[450px_1fr]' : 'grid-cols-1'} min-w-0`}>
          
          <section className="space-y-6 min-w-0">
            {/* Instructions box */}
            {!hasResult && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                  {/* Visual connector for desktop */}
                  <div className="hidden md:block absolute top-[22px] left-[25%] right-[25%] h-[1px] bg-slate-200/50" />
                  
                  {[
                    { 
                      step: 1, 
                      title: 'ADD FILES OR URIS', 
                      desc: 'Upload documents or provide public links for Gemini to read.',
                      icon: FilePlus,
                      color: 'bg-blue-50 text-blue-600'
                    },
                    { 
                      step: 2, 
                      title: 'PROMPT GEMINI', 
                      desc: 'Describe the task or question you want to apply to your context.',
                      icon: MessageSquare,
                      color: 'bg-purple-50 text-purple-600'
                    }
                  ].map((s, i) => (
                    <div key={i} className="relative z-10 flex flex-col items-center text-center space-y-4 group">
                      <div className={`w-12 h-12 rounded-2xl ${s.color} border border-white shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}>
                        <s.icon size={22} />
                      </div>
                      <div className="space-y-1.5 px-4">
                        <h3 className="text-xs font-black text-slate-800 tracking-wider">STEP {s.step}: {s.title}</h3>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed max-w-[200px]">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Panel */}
            <div className={`bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden transition-all duration-500 ${!hasResult ? 'ring-8 ring-slate-100/50' : ''}`}>
              
              {/* File area first */}
              <div className="px-6 pt-6 pb-2">
                <UrlList items={items} setItems={setItems} unified />
              </div>

              {/* Prompt area second */}
              <div className="p-1">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to do with the attached files..."
                  className="w-full min-h-[120px] p-6 text-lg bg-transparent border-none focus:ring-0 outline-none resize-none placeholder:text-slate-300 transition-all"
                />
              </div>

              {/* Action Area */}
              <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={handleSend}
                  disabled={loading || (!prompt.trim() && items.length === 0)}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold text-white transition-all shadow-md
                    ${loading || (!prompt.trim() && items.length === 0)
                      ? 'bg-slate-300 cursor-not-allowed' 
                      : 'bg-brand-600 hover:bg-brand-700 active:scale-[0.98] hover:shadow-brand-200'
                    }`}
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <>
                      <span className="hidden sm:inline">Generate Content</span>
                      <Send size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          </section>

          {/* Response Panel */}
          {(hasResult) && (
            <section className="h-full min-h-[500px] min-w-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ResponseViewer 
                loading={loading} 
                response={response} 
                requestJson={requestJson}
                error={error} 
              />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
