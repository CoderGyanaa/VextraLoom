import React, { useState, useEffect } from 'react';
import { 
  Search, Sparkles, ExternalLink, Bookmark, Clock, Copy, Check, 
  ChevronDown, ChevronUp, RefreshCw, GraduationCap, MapPin, 
  Briefcase, Users, Building, Video, BookOpen, Layers
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useAuthPrompt } from '../context/AuthPromptContext';
import { LinkedInSearchAdapter } from '../services/search/linkedinAdapter';
import { 
  SearchCriteria, SearchCategory, OptimizedSearchResult, 
  SavedSearchItem, SearchHistoryItem 
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
  const { isAuthenticated, user } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();

  // Search Type / Category
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('jobs');

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
    education: {
      includeInQuery: true,
      degree: 'B.Tech',
      field: 'Computer Science',
      graduationYear: '2026',
      studyStatus: 'Final Year'
    }
  });

  const [skillInput, setSkillInput] = useState('');
  const [showAdvancedEdu, setShowAdvancedEdu] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'saved' | 'history'>('search');
  const [savedSearches, setSavedSearches] = useState<SavedSearchItem[]>([]);
  const [historyItems, setHistoryItems] = useState<SearchHistoryItem[]>([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Load history & saved items
  useEffect(() => {
    setSavedSearches(SearchStorage.getSavedSearches());
    setHistoryItems(SearchStorage.getHistory());
  }, []);

  // Profile-aware default criteria if authenticated and profile exists
  useEffect(() => {
    if (isAuthenticated && user?.name) {
      // If user is authenticated, we prefill suggestions if not yet edited
      // Note: User can freely edit all fields
    }
  }, [isAuthenticated, user]);

  // Handle Preset selection
  const applyPreset = (presetName: string) => {
    const preset = STUDENT_PRESETS[presetName];
    if (preset) {
      setCriteria(prev => ({
        ...prev,
        ...preset,
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

  // Dynamic branch suggestions
  const suggestedRoles = criteria.education?.field 
    ? (BRANCH_SUGGESTIONS[criteria.education.field] || []) 
    : [];

  // Generate Current Result(s)
  const currentResult: OptimizedSearchResult = (activeCategory === 'all')
    ? LinkedInSearchAdapter.buildJobSearch(criteria) // fallback for single view
    : (activeCategory === 'jobs')
      ? LinkedInSearchAdapter.buildJobSearch(criteria)
      : (activeCategory === 'posts')
        ? LinkedInSearchAdapter.buildPostSearch(criteria)
        : (activeCategory === 'people')
          ? LinkedInSearchAdapter.buildPeopleSearch(criteria)
          : (activeCategory === 'companies')
            ? LinkedInSearchAdapter.buildCompanySearch(criteria)
            : (activeCategory === 'events')
              ? LinkedInSearchAdapter.buildEventSearch(criteria)
              : LinkedInSearchAdapter.buildCourseSearch(criteria);

  const allResults: OptimizedSearchResult[] = (activeCategory === 'all')
    ? LinkedInSearchAdapter.buildAllSearches(criteria)
    : [];

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

    const searchName = `${criteria.role || 'Search'} — ${criteria.location || 'Anywhere'} (${criteria.datePosted})`;
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
            Search Builder
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
          {/* Student Presets */}
          <div className="p-4 rounded-xl bg-surface border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
                Student Quick Presets
              </span>
              <span className="text-[11px] text-text-muted">Click to auto-populate criteria</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(STUDENT_PRESETS).map(name => (
                <button
                  key={name}
                  onClick={() => applyPreset(name)}
                  className="px-3 py-1.5 rounded-lg bg-surface-elevated border border-border hover:border-accent-primary/60 text-xs font-medium text-text-secondary hover:text-text-primary transition-all shadow-sm"
                >
                  ⚡ {name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Category Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted uppercase tracking-wider font-mono">
              Select LinkedIn Search Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {[
                { id: 'jobs', label: 'Jobs', icon: Briefcase },
                { id: 'posts', label: 'Job Posts', icon: Search },
                { id: 'people', label: 'Recruiters', icon: Users },
                { id: 'companies', label: 'Companies', icon: Building },
                { id: 'events', label: 'Events', icon: Video },
                { id: 'courses', label: 'Courses', icon: BookOpen },
                { id: 'all', label: 'All-in-One', icon: Layers },
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

          {/* Main Grid: Form Inputs & Live Preview */}
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Criteria Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Career Target */}
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <Briefcase className="w-4 h-4 text-accent-primary" />
                    <h3 className="font-semibold text-sm text-text-primary">Career Target & Role</h3>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Target Job Role *</label>
                    <Input 
                      placeholder="e.g. Java Developer, Frontend Engineer, Cloud Trainee" 
                      value={criteria.role}
                      onChange={e => setCriteria(prev => ({ ...prev, role: e.target.value }))}
                    />
                    {suggestedRoles.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1.5">
                        <span className="text-[11px] text-text-muted self-center">Suggestions based on branch:</span>
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

                  {/* Skills input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Skills & Technologies (Press Enter or Comma)</label>
                    <Input 
                      placeholder="Type skill and press Enter (e.g. Java, SQL, Spring Boot)"
                      value={skillInput}
                      onChange={e => setSkillInput(e.target.value)}
                      onKeyDown={handleAddSkill}
                    />
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {criteria.skills.map(skill => (
                        <span 
                          key={skill}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface border border-border text-xs font-mono text-text-primary"
                        >
                          {skill}
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

                  {/* Company / Industry / Additional Keywords */}
                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Specific Company (Optional)</label>
                      <Input 
                        placeholder="e.g. Google, Infosys, Startups" 
                        value={criteria.company || ''}
                        onChange={e => setCriteria(prev => ({ ...prev, company: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Specific Keywords (Optional)</label>
                      <Input 
                        placeholder="e.g. 2026 Batch, Off-campus" 
                        value={criteria.keywords || ''}
                        onChange={e => setCriteria(prev => ({ ...prev, keywords: e.target.value }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Education & Student Profile */}
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
                      <span className="text-text-secondary">Include in search query</span>
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
                          education: { ...prev.education, includeInQuery: prev.education?.includeInQuery ?? true, degree: e.target.value }
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
                          education: { ...prev.education, includeInQuery: prev.education?.includeInQuery ?? true, field: e.target.value }
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
                          education: { ...prev.education, includeInQuery: prev.education?.includeInQuery ?? true, graduationYear: e.target.value }
                        }))}
                      >
                        <option value="">Graduation Year</option>
                        {GRADUATION_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Progressive Disclosure: College & Study Status */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedEdu(!showAdvancedEdu)}
                      className="text-xs text-text-secondary hover:text-text-primary inline-flex items-center gap-1 transition-colors"
                    >
                      <span>{showAdvancedEdu ? 'Hide college & study status' : '+ Add college name & study status'}</span>
                      {showAdvancedEdu ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {showAdvancedEdu && (
                      <div className="grid sm:grid-cols-2 gap-3 pt-3 animate-fade-in">
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-text-secondary">College / University</label>
                          <Input 
                            placeholder="e.g. IIT, NIT, State University" 
                            value={criteria.education?.college || ''}
                            onChange={e => setCriteria(prev => ({
                              ...prev,
                              education: { ...prev.education, includeInQuery: prev.education?.includeInQuery ?? true, college: e.target.value }
                            }))}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-medium text-text-secondary">Current Study Status</label>
                          <select 
                            className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                            value={criteria.education?.studyStatus || ''}
                            onChange={e => setCriteria(prev => ({
                              ...prev,
                              education: { ...prev.education, includeInQuery: prev.education?.includeInQuery ?? true, studyStatus: e.target.value }
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

              {/* Experience, Location & Filters */}
              <Card>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/60">
                    <MapPin className="w-4 h-4 text-success" />
                    <h3 className="font-semibold text-sm text-text-primary">Location, Experience & Filters</h3>
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
                        <option value="remote">Remote</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="onsite">On-site</option>
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
                        <option value="student">Student / Intern</option>
                        <option value="fresher">Fresher</option>
                        <option value="entry_level">Entry Level</option>
                        <option value="associate">Associate</option>
                        <option value="mid_level">Mid-Senior</option>
                        <option value="any">Any Experience</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Employment Type</label>
                      <select 
                        className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        value={criteria.employmentType}
                        onChange={e => setCriteria(prev => ({ ...prev, employmentType: e.target.value as any }))}
                      >
                        <option value="full_time">Full-time</option>
                        <option value="internship">Internship</option>
                        <option value="part_time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="any">Any Type</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-text-secondary">Date Posted</label>
                      <select 
                        className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        value={criteria.datePosted}
                        onChange={e => setCriteria(prev => ({ ...prev, datePosted: e.target.value as any }))}
                      >
                        <option value="past_24h">Past 24 hours (Fresh)</option>
                        <option value="past_week">Past week (7 days)</option>
                        <option value="past_month">Past month (30 days)</option>
                        <option value="any">Any time</option>
                      </select>
                    </div>
                  </div>

                  {/* LinkedIn Supported Flags */}
                  <div className="flex flex-wrap gap-4 pt-2 border-t border-border/40 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={criteria.easyApplyOnly}
                        onChange={e => setCriteria(prev => ({ ...prev, easyApplyOnly: e.target.checked }))}
                        className="rounded border-border text-accent-primary focus:ring-accent-primary"
                      />
                      <span className="text-text-secondary">Easy Apply / LinkedIn Apply</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={criteria.under10Applicants}
                        onChange={e => setCriteria(prev => ({ ...prev, under10Applicants: e.target.checked }))}
                        className="rounded border-border text-accent-primary focus:ring-accent-primary"
                      />
                      <span className="text-text-secondary">Under 10 Applicants (Early Applicant)</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Live Search Preview & Direct Execution (5 cols) */}
            <div className="lg:col-span-5 space-y-6 sticky top-24">
              <Card className="border-accent-primary/40 shadow-glow-primary/10 relative overflow-hidden bg-surface-elevated">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary" />
                
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-accent-primary font-semibold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      OPTIMIZED SEARCH PREVIEW
                    </span>
                    <Badge variant="outline" className="text-[10px] uppercase font-mono">
                      {activeCategory.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Structured Preview Breakdown */}
                  <div className="p-4 rounded-xl bg-surface border border-border/80 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-border/60">
                      <span className="text-text-muted">Target Role:</span>
                      <span className="font-semibold text-text-primary">{criteria.role || 'Any Role'}</span>
                    </div>

                    {criteria.education?.includeInQuery && criteria.education.degree && (
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Education:</span>
                        <span className="text-text-secondary font-mono">
                          {criteria.education.degree} {criteria.education.field && `· ${criteria.education.field}`}
                        </span>
                      </div>
                    )}

                    {criteria.education?.includeInQuery && criteria.education.graduationYear && (
                      <div className="flex items-center justify-between">
                        <span className="text-text-muted">Graduation:</span>
                        <span className="text-text-secondary font-mono">{criteria.education.graduationYear} Batch</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Experience:</span>
                      <span className="text-text-secondary capitalize">{criteria.experience.replace('_', ' ')}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Location:</span>
                      <span className="text-text-secondary">{criteria.location || 'Worldwide'}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">Date Posted:</span>
                      <span className="text-accent-primary font-medium">
                        {criteria.datePosted === 'past_24h' ? 'Past 24 Hours' : criteria.datePosted === 'past_week' ? 'Past 7 Days' : 'Past 30 Days'}
                      </span>
                    </div>

                    {criteria.skills.length > 0 && (
                      <div className="pt-1.5 border-t border-border/60">
                        <span className="text-text-muted block mb-1">Key Skills:</span>
                        <span className="text-text-secondary font-mono text-[11px]">
                          {criteria.skills.join(' · ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Generated Natural Language Query Box */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-text-muted font-mono uppercase">Optimized Intent Query</span>
                      <button
                        type="button"
                        onClick={() => handleCopyQuery(currentResult.queryUsed)}
                        className="text-text-secondary hover:text-accent-primary inline-flex items-center gap-1 transition-colors text-[11px]"
                      >
                        {copiedQuery ? <Check className="w-3 h-3 text-success" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedQuery ? 'Copied' : 'Copy Query'}</span>
                      </button>
                    </div>
                    <div className="p-3 rounded-lg bg-surface border border-border text-xs font-mono text-accent-primary leading-relaxed break-words">
                      "{currentResult.queryUsed || 'No keywords specified'}"
                    </div>
                  </div>

                  {saveSuccessMsg && (
                    <div className="p-2.5 rounded-lg bg-success/10 border border-success/30 text-xs text-success text-center">
                      ✓ {saveSuccessMsg}
                    </div>
                  )}

                  {/* Action Launch Buttons */}
                  {activeCategory === 'all' ? (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-semibold text-text-muted uppercase font-mono block">
                        All Optimized Destinations Ready
                      </span>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {allResults.map(res => (
                          <div 
                            key={res.category}
                            className="p-3 rounded-xl bg-surface border border-border hover:border-accent-primary/50 transition-colors flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <h4 className="text-xs font-semibold text-text-primary">{res.label}</h4>
                              <p className="text-[11px] text-text-muted truncate">{res.description}</p>
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="shrink-0 text-xs gap-1 hover:border-accent-primary hover:text-accent-primary"
                              onClick={() => handleLaunchSearch(res)}
                            >
                              Search <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-2">
                      <Button 
                        size="lg" 
                        variant="primary" 
                        className="w-full gap-2 justify-center shadow-glow-primary/30"
                        onClick={() => handleLaunchSearch(currentResult)}
                      >
                        <span>Search {currentResult.label} on LinkedIn</span>
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

                        <span className="text-[11px] text-text-muted">
                          Official LinkedIn Tab
                        </span>
                      </div>
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
                        const res = (item.category === 'jobs')
                          ? LinkedInSearchAdapter.buildJobSearch(item.criteria)
                          : (item.category === 'posts')
                            ? LinkedInSearchAdapter.buildPostSearch(item.criteria)
                            : (item.category === 'people')
                              ? LinkedInSearchAdapter.buildPeopleSearch(item.criteria)
                              : (item.category === 'companies')
                                ? LinkedInSearchAdapter.buildCompanySearch(item.criteria)
                                : (item.category === 'events')
                                  ? LinkedInSearchAdapter.buildEventSearch(item.criteria)
                                  : LinkedInSearchAdapter.buildCourseSearch(item.criteria);
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
