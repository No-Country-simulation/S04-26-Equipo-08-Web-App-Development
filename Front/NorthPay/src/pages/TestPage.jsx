import { useHealthCheck, useAdminCheck, testQueryKeys } from '../hooks/useTestQueries'
import { useQueryClient } from '@tanstack/react-query'

export default function TestPage() {
  const queryClient = useQueryClient()
  const { data: healthData, isLoading: isHealthLoading, error: healthError } = useHealthCheck()
  const { mutate: checkAdmin, isPending: isChecking, data: adminData, error: adminError } = useAdminCheck()

  const handleAdminCheck = () => {
    // Invalidate and refetch
    queryClient.invalidateQueries({ queryKey: testQueryKeys.adminCheck })
    checkAdmin()
  }

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Prueba de Conexión Backend</h2>

      {/* Health Check Section */}
      <div style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: 'var(--code-bg)',
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-h)' }}>Health Check</h3>
        {isHealthLoading && <p>Cargando...</p>}
        {healthError && (
          <div style={{
            padding: '1rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            color: '#dc2626'
          }}>
            <strong>Error:</strong> {healthError.message}
          </div>
        )}
        {healthData && (
          <ResponseDisplay data={healthData} />
        )}
      </div>

      {/* Admin Check Section */}
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'var(--code-bg)',
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-h)' }}>Admin Check</h3>

        <button
          onClick={handleAdminCheck}
          disabled={isChecking}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: isChecking ? '#ccc' : 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isChecking ? 'not-allowed' : 'pointer',
            fontWeight: 'bold',
            fontSize: '1rem',
            transition: 'background-color 0.2s'
          }}
        >
          {isChecking ? 'Verificando...' : 'Verificar Admin'}
        </button>

        {adminError && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            backgroundColor: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '4px',
            color: '#dc2626'
          }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Error:</h4>
            <p>{adminError.message || 'Error connecting to backend'}</p>
          </div>
        )}

        {adminData && (
          <ResponseDisplay data={adminData} />
        )}
      </div>
    </div>
  )
}

// Component to display API response
function ResponseDisplay({ data }) {
  return (
    <div style={{
      marginTop: '1rem',
      textAlign: 'left'
    }}>
      <div style={{
        padding: '1rem',
        backgroundColor: data.ok ? '#dcfce7' : '#fee2e2',
        border: `1px solid ${data.ok ? '#86efac' : '#fca5a5'}`,
        borderRadius: '4px',
        marginBottom: '0.5rem'
      }}>
        <strong>Estado:</strong> {data.ok ? '✓ Exitoso' : '✗ Error'}
        <br />
        <strong>Mensaje:</strong> {data.message}
        {data.code && <><br /><strong>Código:</strong> {data.code}</>}
      </div>

      {data.data && (
        <div style={{
          padding: '1rem',
          backgroundColor: 'rgba(255,255,255,0.5)',
          border: '1px solid var(--border)',
          borderRadius: '4px'
        }}>
          <strong>Datos:</strong>
          <pre style={{
            marginTop: '0.5rem',
            padding: '1rem',
            backgroundColor: 'var(--code-bg)',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.9rem'
          }}>
            {JSON.stringify(data.data, null, 2)}
          </pre>
        </div>
      )}

      {data.details && (
        <div style={{
          marginTop: '0.5rem',
          padding: '1rem',
          backgroundColor: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '4px'
        }}>
          <strong>Detalles:</strong>
          <pre style={{
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: 'rgba(255,255,255,0.5)',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '0.9rem'
          }}>
            {data.details}
          </pre>
        </div>
      )}
    </div>
  )
}