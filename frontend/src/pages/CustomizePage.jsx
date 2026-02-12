import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CarModelViewer from '../components/CarModelViewer';
import './CustomizePage.css';

const API_URL = '/api';

const CustomizePage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [editingBuildId, setEditingBuildId] = useState(null);
  const [savedMessage, setSavedMessage] = useState('');
  const [modelLoaded, setModelLoaded] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  // Car model search
  const [carModels, setCarModels] = useState([]);
  const [modelSearch, setModelSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedModel, setSelectedModel] = useState({ id: 'porsche-911-turbo-s', name: 'Porsche 911 Turbo S' });
  const searchRef = useRef(null);

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  const [bodyColors, setBodyColors] = useState([]);
  const [wheelOptions, setWheelOptions] = useState([]);
  const [spoilerOptions, setSpoilerOptions] = useState([]);
  const [lightOptions, setLightOptions] = useState([]);
  const [exhaustOptions, setExhaustOptions] = useState([]);

  const [customization, setCustomization] = useState({
    model: 'porsche-911-turbo-s',
    bodyColor: '#FF6B35',
    wheels: 'sport',
    spoiler: 'standard',
    lights: 'led',
    exhaust: 'dual'
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/data/customization.json');
        const data = await res.json();
        setBodyColors(data.bodyColors || []);
        setWheelOptions(data.wheels || []);
        setSpoilerOptions(data.spoilers || []);
        setLightOptions(data.lights || []);
        setExhaustOptions(data.exhausts || []);
      } catch (error) {
        console.error('Failed to load customization config:', error);
      }
    };
    loadConfig();
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await fetch(`${API_URL}/car-models`);
        const data = await res.json();
        if (data.success) {
          setCarModels(data.carModels || []);
        }
      } catch (error) {
        console.error('Failed to fetch car models:', error);
      }
    };
    fetchModels();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch(`${API_URL}/services`);
        const data = await res.json();
        if (data.success) {
          setServices(data.services || []);
        }
      } catch (error) {
        console.error('Failed to fetch services:', error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const editData = localStorage.getItem('editBuild');
    if (editData) {
      const build = JSON.parse(editData);
      setEditingBuildId(build.id);
      setSelectedModel({ id: build.model || 'porsche-911-turbo-s', name: build.modelName || 'Porsche 911 Turbo S' });
      setCustomization({
        model: build.model || 'porsche-911-turbo-s',
        bodyColor: build.bodyColor || '#FF6B35',
        wheels: build.wheels || 'sport',
        spoiler: build.spoiler || 'standard',
        lights: build.lights || 'led',
        exhaust: build.exhaust || 'dual'
      });
      if (build.selectedServices) setSelectedServices(build.selectedServices);
      localStorage.removeItem('editBuild');
    }
  }, []);

  const handleModelLoaded = useCallback(() => {
    setFadeOut(true);
    setTimeout(() => setModelLoaded(true), 500);
  }, []);

  const handleColorChange = (color) => {
    setCustomization({ ...customization, bodyColor: color });
  };

  const handlePartChange = (part, value) => {
    setCustomization({ ...customization, [part]: value });
  };

  // Save customization to database (create or update)
  const handleSave = async () => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    const buildData = {
      carModel: selectedModel.id,
      color: customization.bodyColor,
      selectedParts: {
        wheels: customization.wheels,
        spoiler: customization.spoiler,
        lights: customization.lights,
        exhaust: customization.exhaust
      },
      selectedServices: selectedServices,
      modelName: selectedModel.name,
      modelImage: '/images/test2.webp',
      totalEstimatedCost: totalPrice
    };

    try {
      let res;
      if (editingBuildId) {
        res = await fetch(`${API_URL}/builds/${editingBuildId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(buildData)
        });
        setSavedMessage('Draft updated successfully!');
      } else {
        res = await fetch(`${API_URL}/builds`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(buildData)
        });
        setSavedMessage('Draft saved successfully!');
      }

      const data = await res.json();
      if (!data.success) {
        setSavedMessage(data.message || 'Failed to save build');
        return;
      }

      setEditingBuildId(null);
      setTimeout(() => {
        setSavedMessage('');
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      setSavedMessage('Unable to connect to server');
    }
  };

  const handleReset = () => {
    setCustomization({
      model: 'porsche-911-turbo-s',
      bodyColor: '#FF6B35',
      wheels: 'sport',
      spoiler: 'standard',
      lights: 'led',
      exhaust: 'dual'
    });
    setSelectedModel({ id: 'porsche-911-turbo-s', name: 'Porsche 911 Turbo S' });
    setModelSearch('');
    setSelectedServices([]);
    setEditingBuildId(null);
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const totalPrice = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((sum, s) => sum + s.price, 0);

  const selectedColorName = bodyColors.find(c => c.value === customization.bodyColor)?.name || customization.bodyColor;

  return (
    <div className="customize-page">
      {!modelLoaded && (
        <div className={`customize-loading-overlay ${fadeOut ? 'fade-out' : ''}`}>
          <p className="loading-title">Preparing Your Garage</p>
          <p className="loading-subtitle">Loading 3D model...</p>
          <div className="loading-progress-bg">
            <div className="loading-progress-fill" style={{ width: fadeOut ? '100%' : '60%' }}></div>
          </div>
        </div>
      )}

      <div className="customize-container">
        <div className="preview-section">
          <div className="preview-header">
            <h2>{editingBuildId ? 'Editing Draft' : 'Your Draft'}</h2>
            <span className="preview-model-label">{selectedModel.name}</span>
          </div>

          <div className="car-image-wrapper">
            <CarModelViewer color={customization.bodyColor} onLoaded={handleModelLoaded} />
          </div>

          <div className="build-summary" style={{ borderColor: `${customization.bodyColor}30` }}>
            <div className="summary-item">
              <span className="summary-label">Model</span>
              <span className="summary-value">{selectedModel.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Color</span>
              <span className="summary-value">
                <span className="summary-swatch" style={{ backgroundColor: customization.bodyColor }}></span>
                {selectedColorName}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Wheels</span>
              <span className="summary-value">{wheelOptions.find(w => w.id === customization.wheels)?.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Spoiler</span>
              <span className="summary-value">{spoilerOptions.find(s => s.id === customization.spoiler)?.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Lights</span>
              <span className="summary-value">{lightOptions.find(l => l.id === customization.lights)?.name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Exhaust</span>
              <span className="summary-value">{exhaustOptions.find(e => e.id === customization.exhaust)?.name}</span>
            </div>
            {selectedServices.length > 0 && (
              <div className="summary-item summary-item-highlight">
                <span className="summary-label">Services ({selectedServices.length})</span>
                <span className="summary-value summary-price">LKR {totalPrice.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="controls-section">
          <div className="controls-header">
            <h2>{editingBuildId ? 'Edit Your Draft' : 'Customize Your Build'}</h2>
            <div className="controls-actions">
              <button className="btn-reset" onClick={handleReset}>Reset</button>
              <button className="btn-save" onClick={handleSave}>
                {!user ? 'Login to Save' : editingBuildId ? 'Update Draft' : 'Save Draft'}
              </button>
            </div>
          </div>

          {savedMessage && (
            <div className="save-message">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {savedMessage}
            </div>
          )}

          <div className="control-group">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M7 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M17 17m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M5 17H3v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Car Model
            </h3>
            <div className="model-search-wrapper" ref={searchRef}>
              <div className="model-search-input-wrap" style={{ borderColor: `${customization.bodyColor}40` }}>
                <svg className="model-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <input
                  type="text"
                  className="model-search-input"
                  placeholder="Search car models..."
                  value={modelSearch}
                  onChange={(e) => { setModelSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                />
                {modelSearch && (
                  <button className="model-search-clear" onClick={() => { setModelSearch(''); setShowDropdown(false); }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
              {showDropdown && (
                <div className="model-search-dropdown">
                  {carModels
                    .filter(m => !modelSearch.trim() || m.name.toLowerCase().includes(modelSearch.toLowerCase()) || m.brand.toLowerCase().includes(modelSearch.toLowerCase()))
                    .slice(0, 8)
                    .map(m => (
                      <button
                        key={m.id}
                        className={`model-search-option ${selectedModel.id === m.id ? 'active' : ''}`}
                        onClick={() => {
                          setSelectedModel({ id: m.id, name: m.name });
                          setCustomization(prev => ({ ...prev, model: m.id }));
                          setModelSearch('');
                          setShowDropdown(false);
                        }}
                      >
                        <span className="model-option-name">{m.name}</span>
                        <span className="model-option-brand">{m.brand}</span>
                      </button>
                    ))
                  }
                  {carModels.filter(m => !modelSearch.trim() || m.name.toLowerCase().includes(modelSearch.toLowerCase()) || m.brand.toLowerCase().includes(modelSearch.toLowerCase())).length === 0 && (
                    <div className="model-search-empty">No models found</div>
                  )}
                </div>
              )}
              <div className="model-selected-badge" style={{ background: `${customization.bodyColor}20`, color: customization.bodyColor === '#000000' ? '#999' : customization.bodyColor }}>
                {selectedModel.name}
              </div>
            </div>
          </div>

          <div className="control-group">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="13.5" cy="6.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                <circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="2"/>
                <circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Body Color
            </h3>
            <div className="color-grid">
              {bodyColors.map((color) => (
                <button
                  key={color.value}
                  className={`color-option ${customization.bodyColor === color.value ? 'active' : ''}`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => handleColorChange(color.value)}
                  title={color.name}
                >
                  {customization.bodyColor === color.value && (
                    <span className="check-icon">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke={color.value === '#000000' ? '#fff' : '#000'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Wheels
            </h3>
            <div className="options-grid">
              {wheelOptions.map((option) => (
                <button
                  key={option.id}
                  className={`option-card ${customization.wheels === option.id ? 'active' : ''}`}
                  onClick={() => handlePartChange('wheels', option.id)}
                >
                  <div className="option-name">{option.name}</div>
                  <div className="option-desc">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 17h18M5 17l2-8h10l2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Spoiler
            </h3>
            <div className="options-grid">
              {spoilerOptions.map((option) => (
                <button
                  key={option.id}
                  className={`option-card ${customization.spoiler === option.id ? 'active' : ''}`}
                  onClick={() => handlePartChange('spoiler', option.id)}
                >
                  <div className="option-name">{option.name}</div>
                  <div className="option-desc">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Headlights
            </h3>
            <div className="options-grid">
              {lightOptions.map((option) => (
                <button
                  key={option.id}
                  className={`option-card ${customization.lights === option.id ? 'active' : ''}`}
                  onClick={() => handlePartChange('lights', option.id)}
                >
                  <div className="option-name">{option.name}</div>
                  <div className="option-desc">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="control-group">
            <h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M18 8h1a4 4 0 010 8h-1M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Exhaust System
            </h3>
            <div className="options-grid">
              {exhaustOptions.map((option) => (
                <button
                  key={option.id}
                  className={`option-card ${customization.exhaust === option.id ? 'active' : ''}`}
                  onClick={() => handlePartChange('exhaust', option.id)}
                >
                  <div className="option-name">{option.name}</div>
                  <div className="option-desc">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {services.length > 0 && (
            <div className="control-group">
              <h3>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Modification Services
              </h3>
              <div className="services-list">
                {services.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      className={`service-item ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleService(service.id)}
                    >
                      <div className="service-item-check">
                        {isSelected ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="3" fill="var(--accent-orange)" stroke="var(--accent-orange)" strokeWidth="2"/>
                            <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="3" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
                          </svg>
                        )}
                      </div>
                      <div className="service-item-info">
                        <span className="service-item-name">{service.name}</span>
                        <span className="service-item-desc">{service.description}</span>
                      </div>
                      <span className="service-item-price">LKR {service.price.toLocaleString()}</span>
                    </button>
                  );
                })}
              </div>

              <div className="services-total">
                <span className="services-total-label">
                  Total ({selectedServices.length} service{selectedServices.length !== 1 ? 's' : ''})
                </span>
                <span className="services-total-price">LKR {totalPrice.toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizePage;
