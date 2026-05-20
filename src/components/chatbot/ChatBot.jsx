import { useState, useRef, useEffect } from "react";
import "./ChatBot.css";

let msgId = 0;

function ChatBot() {
    const [messages, setMessages] = useState([
        { id: msgId++, role: "bot", text: "Hey! I'm EventBot. Ask me about events, registration, or anything else!" }
    ]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const addMessage = (text, role) => {
        setMessages(prev => [...prev, { id: Date.now(), role, text }]);
    };

    const handleSend = async () => {
        const text = input.trim();
        if (!text || loading) return;

        setInput("");
        addMessage(text, "user");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    message: text,
                    history: messages.slice(-6).map(m => ({
                        role: m.role === "bot" ? "assistant" : "user",
                        content: m.text
                    }))
                })
            });

            const data = await res.json();
            setMessages(prev => [...prev, { id: msgId++, role: "bot", text: data.reply }]);
        }
        catch (err) {
            setMessages(prev => [...prev, { id: msgId++, role: "bot", text: "Something went wrong, try again!" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!isOpen && (
                <button className="chat-bubble" onClick={() => setIsOpen(true)}>
                    Chat
                </button>
            )}

            {isOpen && (
                <div className="chat-panel">
                    <div className="chat-header">
                        <span>EventBot AI</span>
                        <button onClick={() => setIsOpen(false)}>x</button>
                    </div>

                    <div className="chat-messages">
                        {messages.map(m => (
                            <div key={m.id} className={`bubble ${m.role}`}>
                                {m.text}
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className="chat-input-row">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => e.key === "Enter" && handleSend()}
                            placeholder="Ask about events..."
                        />
                        <button onClick={handleSend}>Send</button>
                    </div>
                </div>
            )}
        </>
    );
}

export default ChatBot;
