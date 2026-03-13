import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronUp, ChevronDown, MessageSquare, ArrowLeft, Send } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { api } from '../api/index'

function TemaReszletek() {
  const { id } = useParams()
  const navigate = useNavigate()
  const t = useTheme()
  const { user } = useAuth()
  const [tema, setTema] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    api.temak.getOne(id)
      .then(setTema)
      .catch(() => setTema(null))
      .finally(() => setLoading(false))
  }, [id])

  const handleComment = async () => {
    if (!comment.trim()) return
    setSending(true)
    try {
      await api.temak.hozzaszol(id, { content: comment.trim() })
      const fresh = await api.temak.getOne(id)
      setTema(fresh)
      setComment('')
    } catch (err) {
      alert(err.message)
    } finally {
      setSending(false)
    }
  }

  if (loading) return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: t.bg, color: t.textMuted, fontSize: '0.9rem' }}>
      Betöltés...
    </div>
  )

  if (!tema) return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: t.bg, gap: '1rem' }}>
      <p style={{ color: t.textMuted }}>A téma nem található.</p>
      <button onClick={() => navigate('/')} style={{ background: 'none', border: `1px solid ${t.border}`, color: t.textSec, borderRadius: '8px', padding: '0.5rem 1rem', cursor: 'pointer', fontSize: '0.85rem' }}>
        Vissza a főoldalra
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: t.bg }}>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem' }}>

          {/* Vissza gomb */}
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: '0.83rem', marginBottom: '1.5rem', padding: 0 }}>
            <ArrowLeft size={15} /> Vissza
          </button>

          {/* Téma */}
          <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderLeft: `4px solid ${tema.categoryColor}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ background: `${tema.categoryColor}22`, color: tema.categoryColor, fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.6rem', borderRadius: '5px' }}>
                {tema.category}
              </span>
            </div>
            <h1 style={{ color: t.text, fontSize: '1.3rem', fontWeight: '700', margin: '0 0 1rem', lineHeight: 1.4 }}>{tema.title}</h1>
            <p style={{ color: t.textSec, fontSize: '0.88rem', lineHeight: 1.75, margin: '0 0 1.25rem', whiteSpace: 'pre-wrap' }}>{tema.content}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: tema.authorColor || '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.72rem', fontWeight: 'bold' }}>
                  {tema.authorName?.[0]?.toUpperCase() || '?'}
                </div>
                <span style={{ color: tema.authorColor || '#4ade80', fontSize: '0.83rem', fontWeight: '600' }}>{tema.authorName}</span>
                <span style={{ color: t.textDim, fontSize: '0.78rem' }}>· {new Date(tema.createdAt).toLocaleDateString('hu-HU')}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: t.textMuted, fontSize: '0.8rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ChevronUp size={14} /> {tema.votes} szavazat</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MessageSquare size={13} /> {tema.comments?.length ?? 0} hozzászólás</span>
              </div>
            </div>
          </div>

          {/* Hozzászólások */}
          <h2 style={{ color: t.text, fontSize: '1rem', fontWeight: '700', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={16} color="#4ade80" /> Hozzászólások ({tema.comments?.length ?? 0})
          </h2>

          {tema.comments?.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: t.textDim, fontSize: '0.85rem', background: t.bgCard, borderRadius: '10px', border: `1px solid ${t.border}`, marginBottom: '1.5rem' }}>
              Még nincs hozzászólás. Legyél az első!
            </div>
          )}

          {tema.comments?.map((c) => (
            <div key={c.id} style={{ display: 'flex', gap: '0.875rem', padding: '1rem', marginBottom: '0.5rem', background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: c.authorColor || '#4ade80', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.78rem', fontWeight: 'bold' }}>
                {c.authorName?.[0]?.toUpperCase() || '?'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                  <span style={{ color: c.authorColor || '#4ade80', fontSize: '0.83rem', fontWeight: '600' }}>{c.authorName}</span>
                  <span style={{ color: t.textDim, fontSize: '0.73rem' }}>· {new Date(c.createdAt).toLocaleDateString('hu-HU')}</span>
                </div>
                <p style={{ color: t.textSec, fontSize: '0.85rem', lineHeight: 1.65, margin: 0, whiteSpace: 'pre-wrap' }}>{c.content}</p>
              </div>
            </div>
          ))}

          {/* Hozzászólás írása */}
          <div style={{ marginTop: '1.5rem', background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '1.25rem' }}>
            {user ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: user.avatarColor || '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>
                    {user.username[0].toUpperCase()}
                  </div>
                  <span style={{ color: t.textSec, fontSize: '0.83rem', fontWeight: '600' }}>{user.username}</span>
                </div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Írd meg hozzászólásodat..."
                  rows={3}
                  style={{ width: '100%', background: t.bg, border: `1px solid ${t.border}`, borderRadius: '8px', padding: '0.65rem 0.875rem', color: t.text, fontSize: '0.85rem', outline: 'none', resize: 'vertical', lineHeight: 1.65, boxSizing: 'border-box' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                  <button
                    onClick={handleComment}
                    disabled={sending || !comment.trim()}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', fontWeight: '600', fontSize: '0.83rem', cursor: 'pointer', opacity: (sending || !comment.trim()) ? 0.6 : 1 }}
                  >
                    <Send size={14} /> {sending ? 'Küldés...' : 'Hozzászólás'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                <p style={{ color: t.textMuted, fontSize: '0.85rem', marginBottom: '0.75rem' }}>Hozzászóláshoz be kell jelentkezned.</p>
                <button onClick={() => navigate('/login')} style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.5rem 1.25rem', fontWeight: '600', fontSize: '0.83rem', cursor: 'pointer' }}>
                  Bejelentkezés
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default TemaReszletek
