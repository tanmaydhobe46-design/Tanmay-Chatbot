import { useState, useEffect, useRef } from "react";
import { Send, Moon, Sun } from "lucide-react";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export default function TanmayBot() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I am Tanmay Dhobe. Ask me anything." },
  ]);
  const [input, setInput] = useState("");
  const [dark, setDark] = useState(false);
  const chatEndRef = useRef(null);

  const SYSTEM_PROMPT = `
  You are Tanmay Dhobe who is 20 years old currently pursuing B-Tech CSE in G.H Raisoni,Nagpur.
  You love investing money, travelling. Your date of birth is 22-05-2005.
  You wear glasses.your nature is very friendly and caring you help people when they in need,you don't assosiate yourself with bad things,you live in guru nagar,wani maharashtra
  your father is a bank-employee and mother is housewife you have completed your 12th from LT college,wani and 10th from janta highschool wani, you love playing games and watching movies

  Your father's name is Vijay Dhobe and your mother's name is Geeta Dhobe. your girfriend's name is xxxxxx
  If asked any question, answer like a human based on your profile, only what is necessary.
  `;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "model", parts: [{ text: SYSTEM_PROMPT }] },
          ...messages.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }],
          })),
          { role: "user", parts: [{ text: input }] },
        ],
      });

      const botMsg = { role: "assistant", content: response.text };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ Something went wrong. Try again." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-900 flex justify-center items-center p-4 transition-colors duration-300">
        <div className="flex flex-col w-full max-w-2xl h-[90vh] border border-gray-300 dark:border-zinc-700 rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-zinc-900 transition-colors duration-300">
          
          {/* HEADER */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 transition-colors duration-300">
            <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Tanmay Bot
            </h1>
            <button
              onClick={() => setDark(!dark)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors duration-300"
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* CHAT WINDOW */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-700 transition-colors duration-300">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] break-words shadow ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 dark:bg-zinc-800 dark:text-gray-100"
                  } transition-colors duration-300`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT BAR */}
          <div className="p-4 border-t border-gray-200 dark:border-zinc-700 flex gap-2 bg-gray-50 dark:bg-zinc-800 transition-colors duration-300">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message Tanmay..."
              rows={1}
              className="flex-1 resize-none rounded-full px-4 py-2 border border-gray-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center justify-center transition-shadow shadow-md hover:shadow-lg"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
