import React, { useState, useEffect } from 'react';
import { Bookmark, Clock, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAuthPrompt } from '../context/AuthPromptContext';
import { LinkedInSearchAdapter } from '../services/search/linkedinAdapter';
import { 
  SearchCriteria, SearchCategory, OptimizedSearchResult, 
  SavedSearchItem, SearchHistoryItem, SearchPack 
} from '../services/search/types';
import { STUDENT_PRESETS, SearchStorage } from '../services/search/searchStorage';

// Modular LinkedIn Subcomponents
import { LinkedInSearchHeader } from '../components/search/linkedin/LinkedInSearchHeader';
import { LinkedInCriteriaForm } from '../components/search/linkedin/LinkedInCriteriaForm';
import { LinkedInSearchPreview } from '../components/search/linkedin/LinkedInSearchPreview';
import { LinkedInDestinationGrid } from '../components/search/linkedin/LinkedInDestinationGrid';
import { LinkedInSavedSearches } from '../components/search/linkedin/LinkedInSavedSearches';
import { LinkedInSearchHistory } from '../components/search/linkedin/LinkedInSearchHistory';

export const LinkedInSearchPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();

  // Active Category or Search Pack
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');

  // Active Tab: Search Builder vs Saved Searches vs History
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'history'>('search');

  // Criteria State
  const [criteria, setCriteria] = useState<SearchCriteria>({
    role: 'Java Developer',
    skills: ['Java', 'SQL', 'Spring Boot'],
    coreSkills: ['Java', 'SQL', 'Spring Boot'],
    supportingSkills: [],
    keywords: '',
    experience: 'fresher',
    location: 'Bengaluru',
    workMode: 'any',
    employmentType: 'full_time',
    datePosted: 'past_24h',
    company: '',
    targetCompanies: [],
    industry: '',
    easyApplyOnly: false,
    under10Applicants: false,
    searchMode: 'smart',
    useSynonyms: true,
    synonyms: ['Java Developer', 'Java Backend Developer', 'Backend Developer'],
    excludeSeniorRoles: false,
    education: {
      includeInQuery: true,
      degree: 'B.Tech / B.E.',
      field: 'Computer Science',
      graduationYear: '2026',
      studyStatus: 'Final Year'
    }
  });

  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([]);
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Load history & saved items on mount
  useEffect(() => {
    setSavedSearches(SearchStorage.getSavedSearches());
    setHistoryItems(SearchStorage.getHistory());
  }, []);

  // Update synonyms when role changes
  useEffect(() => {
    if (criteria.role) {
      const autoSyns = LinkedInSearchAdapter.getRoleSynonyms(criteria.role);
      setCriteria(prev => ({
        ...prev,
        synonyms: autoSyns
      }));
    }
  }, [criteria.role]);

  // Handle Preset selection
  const handleApplyPreset = (presetName: string) => {
    const preset = STUDENT_PRESETS[presetName];
    if (preset) {
      const nextSkills = preset.skills || [];
      setCriteria(prev => ({
        ...prev,
        ...preset,
        skills: nextSkills,
        coreSkills: nextSkills.slice(0, 3),
        supportingSkills: nextSkills.slice(3),
        searchMode: 'smart',
        useSynonyms: true,
        excludeSeniorRoles: false,
        education: {
          ...prev.education,
          ...(preset.education || {})
        }
      }));
    }
  };

  // Profile-aware search autofill (CRITICAL: Does NOT modify profile database)
  const handleUseProfile = () => {
    if (!isAuthenticated) return;
    setCriteria(prev => ({
      ...prev,
      experience: 'fresher',
      location: 'Bengaluru',
      workMode: 'any',
      education: {
        ...prev.education,
        includeInQuery: true,
        degree: 'B.Tech / B.E.',
        field: 'Computer Science',
        graduationYear: '2026'
      }
    }));
    setSaveSuccessMsg('Profile criteria loaded into search builder!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Build unified search pack
  const searchPack: SearchPack = LinkedInSearchAdapter.buildSearchPack(criteria);

  const currentSingleResult: OptimizedSearchResult = 
    activeCategory === 'jobs' ? searchPack.jobs :
    activeCategory === 'posts' ? searchPack.posts :
    activeCategory === 'people' ? searchPack.people :
    activeCategory === 'companies' ? searchPack.companies :
    activeCategory === 'events' ? searchPack.events : searchPack.courses;

  // Launch LinkedIn Search
  const handleLaunchSearch = (result: OptimizedSearchResult) => {
    if (!criteria.role?.trim()) {
      alert('Please enter a Target Role to search on LinkedIn.');
      return;
    }
    SearchStorage.addHistory(criteria, result.category, result.queryUsed);
    setHistoryItems(SearchStorage.getHistory());
    window.open(result.url, '_blank', 'noopener,noreferrer');
  };

  // Save Search Handler
  const handleSaveSearch = () => {
    if (!isAuthenticated) {
      openAuthPrompt({
        title: `Create your free profile to save this LinkedIn search`,
        description: `Save '${criteria.role || 'Career'} in ${criteria.location || 'Anywhere'}' and receive alerts when new matching roles appear.`
      });
      return;
    }

    const searchName = `${criteria.role || 'Search'} — ${criteria.location || 'Anywhere'} (${criteria.searchMode === 'boolean' ? 'Boolean' : 'Smart'})`;
    const saved = SearchStorage.saveSearch(searchName, criteria, activeCategory);
    setSavedSearches(SearchStorage.getSavedSearches());
    setSaveSuccessMsg(`Saved "${saved.name}" to your workspace!`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  // Load Criteria from Saved/History
  const handleLoadCriteria = (loadedCriteria: SearchCriteria, category: SearchCategory) => {
    setCriteria(loadedCriteria);
    setActiveCategory(category);
    setActiveTab('search');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* 1. Header & Presets */}
      <LinkedInSearchHeader
        isAuthenticated={isAuthenticated}
        onApplyPreset={handleApplyPreset}
        onUseProfile={handleUseProfile}
      />

      {/* 2. Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-border/80">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'search' 
                ? 'border-accent-primary text-accent-primary font-bold' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search Builder & Pack</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'saved' 
                ? 'border-accent-primary text-accent-primary font-bold' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Saved Searches</span>
            {savedSearches.length > 0 && (
              <span className="text-xs font-mono px-1.5 py-0.2 rounded-full bg-surface border border-border">
                {savedSearches.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'history' 
                ? 'border-accent-primary text-accent-primary font-bold' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Search History</span>
            {historyItems.length > 0 && (
              <span className="text-xs font-mono px-1.5 py-0.2 rounded-full bg-surface border border-border">
                {historyItems.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: SEARCH BUILDER & PACK */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Destination Selector & Pack Header */}
          <LinkedInDestinationGrid
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchPack={searchPack}
            onLaunchSearch={handleLaunchSearch}
          />

          {/* Form and Preview Grid */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Criteria Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <LinkedInCriteriaForm
                criteria={criteria}
                setCriteria={setCriteria}
              />
            </div>

            {/* Right Column: Search Preview & Action Panel (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <LinkedInSearchPreview
                criteria={criteria}
                singleResult={currentSingleResult}
                onLaunchSearch={handleLaunchSearch}
                onSaveSearch={handleSaveSearch}
                saveSuccessMsg={saveSuccessMsg}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAVED SEARCHES */}
      {activeTab === 'saved' && (
        <LinkedInSavedSearches
          savedSearches={savedSearches}
          setSavedSearches={setSavedSearches}
          onLoadCriteria={handleLoadCriteria}
          onNavigateToBuilder={() => setActiveTab('search')}
        />
      )}

      {/* TAB 3: SEARCH HISTORY */}
      {activeTab === 'history' && (
        <LinkedInSearchHistory
          historyItems={historyItems}
          setHistoryItems={setHistoryItems}
          onLoadCriteria={handleLoadCriteria}
          onLaunchSearch={handleLaunchSearch}
          onNavigateToBuilder={() => setActiveTab('search')}
        />
      )}
    </div>
  );
};
