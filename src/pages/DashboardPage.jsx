import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Info,
  X,
  Layers,
  LogOut,
  UserCheck,
  Send,
  Loader2,
  FileText,
  AlertCircle,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Square,
  Copy,
  Check,
  Languages,
} from 'lucide-react';
import DashboardCard from '../components/DashboardCard';
import Button from '../components/Button';
import Input from '../components/Input';
import { DASHBOARD_TOOLS } from '../utils/constants';
import useDocumentTitle from '../hooks/useDocumentTitle';
import authService from '../services/authService';
import aiService from '../services/aiService';
import useSpeechRecognition from '../hooks/useSpeechRecognition';
import useTextToSpeech from '../hooks/useTextToSpeech';

export default function DashboardPage() {
  useDocumentTitle('Copilot Dashboard');
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => authService.getUser());

  // Interactive AI state
  const [aiInputText, setAiInputText] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [aiQuestion, setAiQuestion] = useState('');
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Translation state
  const TRANSLATION_LANGUAGES = ['English', 'Kannada', 'Hindi'];
  const [translateInputText, setTranslateInputText] = useState('');
  const [translateSourceLang, setTranslateSourceLang] = useState('Auto');
  const [translateTargetLang, setTranslateTargetLang] = useState(
    () => currentUser?.accessibilityPreferences?.preferredLanguage || 'Kannada'
  );
  const [translateResult, setTranslateResult] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // Voice assistant state
  const [voiceTranscriptText, setVoiceTranscriptText] = useState('');
  const {
    isListening,
    transcript: liveTranscript,
    error: speechError,
    isSupported: speechSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();
  const {
    isSpeaking,
    isSupported: ttsSupported,
    speak,
    stop: stopSpeaking,
  } = useTextToSpeech();

  useEffect(() => {
    // Verify token and load profile with accessibility preferences
    authService.getProfile().then((profile) => {
      if (profile) {
        setCurrentUser(profile);
      }
    });
  }, []);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/login');
  };

  const handleOpenModule = (tool) => {
    setSelectedModule(tool);
    setAiResult('');
    setAiError('');
    setAiInputText('');
    setAiContext('');
    setAiQuestion('');
    setSelectedImageFile(null);
    setVoiceTranscriptText('');
    resetTranscript();
    stopSpeaking();
    setTranslateInputText('');
    setTranslateResult(null);
    setCopySuccess(false);
  };

  const handleRunAi = async () => {
    setAiLoading(true);
    setAiError('');
    setAiResult('');

    try {
      if (selectedModule.id === 'text-simplifier') {
        if (!aiInputText.trim()) throw new Error('Please enter text to simplify.');
        const result = await aiService.simplifyText(aiInputText);
        setAiResult(result);
      } else if (selectedModule.id === 'ask-accessai') {
        if (!aiContext.trim()) throw new Error('Please provide the context/document information.');
        if (!aiQuestion.trim()) throw new Error('Please enter your question.');
        const result = await aiService.askAccessAI(aiContext, aiQuestion);
        setAiResult(result);
      } else if (selectedModule.id === 'image-assistant') {
        if (!selectedImageFile) throw new Error('Please select an image file to analyze.');
        const result = await aiService.analyzeImage(selectedImageFile, selectedImageFile.type);
        setAiResult(result);
      } else if (selectedModule.id === 'voice-assistant') {
        const textToSend = voiceTranscriptText.trim();
        if (!textToSend) throw new Error('Please speak or type a voice query first.');
        const userLang = currentUser?.accessibilityPreferences?.preferredLanguage || 'English';
        const result = await aiService.voiceQuery(textToSend, userLang);
        setAiResult(result);
      } else if (selectedModule.id === 'translation') {
        if (!translateInputText.trim()) throw new Error('Please enter text to translate.');
        if (!translateTargetLang) throw new Error('Please select a target language.');
        const result = await aiService.translateText(
          translateInputText,
          translateTargetLang,
          translateSourceLang
        );
        setTranslateResult(result);
        setAiResult(result.translatedText);
      }
    } catch (err) {
      setAiError(err.message || 'AI request failed');
    } finally {
      setAiLoading(false);
    }
  };

  // When live transcript updates, sync it to the editable text field
  useEffect(() => {
    if (liveTranscript) {
      setVoiceTranscriptText(liveTranscript);
    }
  }, [liveTranscript]);

  // Propagate speech recognition errors to aiError
  useEffect(() => {
    if (speechError) {
      setAiError(speechError);
    }
  }, [speechError]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Welcome Banner */}
      <section
        aria-labelledby="dashboard-welcome-heading"
        className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-slate-200 shadow-xs mb-10"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-indigo-50 text-indigo-800 text-xs font-bold uppercase tracking-wider border border-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" aria-hidden="true" />
              Copilot Workspace
            </div>
            <h1
              id="dashboard-welcome-heading"
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
            >
              {currentUser ? `Welcome back, ${currentUser.name}` : 'Accessibility Hub'}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl">
              Choose an accessibility module below to begin parsing, simplifying, or converting visual and written content.
            </p>
          </div>

          {/* User Session & Accessibility Settings Preview */}
          <div className="flex flex-col items-start md:items-end gap-3">
            {currentUser && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 px-3.5 py-1.5 rounded-xl text-sm font-semibold">
                <UserCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span>Signed in as {currentUser.email}</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="ml-2 text-xs font-bold text-rose-700 hover:text-rose-900 hover:underline flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-rose-600 rounded p-1"
                  aria-label="Sign out of AccessAI"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2 items-center bg-slate-50 border border-slate-200 p-3 rounded-xl text-sm">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                Active Profile:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-300 font-medium text-slate-800 text-xs">
                Font: {currentUser?.accessibilityPreferences?.fontSize || 'medium'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-300 font-medium text-slate-800 text-xs">
                Language: {currentUser?.accessibilityPreferences?.preferredLanguage || 'English'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-300 font-medium text-slate-800 text-xs">
                {currentUser?.accessibilityPreferences?.highContrast ? 'High Contrast: On' : 'Standard Contrast'}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Module Detail Modal / Drawer with Live AI Testing */}
      {selectedModule && (
        <aside
          role="dialog"
          aria-labelledby="modal-title"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 border-2 border-indigo-600 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide">
                  {selectedModule.category}
                </span>
                <h2 id="modal-title" className="text-2xl font-black text-slate-900 mt-1">
                  {selectedModule.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedModule(null)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-indigo-600"
                aria-label="Close module preview"
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            <p className="text-slate-600 text-base mb-6 leading-relaxed">
              {selectedModule.description}
            </p>

            {/* Error banner */}
            {aiError && (
              <div
                role="alert"
                className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold">AI Assistant Notice</p>
                  <p className="text-xs text-rose-800 mt-0.5">{aiError}</p>
                </div>
              </div>
            )}

            {/* Interactive Module Controllers */}
            {selectedModule.id === 'text-simplifier' && (
              <div className="space-y-4 mb-6">
                <label htmlFor="simplify-input" className="block text-sm font-bold text-slate-800">
                  Text to Simplify:
                </label>
                <textarea
                  id="simplify-input"
                  rows={4}
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  placeholder="Paste complex text, legal disclaimers, or technical articles here..."
                  className="w-full p-3.5 border-2 border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRunAi}
                  disabled={aiLoading}
                  ariaLabel="Simplify text with Gemini"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
                      Simplifying...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                      Simplify Text
                    </>
                  )}
                </Button>
              </div>
            )}

            {selectedModule.id === 'ask-accessai' && (
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="ask-context" className="block text-sm font-bold text-slate-800 mb-1">
                    Context Information:
                  </label>
                  <textarea
                    id="ask-context"
                    rows={3}
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                    placeholder="Provide the article, email, or document content here..."
                    className="w-full p-3.5 border-2 border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
                <div>
                  <Input
                    id="ask-question"
                    label="Your Question"
                    value={aiQuestion}
                    onChange={(e) => setAiQuestion(e.target.value)}
                    placeholder="e.g. What is the deadline or return policy?"
                  />
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRunAi}
                  disabled={aiLoading}
                  ariaLabel="Ask question with Gemini"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
                      Answering...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                      Ask AccessAI
                    </>
                  )}
                </Button>
              </div>
            )}

            {selectedModule.id === 'image-assistant' && (
              <div className="space-y-4 mb-6">
                <label htmlFor="image-file" className="block text-sm font-bold text-slate-800">
                  Select an image (JPEG, PNG, WebP, GIF - max 5MB):
                </label>
                <input
                  id="image-file"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => setSelectedImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleRunAi}
                  disabled={aiLoading}
                  ariaLabel="Analyze image with Gemini"
                >
                  {aiLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
                      Analyzing Image...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                      Analyze Image
                    </>
                  )}
                </Button>
              </div>
            )}

            {selectedModule.id === 'voice-assistant' && (
              <div className="space-y-5 mb-6">
                {/* Mic Control Row */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Mic Button */}
                  <button
                    type="button"
                    onClick={isListening ? stopListening : startListening}
                    disabled={!speechSupported}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                      isListening
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isListening ? (
                      <MicOff className="w-8 h-8" aria-hidden="true" />
                    ) : (
                      <Mic className="w-8 h-8" aria-hidden="true" />
                    )}
                    {isListening && (
                      <span className="absolute inset-0 rounded-full border-4 border-rose-400 animate-ping opacity-40" />
                    )}
                  </button>

                  <div className="flex-1 text-center sm:text-left">
                    <p className="text-sm font-bold text-slate-800">
                      {isListening ? '🎙️ Listening... Speak now' : 'Tap the mic to start speaking'}
                    </p>
                    {!speechSupported && (
                      <p className="text-xs text-rose-700 mt-1">
                        Speech recognition is not supported in this browser. Use Chrome or Edge.
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1">
                      Or type your query in the text area below.
                    </p>
                  </div>
                </div>

                {/* Transcript / Query Text Area */}
                <div>
                  <label htmlFor="voice-transcript" className="block text-sm font-bold text-slate-800 mb-1">
                    Your Voice Query:
                  </label>
                  <textarea
                    id="voice-transcript"
                    rows={3}
                    value={voiceTranscriptText}
                    onChange={(e) => setVoiceTranscriptText(e.target.value)}
                    placeholder={isListening ? 'Your speech will appear here...' : 'Speak or type your accessibility question here...'}
                    className="w-full p-3.5 border-2 border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleRunAi}
                    disabled={aiLoading || !voiceTranscriptText.trim()}
                    ariaLabel="Send voice query to AccessAI"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" aria-hidden="true" />
                        Send to AccessAI
                      </>
                    )}
                  </Button>

                  {/* TTS: Read Response Aloud */}
                  {aiResult && ttsSupported && (
                    <Button
                      variant={isSpeaking ? 'outline' : 'subtle'}
                      size="md"
                      onClick={isSpeaking ? stopSpeaking : () => speak(aiResult)}
                      ariaLabel={isSpeaking ? 'Stop reading aloud' : 'Read response aloud'}
                    >
                      {isSpeaking ? (
                        <>
                          <VolumeX className="w-4 h-4 mr-2" aria-hidden="true" />
                          Stop Reading
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 mr-2" aria-hidden="true" />
                          Read Aloud
                        </>
                      )}
                    </Button>
                  )}

                  {voiceTranscriptText && (
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => {
                        setVoiceTranscriptText('');
                        resetTranscript();
                      }}
                      ariaLabel="Clear voice transcript"
                    >
                      <X className="w-4 h-4 mr-1" aria-hidden="true" />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            )}

            {selectedModule.id === 'translation' && (
              <div className="space-y-5 mb-6">
                {/* Input Text */}
                <div>
                  <label htmlFor="translate-input" className="block text-sm font-bold text-slate-800 mb-1">
                    Text to Translate:
                  </label>
                  <textarea
                    id="translate-input"
                    rows={4}
                    value={translateInputText}
                    onChange={(e) => setTranslateInputText(e.target.value)}
                    placeholder="Paste or type the text you want to translate..."
                    className="w-full p-3.5 border-2 border-slate-300 rounded-xl text-base text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                {/* Language Selectors */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label htmlFor="source-language" className="block text-sm font-bold text-slate-800 mb-1">
                      Source Language:
                    </label>
                    <select
                      id="source-language"
                      value={translateSourceLang}
                      onChange={(e) => setTranslateSourceLang(e.target.value)}
                      className="w-full p-3 border-2 border-slate-300 rounded-xl text-base text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
                      aria-label="Select source language"
                    >
                      <option value="Auto">Auto Detect</option>
                      {TRANSLATION_LANGUAGES.map((lang) => (
                        <option key={`src-${lang}`} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-end justify-center pb-3">
                    <Languages className="w-5 h-5 text-indigo-500" aria-hidden="true" />
                  </div>

                  <div className="flex-1">
                    <label htmlFor="target-language" className="block text-sm font-bold text-slate-800 mb-1">
                      Target Language:
                    </label>
                    <select
                      id="target-language"
                      value={translateTargetLang}
                      onChange={(e) => setTranslateTargetLang(e.target.value)}
                      className="w-full p-3 border-2 border-slate-300 rounded-xl text-base text-slate-900 bg-white focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600"
                      aria-label="Select target language"
                    >
                      {TRANSLATION_LANGUAGES.map((lang) => (
                        <option key={`tgt-${lang}`} value={lang}>{lang}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleRunAi}
                    disabled={aiLoading || !translateInputText.trim()}
                    ariaLabel="Translate text"
                  >
                    {aiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" aria-hidden="true" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Languages className="w-4 h-4 mr-2" aria-hidden="true" />
                        Translate
                      </>
                    )}
                  </Button>

                  {translateInputText && (
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => {
                        setTranslateInputText('');
                        setTranslateResult(null);
                        setAiResult('');
                        setAiError('');
                        setCopySuccess(false);
                      }}
                      ariaLabel="Clear translation"
                    >
                      <X className="w-4 h-4 mr-1" aria-hidden="true" />
                      Clear
                    </Button>
                  )}
                </div>

                {/* Translation Result */}
                {translateResult && (
                  <div className="p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-200 text-slate-900">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 font-bold text-emerald-900">
                        <Languages className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                        Translation Result
                        {translateResult.detectedLanguage && (
                          <span className="text-xs font-medium text-slate-500 ml-1">
                            ({translateResult.detectedLanguage} → {translateResult.targetLanguage})
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(translateResult.translatedText);
                            setCopySuccess(true);
                            setTimeout(() => setCopySuccess(false), 2000);
                          } catch {
                            setAiError('Failed to copy to clipboard.');
                          }
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-indigo-600 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                        aria-label="Copy translated text to clipboard"
                      >
                        {copySuccess ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                    <div className="text-base leading-relaxed whitespace-pre-wrap font-normal">
                      {translateResult.translatedText}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* AI Result Card */}
            {aiResult && (
              <div className="mt-6 p-5 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 text-slate-900">
                <div className="flex items-center gap-2 font-bold text-indigo-900 mb-2">
                  <FileText className="w-4 h-4 text-indigo-700" aria-hidden="true" />
                  Copilot Analysis:
                </div>
                <div className="text-base leading-relaxed whitespace-pre-wrap font-normal">
                  {aiResult}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setSelectedModule(null)}
                ariaLabel="Close modal"
              >
                Close
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Modules Grid */}
      <section aria-labelledby="modules-heading">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2
              id="modules-heading"
              className="text-2xl font-bold text-slate-900 tracking-tight"
            >
              Accessibility Modules ({DASHBOARD_TOOLS.length})
            </h2>
            <p className="text-sm text-slate-500">
              Select any capability to launch its interactive copilot interface
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {DASHBOARD_TOOLS.map((tool) => (
            <DashboardCard
              key={tool.id}
              title={tool.title}
              description={tool.description}
              icon={tool.icon}
              status={
                ['text-simplifier', 'ask-accessai', 'image-assistant', 'voice-assistant', 'translation'].includes(tool.id)
                  ? 'Gemini Connected'
                  : tool.status
              }
              category={tool.category}
              onSelect={() => handleOpenModule(tool)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
