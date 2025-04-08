import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import SearchAutocomplete from './SearchAutocomplete';

const GlobalHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { khandas, searchState, updateSearch } = useAppContext();
  
  // State for mobile menu toggle
  const [menuOpen, setMenuOpen] = useState(false);
  // State for search dropdown
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
  const searchDropdownRef = useRef(null);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setSearchDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle basic search
  const handleSearch = (query) => {
    if (!query?.trim()) return;
    
    updateSearch({
      query,
      filters: {
        ...searchState.filters,
        khandaId: null,
        adhyayaId: null,
        skip: 0
      }
    });
    
    navigate('/search');
    setSearchDropdownOpen(false);
  };

  // Navigate to advanced search
  const goToAdvancedSearch = () => {
    navigate('/search');
    setSearchDropdownOpen(false);
  };

  // Check if the path is active
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-orange-900 text-amber-50 shadow-md">
      {/* Sanskrit invocation at top */}
      <div className="bg-orange-950 text-center py-1">
        <div className="text-sm font-serif tracking-wide">
          <span className="mr-1">॥ श्री सीतारामचन्द्राभ्यां नमः ॥</span>
        </div>
      </div>
      
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex flex-col">
              <h1 className="text-2xl font-serif font-bold">रामायण तत्त्वानुक्रमणिका</h1>
              <h2 className="text-lg">Ramayana Tagging Engine</h2>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="block lg:hidden">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center px-3 py-2 border rounded border-orange-400 hover:border-white"
            >
              <svg className="fill-current h-4 w-4" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/>
              </svg>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className={`w-full lg:flex lg:items-center lg:w-auto ${menuOpen ? 'block' : 'hidden'} lg:block mt-4 lg:mt-0`}>
            <div className="text-md lg:flex-grow">
              <ul className="lg:flex space-y-2 lg:space-y-0">
                <li className="lg:mr-8">
                  <Link 
                    to="/" 
                    className={`block mt-4 lg:inline-block lg:mt-0 hover:text-orange-200 transition ${isActive('/') ? 'text-orange-200 font-bold' : ''}`}
                  >
                    Home
                  </Link>
                </li>
                <li className="lg:mr-8">
                  <div className="relative">
                    <span 
                      className={`block mt-4 lg:inline-block lg:mt-0 hover:text-orange-200 cursor-pointer transition ${isActive('/read') ? 'text-orange-200 font-bold' : ''}`}
                      onMouseEnter={() => document.getElementById('khaandas-dropdown').classList.remove('hidden')}
                    >
                      Browse Khaandas
                    </span>
                    {khandas && khandas.length > 0 && (
                      <div 
                        id="khaandas-dropdown"
                        className="absolute z-10 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden"
                        onMouseEnter={(e) => e.currentTarget.classList.remove('hidden')}
                        onMouseLeave={(e) => e.currentTarget.classList.add('hidden')}
                      >
                        <div className="py-1">
                          {khandas.map((khanda) => (
                            <Link
                              key={khanda.id}
                              to={`/read/${khanda.id}/${khanda.adhyayas?.[0]?.id || 1}`}
                              className="block px-4 py-2 text-sm text-orange-900 hover:bg-orange-100"
                            >
                              {khanda.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </li>
              </ul>
            </div>

            {/* Inline Search Bar and Advanced Search */}
            <div className="flex items-center space-x-2 mt-4 lg:mt-0">
              <div className="relative w-56 lg:w-64">
                <SearchAutocomplete
                  onSearch={handleSearch}
                  placeholder="Search for tags..."
                  className="w-full"
                />
              </div>
              
              <Link 
                to="/search"
                className="whitespace-nowrap px-4 py-2 rounded-full border-2 border-orange-300 text-white hover:bg-orange-800 transition flex items-center"
              >
                Advanced Search
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
