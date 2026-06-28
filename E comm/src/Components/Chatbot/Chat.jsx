import React, { useState, useRef, useEffect } from 'react'
import { sendMessage } from "../../Service/chatService";
const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
   const chatbox=useRef(null);
    const [input, setInput] = useState("");
    const [loading,setLoading]=useState(false);

    const scrollToBottom=()=>{
      if(chatbox.current){
        chatbox.current.scrollTop=chatbox.current.scrollHeight;
      }
    }

    useEffect(()=>{
     scrollToBottom();
    },[messages]);
    const toggle = () => {
        setIsOpen(!isOpen);
    }
    
   const send =async () => {
     if (!input.trim()) return;
     const Usermessage = input.trim();
    setMessages(prev=>[
      ...prev,
       
        {
            text: Usermessage,
            sender: "user"
        }
    ])
    setInput("");
    setLoading(true);

   
    try{
    const aiResponse=await sendMessage(Usermessage);
    setMessages(prev => [
    ...prev,
    {
        text: aiResponse,
        sender: "ai"
    }
]);
    }
    catch(e){
      console.error(e);

        // Show an error message in the chat
        setMessages(prev => [
            ...prev,
            {
                text: "Sorry! Something went wrong.",
                sender: "ai"
            }
        ]);
    }
    finally {

        // This always runs
        setLoading(false);

    }
   }
    
  return (
    <div>
   {isOpen && (
  <div className="fixed bottom-24 right-6 h-[500px] w-[350px] rounded-[2rem] bg-white/80 backdrop-blur-xl shadow-2xl border border-white/50 flex flex-col overflow-hidden font-sans z-50">
    
    {/* Header Section */}
    <div className="h-16 border-b border-slate-100 flex items-center px-6 bg-slate-900 text-white">
      <div className="flex flex-col">
        <h2 className="font-black text-xs uppercase tracking-[0.3em]">
          VASTRA <span className="text-purple-400 italic font-serif lowercase">ai</span>
        </h2>
        <span className="text-[8px] tracking-widest text-emerald-400 uppercase font-bold mt-0.5">
          ● Online Matrix
        </span>
      </div>
      
      {/* Close Button */}
      <button 
        onClick={() => setIsOpen(false)} // Make sure to pair this with your state toggle function
        className="ml-auto text-xs font-black uppercase tracking-widest text-slate-400 hover:text-purple-400 transition-colors p-2"
      >
        [ X ]
      </button>
    </div>
    {/* Messages Box Area */}
    <div ref={chatbox} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
      {messages.length === 0 ? (
        <div className="text-xs text-slate-500">No messages yet. Ask VASTRA AI anything!</div>
      ) : (
        messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-xs shadow-xs leading-relaxed ${message.sender === 'user' ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'}`}>
              {message.text}
            </div>
          </div>
        ))
      )}
    </div>
   

    {/* Input Form Area */}
    <div className="p-4 border-t border-slate-100 bg-white">
      <div className="flex items-center gap-2 bg-slate-950 text-white rounded-xl p-1 pl-3 shadow-lg">
        <input 
        disabled={loading}
          type="text" 
          onKeyDown={(e) => {
            if (e.key === "Enter"&& !loading) {
                send();
            }
        }}
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder="Ask VASTRA AI..." 
          className="flex-1 bg-transparent border-none outline-hidden text-xs text-white placeholder-slate-400 py-2 font-mono"
        />
        <button disabled={loading} onClick={send} className="h-8 px-4 bg-purple-600 text-white rounded-lg font-black uppercase text-[10px] tracking-wider hover:bg-purple-500 transition-colors">
          
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>

  </div>
)}
        <button onClick={toggle}
    className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-purple-700 text-white text-2xl shadow-lg hover:bg-black transition "
        >
            💬
        </button>
    </div>
  )
}

export default Chat