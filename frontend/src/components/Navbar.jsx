import { Link } from 'react-router-dom';
import { FaRocket } from 'react-icons/fa';

function Navbar() {
  return (
    <nav
      style={{
        backgroundColor: '#1a1a1a',
        padding: '16px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Link
          to="/"
          style={{
            color: '#00d4ff',
            fontSize: '20px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <FaRocket style={{ marginRight: '8px' }} /> AskGrok
        </Link>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/admin" style={{ color: '#00d4ff', fontSize: '16px' }}>
            Admin
          </Link>
          <Link to="/login" style={{ color: '#00d4ff', fontSize: '16px' }}>
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;