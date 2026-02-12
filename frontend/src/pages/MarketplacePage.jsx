import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MarketplacePage.css';

const MarketplacePage = () => {
  const { user } = useAuth();
  const [hotCollections, setHotCollections] = useState([]);
  const [regularCollections, setRegularCollections] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const panelRef = useRef(null);

  const API_URL = '/api';

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`${API_URL}/car-models`);
        const data = await res.json();
        if (data.success) {
          const models = data.carModels || [];
          setHotCollections(models.filter(m => m.listingType === 'hot'));
          setRegularCollections(models.filter(m => m.listingType === 'regular'));
        }
      } catch (error) {
        console.error('Failed to load marketplace data:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (selectedCar && panelRef.current && !panelRef.current.contains(e.target)) {
        setSelectedCar(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [selectedCar]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setSelectedCar(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const formatPrice = (price) => {
    return 'LKR ' + Number(price).toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  return (
    <div className="marketplace-page">
      <div className="container">
        <div className="mp-header">
          <div className="mp-greeting">
            <span className="mp-greeting-label">Welcome back,</span>
            <h1 className="mp-greeting-name">{user ? user.name : 'Guest'}</h1>
          </div>
        </div>

        {user && (
          <div className="mp-quick-nav">
            <Link to="/customize" className="mp-nav-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Customize
            </Link>
            <Link to="/drafts" className="mp-nav-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              My Drafts
            </Link>
          </div>
        )}

        <section className="mp-section">
          <h2 className="mp-section-title">Hot Collections</h2>
          <div className="mp-hot-grid">
            {hotCollections.map((car) => (
              <div key={car.id} className="mp-hot-card">
                <div className="mp-hot-card-top">
                  <div>
                    <span className="mp-car-brand">{car.brand}</span>
                    <h3 className="mp-car-model">{car.name}</h3>
                  </div>
                </div>

                <div className="mp-car-image-wrap">
                  <img src={car.image} alt={car.name} className="mp-car-image" loading="lazy" />
                </div>

                <div className="mp-car-specs">
                  <div className="mp-spec">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{car.hp} BHP</span>
                  </div>
                  <div className="mp-spec">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>{car.cc} CC</span>
                  </div>
                  <div className="mp-spec">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{car.speed}</span>
                  </div>
                  <div className="mp-spec">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{car.cylinder} Cyl</span>
                  </div>
                </div>

                <div className="mp-car-footer">
                  <div className="mp-car-price">
                    <span className="mp-price-label">ASKING PRICE</span>
                    <span className="mp-price-value">{formatPrice(car.price)}</span>
                  </div>
                  <div className="mp-car-run">
                    <span className="mp-run-label">Total Run:</span>
                    <span className="mp-run-value">{car.totalRun}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mp-section">
          <h2 className="mp-section-title">Regular Collections</h2>
          <div className="mp-table-wrap">
            <table className="mp-table">
              <thead>
                <tr>
                  <th>CAR MODEL</th>
                  <th>TOTAL RUN</th>
                  <th>CONDITION</th>
                  <th>ASKING PRICE</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {regularCollections.map((car) => (
                  <tr key={car.id}>
                    <td>
                      <div className="mp-car-cell">
                        <img src={car.image} alt={car.name} className="mp-car-thumb" loading="lazy" />
                        <span className="mp-car-name">{car.name}</span>
                      </div>
                    </td>
                    <td>{car.totalRun}</td>
                    <td>
                      {car.condition ? (
                        <span className={`mp-condition mp-condition-${car.condition.toLowerCase().replace(/\s+/g, '-')}`}>
                          {car.condition}
                        </span>
                      ) : (
                        <span className="mp-condition">—</span>
                      )}
                    </td>
                    <td className="mp-price-td">{formatPrice(car.price)}</td>
                    <td>
                      <button className="mp-details-btn" onClick={() => setSelectedCar(car)}>
                        View details
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {selectedCar && (
        <>
          <div className="panel-backdrop" onClick={() => setSelectedCar(null)}></div>
          <div className="detail-panel" ref={panelRef}>
            <button className="panel-close" onClick={() => setSelectedCar(null)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="panel-image-wrap">
              <img src={selectedCar.image} alt={selectedCar.name} className="panel-image" loading="lazy" />
            </div>

            <div className="panel-body">
              <h2 className="panel-title">{selectedCar.name}</h2>
              {selectedCar.condition && (
                <span className={`mp-condition mp-condition-${selectedCar.condition.toLowerCase().replace(/\s+/g, '-')}`}>
                  {selectedCar.condition}
                </span>
              )}

              <p className="panel-desc">{selectedCar.description}</p>

              <div className="panel-specs">
                <div className="panel-spec-row">
                  <span className="panel-spec-label">Price</span>
                  <span className="panel-spec-value panel-price">{formatPrice(selectedCar.price)}</span>
                </div>
                <div className="panel-spec-row">
                  <span className="panel-spec-label">Total Run</span>
                  <span className="panel-spec-value">{selectedCar.totalRun}</span>
                </div>
                {selectedCar.year && (
                  <div className="panel-spec-row">
                    <span className="panel-spec-label">Year</span>
                    <span className="panel-spec-value">{selectedCar.year}</span>
                  </div>
                )}
                {selectedCar.fuelType && (
                  <div className="panel-spec-row">
                    <span className="panel-spec-label">Fuel Type</span>
                    <span className="panel-spec-value">{selectedCar.fuelType}</span>
                  </div>
                )}
                {selectedCar.transmission && (
                  <div className="panel-spec-row">
                    <span className="panel-spec-label">Transmission</span>
                    <span className="panel-spec-value">{selectedCar.transmission}</span>
                  </div>
                )}
                {selectedCar.hp && (
                  <div className="panel-spec-row">
                    <span className="panel-spec-label">Horsepower</span>
                    <span className="panel-spec-value">{selectedCar.hp} BHP</span>
                  </div>
                )}
                {selectedCar.cc && (
                  <div className="panel-spec-row">
                    <span className="panel-spec-label">Engine</span>
                    <span className="panel-spec-value">{selectedCar.cc} CC</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MarketplacePage;
