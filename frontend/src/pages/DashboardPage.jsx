import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './DashboardPage.css';

const API_URL = '/api';

const DashboardPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBuilds = async () => {
      try {
        const res = await fetch(`${API_URL}/builds`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setBuilds(data.builds);
        }
      } catch (error) {
        console.error('Failed to fetch builds:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuilds();
  }, [user, token, navigate]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getColorName = (hex) => {
    const colors = {
      '#FF6B35': 'Performance Orange',
      '#000000': 'Midnight Black',
      '#E74C3C': 'Racing Red',
      '#4A90E2': 'Electric Blue',
      '#FFFFFF': 'Pearl White',
      '#666666': 'Gunmetal Gray',
      '#50C878': 'Lime Green',
      '#9B59B6': 'Deep Purple'
    };
    return colors[hex] || hex;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Delete build and update local state
  const deleteBuild = async (buildId) => {
    try {
      const res = await fetch(`${API_URL}/builds/${buildId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setBuilds(builds.filter(b => b._id !== buildId));
      }
    } catch (error) {
      console.error('Failed to delete build:', error);
    } finally {
      setDeleteConfirm(null);
    }
  };

  const editBuild = (build) => {
    localStorage.setItem('editBuild', JSON.stringify({
      id: build._id,
      model: build.carModel,
      modelName: build.modelName,
      bodyColor: build.color,
      wheels: build.selectedParts?.wheels || 'stock',
      spoiler: build.selectedParts?.spoiler || 'none',
      lights: build.selectedParts?.lights || 'halogen',
      exhaust: build.selectedParts?.exhaust || 'stock',
      selectedServices: build.selectedServices || []
    }));
    navigate('/customize');
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dash-greeting">
          <div>
            <h1>{getGreeting()}, <span className="greeting-name">{user.name}</span></h1>
            <p className="greeting-sub">Here are your saved drafts.</p>
          </div>
          <button className="dash-new-btn" onClick={() => navigate('/customize')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            New Draft
          </button>
        </div>

        {loading ? (
          <div className="dash-loading">
            <div className="dash-loading-spinner"></div>
            <p>Loading your builds...</p>
          </div>
        ) : builds.length === 0 ? (
          <div className="dash-empty">
            <div className="empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <path d="M7 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>No drafts yet</h3>
            <p>Head over to the customize page and create your first draft.</p>
            <button className="dash-new-btn" onClick={() => navigate('/customize')}>
              Start Customizing
            </button>
          </div>
        ) : (
          <div className="builds-grid">
            {builds.map((build) => (
              <div key={build._id} className="build-card">
                <div className="build-card-body">
                  <h3 className="build-card-title">{build.modelName || 'Custom Draft'}</h3>
                  <span className="build-card-date">{formatDate(build.updatedAt || build.createdAt)}</span>

                  <div className="build-card-specs">
                    <div className="spec-row">
                      <span className="spec-label">Color</span>
                      <span className="spec-value">
                        <span className="spec-swatch" style={{ backgroundColor: build.color }}></span>
                        {getColorName(build.color)}
                      </span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Wheels</span>
                      <span className="spec-value">{build.selectedParts?.wheels || 'stock'}</span>
                    </div>
                    <div className="spec-row">
                      <span className="spec-label">Spoiler</span>
                      <span className="spec-value">{build.selectedParts?.spoiler || 'none'}</span>
                    </div>
                  </div>

                  <div className="build-card-actions">
                    <button className="action-btn action-edit" onClick={() => editBuild(build)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Edit
                    </button>
                    <button className="action-btn action-delete" onClick={() => setDeleteConfirm(build._id)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteConfirm && (
        <>
          <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}></div>
          <div className="delete-modal">
            <div className="delete-modal-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="delete-modal-title">Delete This Draft?</h3>
            <p className="delete-modal-text">This action cannot be undone. Your draft will be permanently removed.</p>
            <div className="delete-modal-actions">
              <button className="delete-modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button className="delete-modal-confirm" onClick={() => deleteBuild(deleteConfirm)}>Yes, Delete</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
