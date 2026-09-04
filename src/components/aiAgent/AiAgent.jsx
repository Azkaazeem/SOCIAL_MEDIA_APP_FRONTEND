import { useState, useRef, useEffect } from "react";
import { 
  Close, 
  Send, 
  ContentCopy, 
  Check, 
  AutoAwesome,
  SmartToy
} from "@mui/icons-material";
import axios from "axios";
import "./aiAgent.css";

const AI_PIC = "/assets/AI.jpg";

const INITIAL_MESSAGES = [
  {
    id: 1,
    sender: "bot",
    text: "Hello! 👋 I'm **Zakora AI**, your personal creative assistant. Need help writing an engaging post caption, brainstorming ideas, or creating hashtags? Just ask me!",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
];

const SUGGESTIONS = [
  "✨ Write a catchy caption for my new photo",
  "💡 Give me 4 creative post ideas",
  "🏷️ Generate trending hashtags for social media",
  "ℹ️ Tell me what ZakoraSocial is about"
];

const AiAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [isOpen, messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({
        role: m.sender === "user" ? "user" : "assistant",
        text: m.text
      }));

      const res = await axios.post("/ai/chat", {
        message: textToSend,
        history: historyPayload
      });

      const botReply = res.data?.reply || "I'm here to help with your social media posts!";

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: botReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("AI Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "Oops, I encountered a temporary connection issue. Please try asking again!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopy = (text, id) => {
    const cleanText = text.replace(/\*\*/g, "");
    navigator.clipboard.writeText(cleanText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="aiAgentWrapper">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          className="aiFloatingBtn"
          onClick={() => setIsOpen(true)}
          title="Chat with Zakora AI"
          aria-label="Open AI Assistant"
        >
          <img 
            src={AI_PIC} 
            alt="AI" 
            className="aiFloatingImg"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="aiFloatingText">Zakora AI</span>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="aiChatWindow">
          {/* Header */}
          <div className="aiHeader">
            <div className="aiHeaderLeft">
              <div className="aiAvatar">
                <img 
                  src={AI_PIC} 
                  alt="AI" 
                  className="aiHeaderAvatarImg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h3 className="aiTitle">Zakora AI Assistant</h3>
                <span className="aiStatus">
                  <span className="aiStatusDot"></span> Online & Ready
                </span>
              </div>
            </div>
            <div className="aiHeaderActions">
              <button
                className="aiHeaderBtn"
                onClick={() => setIsOpen(false)}
                title="Close"
              >
                <Close style={{ fontSize: "20px" }} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div className="aiMessagesBody">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`aiMessageRow ${m.sender === "user" ? "userRow" : "botRow"}`}
              >
                {m.sender === "bot" && (
                  <div className="aiMsgAvatar">
                    <img 
                      src={AI_PIC} 
                      alt="AI" 
                      className="aiMsgAvatarImg"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className={`aiBubble ${m.sender === "user" ? "userBubble" : "botBubble"}`}>
                  <div className="aiBubbleText">{m.text}</div>
                  <div className="aiBubbleFooter">
                    <span className="aiBubbleTime">{m.time}</span>
                    {m.sender === "bot" && (
                      <button
                        className="aiCopyBtn"
                        onClick={() => handleCopy(m.text, m.id)}
                        title="Copy to clipboard"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check style={{ fontSize: "12px", color: "#10b981" }} />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <ContentCopy style={{ fontSize: "12px" }} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="aiMessageRow botRow">
                <div className="aiMsgAvatar">
                  <img 
                    src={AI_PIC} 
                    alt="AI" 
                    className="aiMsgAvatarImg"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="aiBubble botBubble typingBubble">
                  <span className="typingDot"></span>
                  <span className="typingDot"></span>
                  <span className="typingDot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 2 && (
            <div className="aiSuggestions">
              <div className="aiSuggestionsTitle">
                <AutoAwesome style={{ fontSize: "14px" }} /> Try asking:
              </div>
              <div className="aiChipsContainer">
                {SUGGESTIONS.map((s, idx) => (
                  <button
                    key={idx}
                    className="aiChip"
                    onClick={() => handleSend(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Footer */}
          <form
            className="aiInputContainer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="aiInput"
              placeholder="Ask Zakora AI for captions, ideas..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              type="submit"
              className="aiSendBtn"
              disabled={!input.trim() || loading}
              title="Send"
            >
              <Send style={{ fontSize: "18px" }} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AiAgent;
