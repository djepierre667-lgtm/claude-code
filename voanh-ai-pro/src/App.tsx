import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, Sparkles, Zap, Database, Plug } from 'lucide-react'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{role: string; content: string}[]>([
    { role: 'assistant', content: '👋 Bienvenue sur VOANH AI PRO ! Je suis votre assistant IA multi-agents. Comment puis-je vous aider aujourd\'hui ?' }
  ])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim()) return
    
    const userMessage = message
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setMessage('')
    setIsLoading(true)

    // Simulation de réponse (à remplacer par appel API Mistral)
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `🤖 J'ai bien reçu votre message : "${userMessage}". \n\nCette fonctionnalité sera connectée à l'API Mistral Free Tier très bientôt !` 
      }])
      setIsLoading(false)
    }, 1000)
  }

  const features = [
    { icon: Bot, name: 'Multi-Agents', desc: '20+ agents spécialisés' },
    { icon: Zap, name: 'Rapide', desc: 'Réponses instantanées' },
    { icon: Database, name: 'Mémoire', desc: 'Persistance locale' },
    { icon: Plug, name: 'Tools', desc: 'Extensions plugins' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 bg-slate-900/50 border-r border-slate-700 p-4 hidden md:block"
      >
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-8 h-8 text-blue-500" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            VOANH AI PRO
          </h1>
        </div>

        <nav className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-all">
            <Bot className="w-5 h-5" />
            <span>Chat</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition-all">
            <Sparkles className="w-5 h-5" />
            <span>Agents</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition-all">
            <Plug className="w-5 h-5" />
            <span>Marketplace</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 transition-all">
            <Database className="w-5 h-5" />
            <span>Mémoire</span>
          </button>
        </nav>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-slate-700 p-4 bg-slate-900/30">
          <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
            <h2 className="text-lg font-semibold">Nouvelle Conversation</h2>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm">
                Mistral Free Tier
              </span>
            </div>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-100'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-slate-800 rounded-2xl px-4 py-3">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-turquoise-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="px-4 pb-4">
          <div className="max-w-4xl mx-auto grid grid-cols-4 gap-4">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700"
              >
                <feature.icon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <p className="text-sm font-semibold">{feature.name}</p>
                <p className="text-xs text-slate-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-700 p-4 bg-slate-900/30">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Écrivez votre message..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !message.trim()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Envoyer
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
