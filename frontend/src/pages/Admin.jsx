import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [message, setMessage] = useState('');
  const [qaList, setQaList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Função para buscar a lista de perguntas e respostas
  const fetchQaList = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/questions/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQaList(res.data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao listar perguntas');
    }
  };

  // Carrega a lista ao fazer login
  useEffect(() => {
    if (token) {
      fetchQaList();
    }
  }, [token]);

  // Função para fazer login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });
      const newToken = res.data.token;
      setToken(newToken);
      localStorage.setItem('adminToken', newToken);
      setMessage('Login bem-sucedido!');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao fazer login');
    }
  };

  // Função para cadastrar ou editar pergunta e resposta
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Edição
        const res = await axios.put(
          `http://localhost:5000/api/questions/${editingId}`,
          { question, answer },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage(res.data.message);
        setEditingId(null);
      } else {
        // Cadastro
        const res = await axios.post(
          'http://localhost:5000/api/questions/register',
          { question, answer },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setMessage(res.data.message);
      }
      setQuestion('');
      setAnswer('');
      fetchQaList(); // Atualiza a lista após cadastrar/editar
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao processar');
    }
  };

  // Função para iniciar a edição
  const handleEdit = (qa) => {
    setEditingId(qa.id);
    setQuestion(qa.question);
    setAnswer(qa.answer);
  };

  // Função para excluir uma pergunta
  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/questions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(res.data.message);
      fetchQaList(); // Atualiza a lista após excluir
    } catch (error) {
      setMessage(error.response?.data?.message || 'Erro ao excluir');
    }
  };

  // Função para logout
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('adminToken');
    setMessage('');
    setUsername('');
    setPassword('');
    setQaList([]);
    setEditingId(null);
    setQuestion('');
    setAnswer('');
  };

  return (
    <div
      style={{
        backgroundColor: '#141414',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'Arial, sans-serif',
        color: '#ffffff',
      }}
    >
      <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Área de Administração</h1>

      {/* Botão para voltar à página inicial */}
      <button
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: '#2f2f2f',
          color: '#ffffff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
        }}
      >
        Voltar à Página Inicial
      </button>

      {/* Formulário de Login (exibido se não estiver logado) */}
      {!token ? (
        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
            maxWidth: '400px',
            backgroundColor: '#2f2f2f',
            padding: '24px',
            borderRadius: '16px',
          }}
        >
          <h2 style={{ fontSize: '20px', margin: 0 }}>Login de Administrador</h2>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuário"
            style={{
              backgroundColor: '#141414',
              color: '#ffffff',
              border: '1px solid #444',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
            }}
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            style={{
              backgroundColor: '#141414',
              color: '#ffffff',
              border: '1px solid #444',
              padding: '12px',
              borderRadius: '8px',
              fontSize: '16px',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#00d4ff',
              color: '#141414',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Entrar
          </button>
          {message && (
            <p style={{ color: message.includes('bem-sucedido') ? '#00d4ff' : '#ff5555', margin: 0 }}>
              {message}
            </p>
          )}
        </form>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            width: '100%',
            maxWidth: '600px',
          }}
        >
          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            style={{
              alignSelf: 'flex-end',
              backgroundColor: '#ff5555',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Sair
          </button>

          {/* Formulário de Cadastro/Edição de Perguntas e Respostas */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              backgroundColor: '#2f2f2f',
              padding: '24px',
              borderRadius: '16px',
            }}
          >
            <h2 style={{ fontSize: '20px', margin: 0 }}>
              {editingId ? 'Editar Pergunta e Resposta' : 'Cadastrar Pergunta e Resposta'}
            </h2>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Digite a pergunta"
              style={{
                backgroundColor: '#141414',
                color: '#ffffff',
                border: '1px solid #444',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
              }}
            />
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Digite a resposta"
              style={{
                backgroundColor: '#141414',
                color: '#ffffff',
                border: '1px solid #444',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                minHeight: '100px',
                resize: 'vertical',
              }}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#00d4ff',
                  color: '#141414',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  flex: 1,
                }}
              >
                {editingId ? 'Salvar Alterações' : 'Cadastrar'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setQuestion('');
                    setAnswer('');
                  }}
                  style={{
                    backgroundColor: '#ff5555',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    flex: 1,
                  }}
                >
                  Cancelar
                </button>
              )}
            </div>
            {message && (
              <p style={{ color: message.includes('sucesso') ? '#00d4ff' : '#ff5555', margin: 0 }}>
                {message}
              </p>
            )}
          </form>

          {/* Lista de Perguntas e Respostas */}
          <div
            style={{
              backgroundColor: '#2f2f2f',
              padding: '24px',
              borderRadius: '16px',
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            <h2 style={{ fontSize: '20px', margin: '0 0 16px 0' }}>Perguntas Cadastradas</h2>
            {qaList.length === 0 ? (
              <p style={{ color: '#d1d5db' }}>Nenhuma pergunta cadastrada.</p>
            ) : (
              qaList.map((qa) => (
                <div
                  key={qa.id}
                  style={{
                    backgroundColor: '#141414',
                    padding: '16px',
                    borderRadius: '8px',
                    marginBottom: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 'bold' }}>Pergunta: {qa.question}</p>
                  <p style={{ margin: 0 }}>Resposta: {qa.answer}</p>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={() => handleEdit(qa)}
                      style={{
                        backgroundColor: '#00d4ff',
                        color: '#141414',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(qa.id)}
                      style={{
                        backgroundColor: '#ff5555',
                        color: '#ffffff',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;