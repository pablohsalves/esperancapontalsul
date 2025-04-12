import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaCopy, FaShare, FaThumbsUp, FaThumbsDown, FaArrowUp } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [helpText, setHelpText] = useState('Como posso ajudá-lo hoje?');
  const [userName, setUserName] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setUserName(response.data.name || 'Usuário');
      } catch (error) {
        console.error('Erro ao buscar nome do usuário:', error);
        setUserName('Usuário');
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    let greetingText = '';
    if (hour >= 5 && hour < 12) {
      greetingText = 'Bom dia';
    } else if (hour >= 12 && hour < 18) {
      greetingText = 'Boa tarde';
    } else {
      greetingText = 'Boa noite';
    }
    if (userName) {
      setGreeting(`${greetingText}, ${userName}`);
    }
  }, [userName]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setMessages([...messages, { type: 'user', text: question }]);
    setQuestion('');
    setIsThinking(true);

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/questions/ask`, { question });
      setMessages((prev) => [...prev, { type: 'grok', text: res.data.answer }]);
    } catch (error) {
      let errorMessage = 'Erro ao buscar resposta 😔';
      if (error.response) {
        errorMessage = `Erro: ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'Erro: Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
      } else {
        errorMessage = `Erro: ${error.message}`;
      }
      setMessages((prev) => [...prev, { type: 'grok', text: errorMessage }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert('Texto copiado!');
  };

  const handleShare = (text) => {
    if (navigator.share) {
      navigator.share({
        title: 'Resposta do Grok',
        text: text,
      });
    } else {
      alert('Compartilhamento não suportado neste navegador.');
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#141414',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
        fontFamily: 'Arial, sans-serif',
        boxSizing: 'border-box',
      }}
    >
      {/* Botão para acessar a página de administração */}
      <button
        onClick={() => navigate('/admin')}
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          backgroundColor: '#2f2f2f',
          color: '#ffffff',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          zIndex: 1000,
        }}
      >
        Área de Administração
      </button>

      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '900px',
          margin: '0 auto',
          overflowY: 'auto',
          paddingBottom: messages.length > 0 ? '80px' : '0',
          scrollbarWidth: 'thin',
          scrollbarColor: '#444 #141414',
        }}
        className="custom-scrollbar"
      >
        {messages.length === 0 && !isThinking && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              width: '90%',
            }}
          >
            <div>
              <h1
                style={{
                  color: '#ffffff',
                  fontSize: '24px',
                  fontWeight: '400',
                  margin: 0,
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                {greeting}
              </h1>
              <p
                style={{
                  color: '#ffffff',
                  fontSize: '16px',
                  fontWeight: '400',
                  margin: '8px 0 0 0',
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                {helpText}
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              style={{
                width: '100%',
                maxWidth: '600px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#2f2f2f',
                borderRadius: '16px',
                padding: '12px 16px',
              }}
            >
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                style={{
                  flex: 1,
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  padding: '8px',
                  fontFamily: 'Arial, sans-serif',
                }}
                placeholder="O que você quer saber?"
              />
              <button
                type="submit"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a0a0a0',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <FaArrowUp size={18} />
              </button>
            </form>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '16px',
            }}
          >
            {message.type === 'user' ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#4a4a4a',
                    borderRadius: '50%',
                  }}
                />
                <div
                  style={{
                    backgroundColor: '#2f2f2f',
                    color: '#d1d5db',
                    padding: '10px 14px',
                    borderRadius: '16px 16px 0 16px',
                    maxWidth: '80%',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  {message.text}
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: '80%' }}>
                <div
                  style={{
                    color: '#d1d5db',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    marginBottom: '8px',
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  {message.text}
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '6px',
                  }}
                >
                  <button
                    onClick={() => handleCopy(message.text)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a0a0a0',
                      cursor: 'pointer',
                      padding: '4px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a0a0')}
                  >
                    <FaCopy size={14} />
                  </button>
                  <button
                    onClick={() => handleShare(message.text)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a0a0a0',
                      cursor: 'pointer',
                      padding: '4px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a0a0')}
                  >
                    <FaShare size={14} />
                  </button>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a0a0a0',
                      cursor: 'pointer',
                      padding: '4px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a0a0')}
                  >
                    <FaThumbsUp size={14} />
                  </button>
                  <button
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#a0a0a0',
                      cursor: 'pointer',
                      padding: '4px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#a0a0a0')}
                  >
                    <FaThumbsDown size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                color: '#d1d5db',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              <span>Pensando</span>
              <span style={{ display: 'inline-flex', gap: '4px' }}>
                <span style={{ animation: 'blink 1s infinite' }}>.</span>
                <span style={{ animation: 'blink 1s infinite 0.2s' }}>.</span>
                <span style={{ animation: 'blink 1s infinite 0.4s' }}>.</span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {messages.length > 0 && (
        <form
          onSubmit={handleSubmit}
          style={{
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            position: 'fixed',
            bottom: '16px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#2f2f2f',
            borderRadius: '16px',
            padding: '12px 16px',
            boxSizing: 'border-box',
          }}
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            style={{
              flex: 1,
              backgroundColor: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '16px',
              outline: 'none',
              padding: '8px',
              fontFamily: 'Arial, sans-serif',
            }}
            placeholder="O que você quer saber?"
          />
          <button
            type="submit"
            style={{
              background: 'none',
              border: 'none',
              color: '#a0a0a0',
              cursor: 'pointer',
              padding: '4px',
            }}
          >
            <FaArrowUp size={18} />
          </button>
        </form>
      )}

      <style>
        {`
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.3; }
            100% { opacity: 1; }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #141414;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #444;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
          /* Ajustes para telas menores */
          @media (max-width: 768px) {
            body {
              margin: 0;
              padding: 0;
            }
            div {
              box-sizing: border-box;
            }
            input, textarea {
              font-size: 16px !important;
            }
            form {
              width: 90% !important;
            }
            h1 {
              font-size: 20px !important;
            }
            p {
              font-size: 14px !important;
            }
            button {
              font-size: 14px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;