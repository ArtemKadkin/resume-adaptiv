import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function App() {
  const [resumeText, setResumeText] = useState('');
  const [job, setJob] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobInputType, setJobInputType] = useState('text');
  const [file, setFile] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [analysis, setAnalysis] = useState('');
  const [originalExtracted, setOriginalExtracted] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('analyze');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) { document.documentElement.classList.add('dark'); } 
    else { document.documentElement.classList.remove('dark'); }
  }, [darkMode]);

  const handleFileChange = (e) => { setFile(e.target.files[0]); setResumeText(''); };
  const handlePhotoChange = (e) => {
    const selectedFile = e.target.files[0];
    setPhoto(selectedFile);
    if (selectedFile) setPhotoPreview(URL.createObjectURL(selectedFile));
  };
  const handleTextChange = (e) => { setResumeText(e.target.value); setFile(null); };

  const handleAction = async () => {
    if (!job && !jobUrl) { alert("Укажите вакансию!"); return; }
    if (!resumeText && !file) { alert("Добавьте резюме!"); return; }

    setLoading(true);
    setAnalysis('');
    setOriginalExtracted('');

    const formData = new FormData();
    if (jobInputType === 'url' && jobUrl) {
      try {
        const scrapeRes = await fetch('http://127.0.0.1:8000/scrape', {
          method: 'POST',
          body: new URLSearchParams({ 'url': jobUrl })
        });
        const scrapeData = await scrapeRes.json();
        if (scrapeData.status === 'success') {
          formData.append('job_description', scrapeData.scraped_text);
        } else {
          throw new Error(scrapeData.detail || "Ошибка парсинга");
        }
      } catch (e) {
        setAnalysis("Ошибка ссылки: " + e.message);
        setLoading(false);
        return;
      }
    } else {
      formData.append('job_description', job);
    }

    if (file) formData.append('file', file);
    else formData.append('resume_//text', resumeText); // ИСПРАВЛЕНО:
    // formData.append('resume_text', resumeText); // (В коде ниже исправлено)
    if (!file) formData.append('resume_text', resumeText);

    const endpoint = mode === 'analyze' ? '/analyze' : mode === 'rewrite' ? '/rewrite' : '/cover-letter';

    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.status === 'success') {
        setAnalysis(data.analysis);
        if (data.original_text) setOriginalExtracted(data.original_text); // ИСПРАВЛЕНО:
        if (data.original_text) setOriginalExtracted(data.original_text);
      } else {
        setAnalysis("Ошибка сервера: " + (data.detail || "Неизвестная ошибка"));
      }
    } catch (error) {
      setAnalysis("Критический сбой связи с сервером. Проверьте консоль.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!analysis) return;
    const formData = new FormData();
    formData.append('resume_content', analysis);
    if (photo) formData.append('photo', photo);
    try {
      const response = await fetch('http://127.0.0.1:8000/export-docx', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = mode === 'rewrite' ? 'resume_2026.docx' : 'cover_letter.docx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (error) {
      alert("Ошибка скачивания.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis);
    alert("Скопировано!");
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} py-12 px-4 sm:px-6`}>
      <div className="fixed top-6 right-6 z-50">
        <button onClick={() => setDarkMode(!darkMode)} className="p-3 rounded-full bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-black mb-4 tracking-tight">Resume<span className="text-blue-600">Adaptiv</span></h1>
          <p className={`text-xl font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>AI-Powered Career Optimization <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm ml-2 font-bold">Standard 2026</span></p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4 space-y-6">
            <div className={`p-8 rounded-3xl shadow-2xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">1. Ваше резюме</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center overflow-hidden relative">
                  {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <span className="text-xl text-slate-400">+</span>}
                  <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <div className="text-xs text-slate-500">Добавьте фото для Word</div>
              </div>
              <input type="file" onChange={handleFileChange} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer mb-4" />
              <textarea className={`w-full h-40 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'} border`} placeholder="Или вставьте текст резюме..." value={resumeText} onChange={handleTextChange}></textarea>
            </div>

            <div className={`p-8 rounded-3xl shadow-2xl border transition-all ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">2. Вакансия</h3>
              <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
                <button onClick={() => setJobInputType('text')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${jobInputType === 'text' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Текст</button>
                <button onClick={() => setJobInputType('url')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${jobInputType === 'url' ? 'bg-white dark:bg-slate-700 shadow text-blue-600 dark:text-blue-400' : 'text-slate-500'}`}>Ссылка</button>
              </div>
              {jobInputType === 'text' ? (
                <textarea className={`w-full h-40 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'} border`} placeholder="Вставьте описание вакансии..." value={job} onChange={(e) => setJob(e.target.value)}></textarea>
              ) : (
                <input type="text" className={`w-full h-12 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'} border`} placeholder="Вставьте URL вакансии..." value={jobUrl} onChange={(e) => setJobUrl(e.target.value)} />
              )}
            </div>

            <div className="bg-slate-900 p-2 rounded-2xl flex shadow-lg">
              <button onClick={() => {setMode('analyze'); setAnalysis('');}} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'analyze' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>🔍 Анализ</button>
              <button onClick={() => {setMode('rewrite'); setAnalysis('');}} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'rewrite' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>✍️ Рерайт</button>
              <button onClick={() => {setMode('cover'); setAnalysis('');}} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${mode === 'cover' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}>✉️ Письмо</button>
            </div>

            <button onClick={handleAction} disabled={loading} className={`w-full py-5 rounded-2xl font-black text-white text-xl shadow-2xl transition-all transform active:scale-95 ${loading ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-200'}`}>
              {loading ? 'Обработка...' : mode === 'analyze' ? 'Провести аудит' : mode === 'rewrite' ? 'Создать резюме' : 'Написать письмо'}
            </button>
          </div>

          <div className="lg:col-span-8">
            <div className={`rounded-3xl shadow-2xl border transition-all min-h-[650px] flex flex-col ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className={`p-6 border-b flex justify-between items-center ${darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <h2 className="text-xl font-bold">{mode === 'analyze' ? 'Отчет эксперта' : mode === 'rewrite' ? 'Профессиональный рерайт' : 'Сопроводительное письмо'}</h2>
                <div className="flex gap-2">
                  {analysis && (
                    <>
                      <button onClick={copyToClipboard} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}>📋 Копировать</button>
                      {(mode === 'rewrite' || mode === 'cover') && (
                        <button onClick={handleDownload} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20">📥 Скачать Word</button>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="p-8 flex-grow">
                {loading ? (
                  <div className="flex flex-col justify-center items-center h-80 space-y-6">
                    <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <p className={`font-medium animate-pulse ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Gemma 4 создает шедевр...</p>
                  </div>
                ) : analysis ? (
                  mode === 'rewrite' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Оригинал</h4>
                        <div className={`p-4 rounded-2xl border text-sm whitespace-pre-wrap h-[500px] overflow-y-auto ${darkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'}`}>
                          {originalExtracted || resumeText || "Текст не получен"}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest">Адаптированный вариант (AI)</h4>
                        <div className={`p-4 rounded-2xl border text-sm h-[500px] overflow-y-auto prose prose-sm max-w-none ${darkMode ? 'bg-slate-800/50 border-blue-900/30 text-slate-300' : 'bg-blue-50/30 border-blue-100 text-slate-700'}`}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={`prose max-w-none ${darkMode ? 'prose-invert text-slate-300' : 'prose-blue text-slate-700'}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{analysis}</ReactMarkdown>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col justify-center items-center h-80 text-slate-400 text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                    <p className="text-lg">Готов к работе. Введите данные слева.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
