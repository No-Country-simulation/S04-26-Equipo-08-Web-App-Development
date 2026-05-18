import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav style={{
            padding: '1rem 2rem',
            backgroundColor: 'var(--bg)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link
                    to="/"
                    style={{
                        fontWeight: 'bold',
                        fontSize: '1.5rem',
                        color: 'var(--text-h)',
                        textDecoration: 'none'
                    }}
                >
                    NorthPay
                </Link>
                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    <Link
                        to="/"
                        style={{
                            color: 'var(--text)',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-bg)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        Home
                    </Link>
                    <Link
                        to="/test"
                        style={{
                            color: 'var(--text)',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-bg)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        Test
                    </Link>
                    <Link
                        to="/login"
                        style={{
                            color: 'var(--text)',
                            textDecoration: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--accent-bg)'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        Login
                    </Link>
                </div>
            </div>
        </nav>
    )
}