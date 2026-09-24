import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, ExternalLink, Bookmark, Clock, Copy, Check, 
  ChevronDown, ChevronUp, RefreshCw, GraduationCap, MapPin, 
  Briefcase, Users, Building, Video, BookOpen, Layers, ShieldAlert,
  Info, Sliders
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useAuthPrompt } from '../context/AuthPromptContext';
import { 
  LinkedInSearchAdapter, SENIOR_EXCLUSION_TERMS 
} from '../services/search/linkedinAdapter';
import { 
  SearchCriteria, SearchCategory, OptimizedSearchResult, 
  SavedSearchItem, SearchHistoryItem, SearchPack 
} from '../services/search/types';
import { 
  STUDENT_PRESETS, BRANCH_SUGGESTIONS, SearchStorage 
} from '../services/search/searchStorage';

const COMMON_DEGREES = [
  'B.Tech / B.E.', 'BCA', 'B.Sc. Computer Science', 'B.Sc.', 'B.Com', 
  'BBA', 'MCA', 'M.Tech / M.E.', 'M.Sc.', 'MBA', 'Diploma', 'Other'
];

const COMMON_BRANCHES = [
  'Computer Science', 'Information Technology', 'Data Science', 
  'Artificial Intelligence', 'Electronics & Communication', 
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 
  'Business / Management', 'Other'
];

const GRADUATION_YEARS = ['2024', '2025', '2026', '2027', '2028', '2029', '2030'];

export const LinkedInSearchPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();

  // Active Category or Search Pack
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');

  // Search Criteria State
  const [criteria, setCriteria] = useState<SearchCriteria>({
    role: 'Java Developer',
    skills: ['Java', 'SQL', 'Spring Boot'],
    keywords: '',
    experience: 'fresher',
    location: 'Bengaluru',
    workMode: 'any',
    employmentType: 'full_time',
    datePosted: 'past_24h',
    company: '',
    industry: '',
    easyApplyOnly: false,
    under10Applicants: false,
    searchMode: 'smart',
    useSynonyms: true,
    synonyms: ['Java Developer', 'Java Backend Developer', 'Backend Developer'],
    excludeSeniorRoles: true,
    customExclusions: SENIOR_EXCLUSION_TERMS,
    education: {
      includeInQuery: true,
      degree: 'B.Tech',
      field: 'Computer Science',
      graduationYear: '2026',
      studyStatus: 'Final Year'
    }
  });

  const [skillInput, setSkillInput] = useState('');
  const [synonymInput, setSynonymInput] = useState('');
  const [showAdvancedEdu, setShowAdvancedEdu] = useState(false);
  const [showSynonymPanel, setShowSynonymPanel] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'history'>('search');
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
  const applyPreset = (presetName: string) => {
    const preset = STUDENT_PRESETS[presetName];
    if (preset) {
      setCriteria(prev => ({
        ...prev,
        ...preset,
        searchMode: 'smart',
        useSynonyms: true,
        education: {
          ...prev.education,
          ...(preset.education || {})
        }
      }));
    }
  };

  // Add / remove skill
  const handleAddSkill = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault();
      const newSkill = skillInput.trim().replace(/^,+|,+$/g, '');
      if (newSkill && !criteria.skills.includes(newSkill)) {
        setCriteria(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setCriteria(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  // Add / remove synonym
  const handleAddSynonym = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && synonymInput.trim()) {
      e.preventDefault();
      const newSyn = synonymInput.trim();
      const current = criteria.synonyms || [];
      if (!current.includes(newSyn)) {
        setCriteria(prev => ({ ...prev, synonyms: [...current, newSyn] }));
      }
      setSynonymInput('');
    }
  };

  const removeSynonym = (synToRemove: string) => {
    setCriteria(prev => ({
      ...prev,
      synonyms: (prev.synonyms || []).filter(s => s !== synToRemove)
    }));
  };

  // Dynamic branch suggestions
  const suggestedRoles = criteria.education?.field 
    ? (BRANCH_SUGGESTIONS[criteria.education.field] || []) 
    : [];

  // Generate Search Pack and single results
  const searchPack: SearchPack = LinkedInSearchAdapter.buildSearchPack(criteria);

  const currentSingleResult: OptimizedSearchResult = 
    activeCategory === 'jobs' ? searchPack.jobs :
    activeCategory === 'posts' ? searchPack.posts :
    activeCategory === 'people' ? searchPack.people :
    activeCategory === 'companies' ? searchPack.companies :
    activeCategory === 'events' ? searchPack.events : searchPack.courses;

  // Launch LinkedIn Search
  const handleLaunchSearch = (result: OptimizedSearchResult) => {
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

  const handleCopyQuery = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedQuery(true);
    setTimeout(() => setCopiedQuery(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* 1. Header & Architectural Positioning */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono text-accent-primary mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SEARCH INTENT OPTIMIZER • PUBLIC & GUEST ACCESSIBLE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            LinkedIn Optimized Search
          </h1>
          <p className="text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
            Construct high-precision LinkedIn searches from your target role, education, skills, and preferences. 
            VEXTRALOOM optimizes your search intent and filters before opening the official LinkedIn destination.
          </p>
          <p className="text-xs text-text-muted mt-2 font-mono">
            * VEXTRALOOM does not control LinkedIn's internal ranking algorithm. Results open directly on official LinkedIn domains.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start">
          <Badge variant={isAuthenticated ? 'success' : 'outline'} className="text-xs py-1">
            {isAuthenticated ? 'Profile Linked' : 'Guest Mode (No Login Required)'}
          </Badge>
        </div>
      </div>

      {/* Tabs: Search Builder vs Saved Searches vs History */}
      <div className="flex items-center justify-between border-b border-border/80">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('search')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'search' 
                ? 'border-accent-primary text-accent-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            Search Builder & Pack
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'saved' 
                ? 'border-accent-primary text-accent-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved Searches
            {savedSearches.length > 0 && (
              <span className="text-xs font-mono px-1.5 py-0.2 rounded-full bg-surface border border-border">
                {savedSearches.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'history' 
                ? 'border-accent-primary text-accent-primary' 
                : 'border-transparent text-text-secondary hover:text-text-primary'
            }`}
          >
            <Clock className="w-4 h-4" />
            Search History
          </button>
        </div>
      </div>

      {/* TAB 1: SEARCH BUILDER */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search Mode Toggle & Presets Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-text-muted uppercase font-semibold">Mode:</span>
              <div className="inline-flex p-1 rounded-lg bg-surface-elevated border border-border">
                <button
                  type="button"
                  onClick={() => setCriteria(prev => ({ ...prev, searchMode: 'smart' }))}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    criteria.searchMode !== 'boolean'
                      ? 'bg-accent-primary text-background font-bold shadow-glow-primary/20'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  🧠 Smart Search (Natural Intent)
                </button>
                <button
                  type="button"
                  onClick={() => setCriteria(prev => ({ ...prev, searchMode: 'boolean' }))}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                    criteria.searchMode === 'boolean'
                      ? 'bg-accent-secondary text-white font-bold shadow-glow-secondary/20'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  🎯 Precision Boolean (Exact)
                </button>
              </div>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] font-mono text-text-muted shrink-0">Presets:</span>
              {Object.keys(STUDENT_PRESETS).slice(0, 4).map(name => (
                <button
                  key={name}
                  onClick={() => applyPreset(name)}
                  className="px-2.5 py-1 rounded-md bg-surface-elevated border border-border hover:border-accent-primary/50 text-[11px] font-medium text-text-secondary hover:text-text-primary transition-all shrink-0"
                >
                  ⚡ {name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Category / Search Pack View Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
                View & Launch Destination
              </label>
              <span className="text-xs text-text-muted font-mono">
                Category-tailored queries & filters
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                { id: 'all', label: 'All-in-One Pack', icon: Layers },
                { id: 'jobs', label: 'Jobs', icon: Briefcase },
                { id: 'posts', label: 'Hiring Posts', icon: Search },
                { id: 'people', label: 'Recruiters', icon: Users },
                { id: 'companies', label: 'Companies', icon: Building },
                { id: 'events', label: 'Events', icon: Video },
                { id: 'courses', label: 'Courses', icon: BookOpen },
              ].map(cat => {
                const Icon = cat.icon;
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as SearchCategory)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-accent-primary/10 border-accent-primary text-accent-primary shadow-glow-primary/20'
                        : 'bg-surface border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                    }`}
                  >
                    <Icon className="w-4 h-4 mb-1.5" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Grid: Form Inputs (7 cols) & Execution Panel (5 cols) */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Criteria Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Career Target & Role Synonyms */}
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-accent-primary" />
                      <h3 className="font-semibold text-sm text-text-primary">Career Target & Role</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowSynonymPanel(!showSynonymPanel)}
                      className="text-xs text-text-secondary hover:text-accent-primary flex items-center gap-1"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{showSynonymPanel ? 'Hide Synonyms' : 'Synonym Expansion'}</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Target Role *</label>
                    <Input 
                      placeholder="e.g. Java Developer, Frontend Engineer, Cloud Trainee" 
                      value={criteria.role}
                      onChange={e => setCriteria(prev => ({ ...prev, role: e.target.value }))}
                    />
                    {suggestedRoles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        <span className="text-[11px] text-text-muted self-center">Branch Suggestions:</span>
                        {suggestedRoles.slice(0, 4).map(sRole => (
                          <button
                            key={sRole}
                            type="button"
                            onClick={() => setCriteria(prev => ({ ...prev, role: sRole }))}
                            className="text-[11px] px-2 py-0.5 rounded bg-surface border border-border text-text-secondary hover:text-accent-primary hover:border-accent-primary/40 transition-colors"
                          >
                            + {sRole}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Controlled Synonym Expansion Panel */}
                  {showSynonymPanel && (
                    <div className="p-3.5 rounded-xl bg-surface border border-border/80 space-y-2 animate-fade-in text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-text-primary">Role Synonym Expansion</span>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={criteria.useSynonyms ?? true}
                            onChange={e => setCriteria(prev => ({ ...prev, useSynonyms: e.target.checked }))}
                            className="rounded border-border text-accent-primary focus:ring-accent-primary"
                          />
                          <span className="text-text-muted">Enable in Query</span>
                        </label>
                      </div>
                      <p className="text-[11px] text-text-secondary leading-relaxed">
                        Expands search to include equivalent role titles while avoiding keyword dilution.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(criteria.synonyms || []).map(syn => (
                          <span key={syn} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-elevated border border-border font-mono text-[11px] text-text-secondary">
                            {syn}
                            <button 
                              type="button"
                              onClick={() => removeSynonym(syn)}
                              className="text-text-muted hover:text-error ml-1"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2 pt-1">
                        <input 
                          placeholder="Add custom synonym and press Enter" 
                          className="flex-1 bg-surface border border-border rounded px-2.5 py-1 text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                          value={synonymInput}
                          onChange={e => setSynonymInput(e.target.value)}
                          onKeyDown={handleAddSynonym}
                        />
                      </div>
                    </div>
                  )}

                  {/* Skills input (1-3 core skills prioritized) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-text-secondary">Key Skills (1–3 Core Skills Recommended)</label>
                      <span className="text-[10px] text-text-muted font-mono">Avoid keyword stuffing</span>
                    </div>
                    <Input 
                      placeholder="Type skill and press Enter (e.g. Java, SQL, Spring Boot)"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {criteria.skills.map((skill, idx) => (
                        <span 
                          key={skill}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-xs font-mono ${
                            idx < 3 
                              ? 'bg-accent-primary/10 border-accent-primary/30 text-accent-primary' 
                              : 'bg-surface border-border text-text-secondary'
                          }`}
                        >
                          {idx < 3 ? `★ ${skill}` : skill}
                          <button 
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="text-text-muted hover:text-error ml-1 text-xs"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Exclusions Logic */}
                  <div className="pt-2 border-t border-border/40">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs">
                      <input 
                        type="checkbox"
                        checked={criteria.excludeSeniorRoles ?? false}
                        onChange={e => setCriteria(prev => ({ ...prev, excludeSeniorRoles: e.target.checked }))}
                        className="mt-0.5 rounded border-border text-accent-secondary focus:ring-accent-secondary"
                      />
                      <div>
                        <span className="font-semibold text-text-primary flex items-center gap-1">
                          <ShieldAlert className="w-3.5 h-3.5 text-warning" />
                          Exclude Senior & Management Roles
                        </span>
                        <p className="text-text-muted text-[11px] mt-0.5">
                          Adds Boolean exclusion: <code className="font-mono text-warning">NOT (Senior OR Lead OR Manager OR Architect)</code> in Precision Mode.
                        </p>
                      </div>
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Education & Student Context */}
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-accent-secondary" />
                      <h3 className="font-semibold text-sm text-text-primary">Education & Student Context</h3>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input 
                        type="checkbox"
                        checked={criteria.education?.includeInQuery ?? true}
                        onChange={e => setCriteria(prev => ({
                          ...prev,
                          education: {
                            ...prev.education,
                            includeInQuery: e.target.checked
                          }
                        }))}
                        className="rounded border-border text-accent-primary focus:ring-accent-primary"
                      />
                      <span className="text-text-secondary">Include in search intent</span>
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Degree</label>
                      <select 
                        className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        value={criteria.education?.degree || ''}
                        onChange={e => setCriteria(prev => ({
                          ...prev,
                          education: { ...prev.education, degree: e.target.value }
                        }))}
                      >
                        <option value="">Select Degree</option>
                        {COMMON_DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Branch / Field</label>
                      <select 
                        className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        value={criteria.education?.field || ''}
                        onChange={e => setCriteria(prev => ({
                          ...prev,
                          education: { ...prev.education, field: e.target.value }
                        }))}
                      >
                        <option value="">Select Field</option>
                        {COMMON_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Graduation Year</label>
                      <select 
                        className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        value={criteria.education?.graduationYear || ''}
                        onChange={e => setCriteria(prev => ({
                          ...prev,
                          education: { ...prev.education, graduationYear: e.target.value }
                        }))}
                      >
                        <option value="">Graduation Year</option>
                        {GRADUATION_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Progressive Disclosure */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedEdu(!showAdvancedEdu)}
                      className="text-xs text-text-secondary hover:text-text-primary inline-flex items-center gap-1 transition-colors"
                    >
                      <span>{showAdvancedEdu ? 'Hide extra details' : '+ Add college / study status'}</span>
                      {showAdvancedEdu ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {showAdvancedEdu && (
                      <div className="grid sm:grid-cols-2 gap-3 pt-3 animate-fade-in">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-text-secondary">College / University</label>
                          <Input 
                            placeholder="e.g. State University, IIT, NIT" 
                            value={criteria.education?.college || ''}
                            onChange={e => setCriteria(prev => ({
                              ...prev,
                              education: { ...prev.education, college: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-text-secondary">Study Status</label>
                          <select 
                            className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                            value={criteria.education?.studyStatus || ''}
                            onChange={e => setCriteria(prev => ({
                              ...prev,
                              education: { ...prev.education, studyStatus: e.target.value }
                            }))}
                          >
                            <option value="">Select Status</option>
                            <option value="1st Year">1st Year</option>
                            <option value="2nd Year">2nd Year</option>
                            <option value="3rd Year">3rd Year</option>
                            <option value="Final Year">Final Year</option>
                            <option value="Recently Graduated">Recently Graduated</option>
                            <option value="Postgraduate">Postgraduate</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Location & LinkedIn Dedicated Filters */}
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <MapPin className="w-4 h-4 text-success" />
                    <h3 className="font-semibold text-sm text-text-primary">Location & Dedicated LinkedIn Filters</h3>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Location</label>
                      <Input 
                        placeholder="e.g. Bengaluru, India or Remote"
                        value={criteria.location}
                        onChange={e => setCriteria(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Work Mode</label>
                      <select 
                        className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        value={criteria.workMode}
                        onChange={e => setCriteria(prev => ({ ...prev, workMode: e.target.value as any }))}
                      >
                        <option value="any">Any Work Mode</option>
                        <option value="remote">Remote (f_WT=2)</option>
                        <option value="hybrid">Hybrid (f_WT=3)</option>
                        <option value="onsite">On-site (f_WT=1)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Experience</label>
                      <select 
                        className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        value={criteria.experience}
                        onChange={e => setCriteria(prev => ({ ...prev, experience: e.target.value as any }))}
                      >
                        <option value="student">Student / Intern (f_E=1)</option>
                        <option value="fresher">Fresher / Entry (f_E=1,2)</option>
                        <option value="entry_level">Entry Level (f_E=2)</option>
                        <option value="associate">Associate (f_E=3)</option>
                        <option value="mid_level">Mid-Senior (f_E=4)</option>
                        <option value="any">Any Experience</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Employment</label>
                      <select 
                        className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        value={criteria.employmentType}
                        onChange={e => setCriteria(prev => ({ ...prev, employmentType: e.target.value as any }))}
                      >
                        <option value="full_time">Full-time (f_JT=F)</option>
                        <option value="internship">Internship (f_JT=I)</option>
                        <option value="part_time">Part-time (f_JT=P)</option>
                        <option value="contract">Contract (f_JT=C)</option>
                        <option value="any">Any Employment</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Date Posted</label>
                      <select 
                        className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        value={criteria.datePosted}
                        onChange={e => setCriteria(prev => ({ ...prev, datePosted: e.target.value as any }))}
                      >
                        <option value="past_24h">Past 24 hours (f_TPR=r86400)</option>
                        <option value="past_week">Past 7 days (f_TPR=r604800)</option>
                        <option value="past_month">Past 30 days (f_TPR=r2592000)</option>
                        <option value="any">Any time</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2 border-t border-border/40 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={criteria.easyApplyOnly}
                        onChange={e => setCriteria(prev => ({ ...prev, easyApplyOnly: e.target.checked }))}
                        className="rounded border-border text-accent-primary focus:ring-accent-primary"
                      />
                      <span className="text-text-secondary">Easy Apply / LinkedIn Apply (f_AL)</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={criteria.under10Applicants}
                        onChange={e => setCriteria(prev => ({ ...prev, under10Applicants: e.target.checked }))}
                        className="rounded border-border text-accent-primary focus:ring-accent-primary"
                      />
                      <span className="text-text-secondary">Under 10 Applicants (f_EA)</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Search Pack Preview & Direct Execution (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <Card className="border-accent-primary/40 shadow-glow-primary/10 relative overflow-hidden bg-surface-elevated">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />
                
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-accent-primary font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      SEARCH PACK PREVIEW
                    </span>
                    <Badge variant={criteria.searchMode === 'boolean' ? 'warning' : 'success'} className="text-[10px] uppercase font-mono">
                      {criteria.searchMode === 'boolean' ? 'PRECISION BOOLEAN' : 'SMART INTENT'}
                    </Badge>
                  </div>

                  {/* WHY THIS SEARCH: Educational Explanation Box */}
                  <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-accent-primary font-semibold">
                      <Info className="w-3.5 h-3.5" />
                      <span>WHY THIS SEARCH</span>
                    </div>
                    <p className="text-text-secondary leading-relaxed text-[11px]">
                      {searchPack.explanation}
                    </p>
                  </div>

                  {/* If All-in-One Pack is Active: Show All 6 Tailored Cards */}
                  {activeCategory === 'all' ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-text-muted font-mono">
                        <span>6 OPTIMIZED DESTINATIONS READY</span>
                        <button
                          type="button"
                          onClick={() => handleCopyQuery(searchPack.jobs.queryUsed)}
                          className="hover:text-accent-primary flex items-center gap-1"
                        >
                          {copiedQuery ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                          <span>Copy Jobs Query</span>
                        </button>
                      </div>

                      <div className="space-y-2.5 max-h-[440px] overflow-y-auto pr-1">
                        {[
                          { res: searchPack.jobs, icon: Briefcase, color: 'text-accent-primary' },
                          { res: searchPack.posts, icon: Search, color: 'text-accent-secondary' },
                          { res: searchPack.people, icon: Users, color: 'text-success' },
                          { res: searchPack.companies, icon: Building, color: 'text-text-primary' },
                          { res: searchPack.events, icon: Video, color: 'text-warning' },
                          { res: searchPack.courses, icon: BookOpen, color: 'text-info' },
                        ].map(({ res, icon: Icon, color }) => (
                          <div 
                            key={res.category}
                            className="p-3.5 rounded-xl bg-surface border border-border hover:border-accent-primary/40 transition-all flex flex-col gap-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold flex items-center gap-1.5 ${color}`}>
                                <Icon className="w-3.5 h-3.5" />
                                {res.label}
                              </span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="h-7 px-2.5 text-xs gap-1 hover:border-accent-primary hover:text-accent-primary"
                                onClick={() => handleLaunchSearch(res)}
                              >
                                Search <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                            <p className="text-[11px] font-mono text-text-secondary bg-surface-elevated p-2 rounded border border-border/50 truncate">
                              "{res.queryUsed}"
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Save Search */}
                      <div className="pt-2 border-t border-border/60 flex items-center justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-text-secondary hover:text-text-primary gap-1.5"
                          onClick={handleSaveSearch}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save this search pack</span>
                        </Button>
                        <span className="text-[11px] text-text-muted">Official LinkedIn</span>
                      </div>
                    </div>
                  ) : (
                    /* Single Category View */
                    <div className="space-y-4">
                      {/* Active Result Details */}
                      <div className="p-3.5 rounded-xl bg-surface border border-border space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-text-primary">{currentSingleResult.label}</span>
                          <span className="font-mono text-[11px] text-text-muted">Direct Official Destination</span>
                        </div>
                        <p className="text-[11px] text-text-secondary">
                          {currentSingleResult.description}
                        </p>
                        {currentSingleResult.appliedFiltersSummary.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {currentSingleResult.appliedFiltersSummary.map((f, i) => (
                              <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-elevated border border-border text-text-muted">
                                {f}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Query Display */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-text-muted font-mono uppercase">Optimized Intent Query</span>
                          <button
                            type="button"
                            onClick={() => handleCopyQuery(currentSingleResult.queryUsed)}
                            className="text-text-secondary hover:text-accent-primary inline-flex items-center gap-1 transition-colors text-[11px]"
                          >
                            {copiedQuery ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedQuery ? 'Copied' : 'Copy Query'}</span>
                          </button>
                        </div>
                        <div className="p-3 rounded-lg bg-surface border border-border text-xs font-mono text-accent-primary leading-relaxed break-words">
                          "{currentSingleResult.queryUsed || 'No keywords specified'}"
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        size="lg" 
                        variant="primary" 
                        className="w-full gap-2 justify-center shadow-glow-primary/30"
                        onClick={() => handleLaunchSearch(currentSingleResult)}
                      >
                        <span>Search {currentSingleResult.label} on LinkedIn</span>
                        <ExternalLink className="w-4 h-4" />
                      </Button>

                      <div className="flex items-center justify-between pt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-text-secondary hover:text-text-primary gap-1.5"
                          onClick={handleSaveSearch}
                        >
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Save this search configuration</span>
                        </Button>
                        <span className="text-[11px] text-text-muted">Official LinkedIn Tab</span>
                      </div>
                    </div>
                  )}

                  {saveSuccessMsg && (
                    <div className="p-2.5 rounded-lg bg-success/10 border border-success/30 text-xs text-success text-center">
                      ✓ {saveSuccessMsg}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAVED SEARCHES */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">Saved LinkedIn Searches</h2>
            <span className="text-xs text-text-muted font-mono">{savedSearches.length} Saved</span>
          </div>

          {savedSearches.length === 0 ? (
            <div className="py-16 text-center text-text-muted rounded-2xl bg-surface border border-border">
              <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-30 text-accent-primary" />
              <h3 className="font-semibold text-text-primary mb-1">No Saved Searches Yet</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
                Build an optimized search and click "Save this search configuration" to access it quickly anytime.
              </p>
              <Button size="sm" variant="outline" onClick={() => setActiveTab('search')}>
                Back to Search Builder
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedSearches.map(item => (
                <Card key={item.id} className="hover:border-accent-primary/50 transition-all">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-sm text-text-primary line-clamp-1">{item.name}</h4>
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">{item.category}</Badge>
                    </div>
                    <div className="text-xs text-text-secondary space-y-1">
                      <p>Role: <span className="text-text-primary">{item.criteria.role}</span></p>
                      <p>Location: <span className="text-text-primary">{item.criteria.location}</span></p>
                      {item.criteria.skills?.length > 0 && (
                        <p className="truncate">Skills: <span className="text-text-muted">{item.criteria.skills.join(', ')}</span></p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-border/60">
                      <button
                        onClick={() => {
                          setCriteria(item.criteria);
                          setActiveCategory(item.category);
                          setActiveTab('search');
                        }}
                        className="text-xs text-accent-primary hover:underline font-medium"
                      >
                        Load Criteria →
                      </button>
                      <button
                        onClick={() => {
                          SearchStorage.deleteSavedSearch(item.id);
                          setSavedSearches(SearchStorage.getSavedSearches());
                        }}
                        className="text-xs text-text-muted hover:text-error"
                      >
                        Delete
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SEARCH HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">Recent LinkedIn Search History</h2>
            {historyItems.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-text-muted hover:text-error"
                onClick={() => {
                  SearchStorage.clearHistory();
                  setHistoryItems([]);
                }}
              >
                Clear History
              </Button>
            )}
          </div>

          {historyItems.length === 0 ? (
            <div className="py-16 text-center text-text-muted rounded-2xl bg-surface border border-border">
              <Clock className="w-10 h-10 mx-auto mb-3 opacity-30 text-accent-secondary" />
              <h3 className="font-semibold text-text-primary mb-1">No Search History Yet</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto mb-4">
                Searches launched through VEXTRALOOM will appear here for fast re-execution.
              </p>
              <Button size="sm" variant="outline" onClick={() => setActiveTab('search')}>
                Start Searching
              </Button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {historyItems.map(item => (
                <div 
                  key={item.id} 
                  className="p-3.5 rounded-xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono">{item.category}</Badge>
                      <h4 className="text-sm font-semibold text-text-primary truncate">
                        {item.criteria.role} in {item.criteria.location || 'Anywhere'}
                      </h4>
                    </div>
                    <p className="text-xs text-accent-primary font-mono truncate mt-1">"{item.generatedQuery}"</p>
                    <span className="text-[10px] text-text-muted font-mono">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs gap-1"
                      onClick={() => {
                        setCriteria(item.criteria);
                        setActiveCategory(item.category);
                        setActiveTab('search');
                      }}
                    >
                      <RefreshCw className="w-3 h-3" /> Load
                    </Button>
                    <Button
                      size="sm"
                      variant="primary"
                      className="text-xs gap-1"
                      onClick={() => {
                        const pack = LinkedInSearchAdapter.buildSearchPack(item.criteria);
                        const res = item.category === 'jobs' ? pack.jobs :
                          item.category === 'posts' ? pack.posts :
                          item.category === 'people' ? pack.people :
                          item.category === 'companies' ? pack.companies :
                          item.category === 'events' ? pack.events : pack.courses;
                        handleLaunchSearch(res);
                      }}
                    >
                      Search Again <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
