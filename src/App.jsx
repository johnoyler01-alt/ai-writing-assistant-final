import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [tone, setTone] = useState("professional");
  const [copied, setCopied] = useState(false);
  const handleMagic = async () => {
    if (!input) return;
    setLoading(true);
    try {
      // 1. Check if the key even exists in the browser
      const apiKey = import.meta.env.VITE_APP_DATA;

      if (!apiKey) {
        setOutput(
          "DEBUG: The website can't see your API Key. Netlify didn't 'bake' it in.",
        );
        setLoading(false);
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `Act as an expert editor. Rewrite the following text to be more engaging and clear in a ${tone} tone: ${input}`;

      const result = await model.generateContent(prompt);
      setOutput(result.response.text());
    } catch (error) {
      // 2. Show the ACTUAL error from Google
      console.error(error);
      setOutput(`ERROR: ${error.message}`);
    }
    setLoading(false);
  };
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
            Ghostwriter <span className="text-blue-600">AI</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Professional editing at your fingertips.
          </p>
        </div>

        {/* Tone Selection Group */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          {["professional", "casual", "funny", "short"].map((t) => (
            <button
              key={t}
              onClick={() => setTone(t)}
              className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                tone === t
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <textarea
          className="w-full h-44 p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:bg-white outline-none transition-all resize-none text-slate-700 leading-relaxed"
          placeholder="Paste your rough notes or draft here..."
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleMagic}
          disabled={loading || !input}
          className="w-full mt-6 bg-blue-600 text-white font-black py-4 rounded-2xl hover:bg-blue-700 transform hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:transform-none"
        >
          {loading ? "POLISHING PROSE..." : `REWRITE AS ${tone.toUpperCase()}`}
        </button>

        {output && (
          <div className="mt-10 p-6 bg-slate-900 rounded-2xl text-slate-100 shadow-inner relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">
                Generated Result
              </span>
              <button
                onClick={copyToClipboard}
                className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors font-semibold"
              >
                {copied ? "COPIED!" : "COPY"}
              </button>
            </div>
            <p className="text-lg leading-relaxed font-serif italic text-slate-200">
              "{output}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
