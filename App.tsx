
import React, { useState, useCallback, useRef } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Settings2, 
  Layout, 
  Layers, 
  Upload, 
  Loader2, 
  History,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Share2,
  Download,
  Info
} from 'lucide-react';
import { 
  ArtisticStyle, 
  AspectRatio, 
  ImageQuality, 
  GenerationSettings, 
  GeneratedImage 
} from './types';
import { 
  ARTISTIC_STYLES, 
  ASPECT_RATIOS, 
  IMAGE_QUALITIES 
} from './constants';
import { generateImage } from './services/gemini';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'preview' | 'history'>('create');
  const [settings, setSettings] = useState<GenerationSettings>({
    style: 'Hyperrealistic Game',
    lighting: 8,
    complexity: 9,
    aspectRatio: '9:16',
    quality: 'Standard',
    prompt: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [lastGenerated, setLastGenerated] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!settings.prompt.trim() && !settings.sourceImage) {
      setError("Please enter a prompt or upload an image.");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setActiveTab('preview');

    try {
      const url = await generateImage(settings);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt: settings.prompt,
        settings: { ...settings },
        timestamp: Date.now(),
      };
      setLastGenerated(newImage);
      setHistory(prev => [newImage, ...prev]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong during generation.");
      setActiveTab('create');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, sourceImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearSourceImage = () => {
    setSettings(prev => ({ ...prev, sourceImage: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0c] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 px-6 py-4 bg-[#0a0a0c]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00f3ff] to-[#ff00ff] flex items-center justify-center neon-glow-cyan">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white">P2L STUDIO</h1>
            <p className="text-[10px] text-[#00f3ff] font-medium tracking-widest uppercase opacity-80">Memory over marketing</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {error && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-full">
              <Info className="w-3 h-3" />
              {error}
            </div>
          )}
          <button 
            onClick={() => setActiveTab('history')}
            className={`p-2 rounded-full transition-colors ${activeTab === 'history' ? 'bg-white/10 text-[#ff00ff]' : 'hover:bg-white/5'}`}
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {activeTab === 'create' && (
          <div className="max-w-2xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            {/* Style Selector */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white/60">
                <Layers className="w-4 h-4" />
                ARTISTIC STYLE
              </div>
              <div className="flex flex-wrap gap-2">
                {ARTISTIC_STYLES.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSettings(prev => ({ ...prev, style }))}
                    className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300 ${
                      settings.style === style 
                        ? 'bg-[#00f3ff]/10 border-[#00f3ff] text-[#00f3ff] neon-glow-cyan' 
                        : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </section>

            {/* Prompt Input */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/60">
                  <Sparkles className="w-4 h-4" />
                  PROMPT ENGINE
                </div>
                {settings.sourceImage && (
                  <button 
                    onClick={clearSourceImage}
                    className="flex items-center gap-1 text-[10px] text-red-400 font-bold uppercase tracking-tighter"
                  >
                    <X className="w-3 h-3" /> Clear Image
                  </button>
                )}
              </div>
              <div className="relative group">
                <textarea
                  value={settings.prompt}
                  onChange={(e) => setSettings(prev => ({ ...prev, prompt: e.target.value }))}
                  placeholder="Describe your vision... (e.g., A futuristic Rickshaw flying through a neon Dhaka night)"
                  className="w-full h-32 px-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:border-[#00f3ff]/50 transition-colors resize-none placeholder:text-white/20"
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <Upload className={`w-4 h-4 ${settings.sourceImage ? 'text-[#00f3ff]' : 'text-white'}`} />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>
              {settings.sourceImage && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10 group">
                  <img src={settings.sourceImage} alt="Source" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
            </section>

            {/* Sliders */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-white/60">
                  <span>Cinematic Lighting</span>
                  <span className="text-[#ff00ff]">{settings.lighting}/10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={settings.lighting}
                  onChange={(e) => setSettings(prev => ({ ...prev, lighting: parseInt(e.target.value) }))}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#ff00ff]"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-white/60">
                  <span>Detail Complexity</span>
                  <span className="text-[#00f3ff]">{settings.complexity}/10</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={settings.complexity}
                  onChange={(e) => setSettings(prev => ({ ...prev, complexity: parseInt(e.target.value) }))}
                  className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#00f3ff]"
                />
              </div>
            </section>

            {/* Options Row */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/60">
                  <Layout className="w-4 h-4" />
                  ASPECT RATIO
                </div>
                <div className="flex gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setSettings(prev => ({ ...prev, aspectRatio: ratio }))}
                      className={`flex-1 py-2 text-xs font-medium border rounded-xl transition-all ${
                        settings.aspectRatio === ratio 
                          ? 'bg-white/10 border-white text-white' 
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white/60">
                  <Settings2 className="w-4 h-4" />
                  QUALITY
                </div>
                <div className="flex gap-2">
                  {IMAGE_QUALITIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => setSettings(prev => ({ ...prev, quality: q }))}
                      className={`flex-1 py-2 text-xs font-medium border rounded-xl transition-all ${
                        settings.quality === q 
                          ? 'bg-[#ff00ff]/10 border-[#ff00ff] text-[#ff00ff] neon-glow-magenta' 
                          : 'bg-white/5 border-white/10 text-white/40'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="max-w-xl mx-auto p-6 flex flex-col items-center gap-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className={`relative w-full overflow-hidden rounded-3xl bg-white/5 border border-white/10 shadow-2xl ${
              isGenerating ? 'animate-pulse' : ''
            }`} style={{ aspectRatio: settings.aspectRatio.replace(':', '/') }}>
              {isGenerating ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                     <Loader2 className="w-12 h-12 text-[#00f3ff] animate-spin" />
                     <Sparkles className="absolute top-0 right-0 w-4 h-4 text-[#ff00ff] animate-bounce" />
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-bold tracking-widest text-[#00f3ff]">WEAVING PIXELS...</p>
                    <p className="text-[10px] text-white/40 uppercase font-medium">Your digital future is loading</p>
                  </div>
                </div>
              ) : lastGenerated ? (
                <img src={lastGenerated.url} alt="Generated" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/20 gap-4">
                  <ImageIcon className="w-16 h-16" />
                  <p className="text-sm">Ready to visualize</p>
                </div>
              )}
            </div>

            {!isGenerating && lastGenerated && (
              <div className="w-full space-y-6 animate-in fade-in duration-700 delay-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold">Visualization Complete</h3>
                    <p className="text-xs text-white/40">{lastGenerated.settings.style} • {lastGenerated.settings.quality}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = lastGenerated.url;
                        link.download = `p2l-studio-${Date.now()}.png`;
                        link.click();
                      }}
                      className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    <Sparkles className="w-3 h-3" />
                    Master Prompt
                  </div>
                  <p className="text-xs text-white/80 italic">"{lastGenerated.prompt}"</p>
                </div>

                <button 
                  onClick={() => setActiveTab('create')}
                  className="w-full py-4 bg-white text-black font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-white/90 transition-all active:scale-[0.98]"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Create Another
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold">Studio Archives</h2>
                <p className="text-xs text-white/40">Past generations and creative iterations</p>
              </div>
              <button 
                onClick={() => setHistory([])}
                className="text-[10px] font-bold text-red-400 uppercase tracking-widest"
              >
                Wipe History
              </button>
            </div>

            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-white/20 gap-4">
                <History className="w-16 h-16" />
                <p className="text-sm italic">The gallery is waiting for your first spark of genius.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {history.map((img) => (
                  <div 
                    key={img.id}
                    onClick={() => {
                      setLastGenerated(img);
                      setSettings(img.settings);
                      setActiveTab('preview');
                    }}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-pointer"
                  >
                    <img src={img.url} alt="History" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <p className="text-[10px] font-bold text-[#00f3ff] truncate">{img.settings.style}</p>
                      <p className="text-[8px] text-white/60 truncate italic">"{img.prompt}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistent CTA / Navigation */}
      {activeTab === 'create' && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/90 to-transparent">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || (!settings.prompt.trim() && !settings.sourceImage)}
            className="w-full max-w-2xl mx-auto py-4 bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] rounded-2xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Synthesizing...
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6" />
                Render Digital Future
                <ChevronRight className="w-6 h-6" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Tab Navigation for Mobile - Updated comparison logic to avoid TypeScript narrowing issues */}
      {(activeTab === 'preview' || activeTab === 'history') && (
        <nav className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-[#0a0a0c]/80 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-8">
           <button 
            onClick={() => setActiveTab('create')}
            className="flex flex-col items-center gap-1 transition-colors text-white/40"
           >
             <Sparkles className="w-6 h-6" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Create</span>
           </button>
           <button 
            onClick={() => setActiveTab('preview')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'preview' ? 'text-[#ff00ff]' : 'text-white/40'}`}
           >
             <ImageIcon className="w-6 h-6" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Preview</span>
           </button>
           <button 
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'history' ? 'text-[#00f3ff]' : 'text-white/40'}`}
           >
             <History className="w-6 h-6" />
             <span className="text-[10px] font-bold uppercase tracking-widest">Archives</span>
           </button>
        </nav>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="fixed top-20 left-6 right-6 z-[60] p-4 bg-red-500/90 backdrop-blur-lg border border-red-400 rounded-2xl text-white shadow-2xl flex items-center justify-between animate-in slide-in-from-top-4">
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
