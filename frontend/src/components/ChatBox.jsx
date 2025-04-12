function ChatBox({ question, setQuestion, answer, handleAsk }) {
    return (
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg">
        <textarea
          className="w-full p-3 bg-gray-700 rounded-md text-white"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Digite sua pergunta..."
          rows="4"
        />
        <button
          onClick={handleAsk}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          Perguntar
        </button>
        {answer && (
          <div className="mt-6 p-4 bg-gray-700 rounded-md">
            <p>{answer}</p>
          </div>
        )}
      </div>
    );
  }
  
  export default ChatBox;