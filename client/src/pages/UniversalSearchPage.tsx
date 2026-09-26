import React, { useState } from 'react';
import { 
  Search, Sparkles, ExternalLink, Bookmark, 
  ChevronDown, ChevronUp, GraduationCap, MapPin, 
  Briefcase, Layers, Info, ArrowRight,
  UserCircle
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent } from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useAuthPrompt } from '../context/AuthPromptContext';
import { UniversalSearchAdapter, SearchSource } from '../services/search/universalAdapter';
import { SearchCriteria } from '../services/search/types';
import { SearchStorage } from '../services/search/searchStorage';
import { LinkedInSearchAdapter } from '../services/search/linkedinAdapter';

const COMMON_DEGREES = ['B.Tech / B.E.', 'BCA', 'B.Sc.', 'B.Com', 'BBA', 'MCA', 'M.Tech / M.E.', 'M.Sc.', 'MBA', 'Diploma', 'Other'];
const COMMON_BRANCHES = ['Computer Science', 'Information Technology', 'Data Science', 'Artificial Intelligence', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Business', 'Other'];
// Dynamic graduation years
const currentYear = new Date().getFullYear();
const GRADUATION_YEARS = Array.from({length: 8}, (_, i) => (currentYear - 2 + i).toString());

const PRESETS = [
  { label: 'B.Tech Fresher', icon: GraduationCap, criteria: { experience: 'fresher', education: { degree: 'B.Tech / B.E.', includeInQuery: true } } },
  { label: 'Remote Jobs', icon: MapPin, criteria: { workMode: 'remote' } },
  { label: 'Java Developer', icon: Briefcase, criteria: { role: 'Java Developer', skills: ['Java', 'Spring Boot'] } },
  { label: 'Internship Search', icon: Search, criteria: { employmentType: 'internship', experience: 'student' } },
];

export const UniversalSearchPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { openAuthPrompt } = useAuthPrompt();

  const [criteria, setCriteria] = useState<SearchCriteria>({
    role: '',
    skills: [],
    experience: 'any',
    location: '',
    workMode: 'any',
    employmentType: 'any',
    datePosted: 'any',
    company: '',
    targetCompanies: [],
    salaryMin: '',
    salaryMax: '',
    education: {
      includeInQuery: false,
      degree: '',
      field: '',
      graduationYear: '',
      studyStatus: ''
    }
  });

  const [skillInput, setSkillInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  
  const [showAdvancedEdu, setShowAdvancedEdu] = useState(false);
  const [showAdvancedPref, setShowAdvancedPref] = useState(false);
  
  const [isSearching, setIsSearching] = useState(false);
  const [sources] = useState<SearchSource[]>(UniversalSearchAdapter.getSources());
  const [showMoreSources, setShowMoreSources] = useState(false);

  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Handle Preset selection
  const applyPreset = (preset: any) => {
    setCriteria(prev => ({
      ...prev,
      ...preset.criteria,
      education: { ...prev.education, ...(preset.criteria.education || {}) }
    }));
  };

  const loadProfilePrefill = () => {
    if (!isAuthenticated) return;
    setCriteria(prev => ({
      ...prev,
      experience: 'fresher',
      location: 'Bengaluru',
      workMode: 'any',
      education: {
        ...prev.education,
        degree: 'B.Tech / B.E.',
        field: 'Computer Science',
        graduationYear: '2026'
      }
    }));
  };

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
    setCriteria(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillToRemove) }));
  };

  const handleAddCompany = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && companyInput.trim()) {
      e.preventDefault();
      const newComp = companyInput.trim();
      const current = criteria.targetCompanies || [];
      if (!current.includes(newComp)) {
        setCriteria(prev => ({ ...prev, targetCompanies: [...current, newComp] }));
      }
      setCompanyInput('');
    }
  };

  const removeCompany = (compToRemove: string) => {
    setCriteria(prev => ({
      ...prev,
      targetCompanies: (prev.targetCompanies || []).filter(c => c !== compToRemove)
    }));
  };

  const handleSearchLaunch = (source: SearchSource) => {
    if (!criteria.role) return;
    const url = source.buildSearchUrl(criteria);
    SearchStorage.addHistory(criteria, 'all', source.id);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSaveSearch = () => {
    if (!isAuthenticated) {
      openAuthPrompt({
        title: `Sign in to save this search`,
        description: `Save '${criteria.role || 'Career'} Search' to your workspace to access it anywhere.`
      });
      return;
    }
    const searchName = `${criteria.role || 'Universal'} Search`;
    SearchStorage.saveSearch(searchName, criteria, 'all');
    setSaveSuccessMsg(`Saved to workspace!`);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const primarySources = sources.filter(s => s.category === 'primary');
  const secondarySources = sources.filter(s => s.category === 'secondary');
  const fallbackSources = sources.filter(s => s.category === 'fallback');

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface border border-border text-[11px] font-mono text-accent-primary mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>UNIVERSAL CAREER SEARCH</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
            Search Everywhere
          </h1>
          <p className="text-sm text-text-secondary mt-1.5 max-w-2xl leading-relaxed">
            Enter your career requirements once. VEXTRALOOM intelligently converts them into precise searches across LinkedIn, Indeed, Naukri, and more.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <Badge variant={isAuthenticated ? 'success' : 'outline'} className="text-xs py-1">
            {isAuthenticated ? 'Profile Linked' : 'Guest Mode'}
          </Badge>
        </div>
      </div>

      {/* 2. Quick Presets */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono text-text-muted uppercase font-semibold mr-2">Quick Presets:</span>
        {PRESETS.map(p => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-accent-primary/50 text-[11px] font-medium text-text-secondary hover:text-text-primary transition-all flex items-center gap-1.5"
          >
            <p.icon className="w-3 h-3" />
            {p.label}
          </button>
        ))}
        {isAuthenticated && (
          <button
            onClick={loadProfilePrefill}
            className="px-3 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/30 text-accent-primary hover:bg-accent-primary/20 text-[11px] font-bold transition-all flex items-center gap-1.5 ml-auto"
          >
            <UserCircle className="w-3.5 h-3.5" />
            Use My Profile
          </button>
        )}
      </div>

      {/* 3. Search Builder Form (Progressive Disclosure) */}
      {!isSearching ? (
        <div className="space-y-6">
          {/* Step 1: WHAT DO YOU WANT? */}
          <Card className="overflow-hidden border-accent-primary/20">
            <div className="bg-surface border-b border-border px-5 py-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-bold text-xs">1</div>
              <h3 className="font-semibold text-sm text-text-primary uppercase tracking-wider">What do you want?</h3>
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Target Role <span className="text-error">*</span></label>
                <Input 
                  placeholder="e.g. Software Developer, Data Analyst, AI/ML Engineer" 
                  value={criteria.role}
                  onChange={e => setCriteria(prev => ({ ...prev, role: e.target.value }))}
                  className="text-lg py-6"
                />
              </div>

              {criteria.role && (
                <div className="pt-2 animate-fade-in">
                  <div className="flex items-center gap-1.5 text-[11px] text-text-muted mb-2 font-mono">
                    <Sparkles className="w-3 h-3 text-accent-secondary" />
                    <span>Smart Expansion Suggested:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {LinkedInSearchAdapter.getRoleSynonyms(criteria.role).map(syn => (
                      <span key={syn} className="px-2 py-1 bg-surface-elevated border border-border rounded-md text-[11px] text-text-secondary">
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 2: WHERE & SKILLS */}
          <Card>
            <div className="bg-surface border-b border-border px-5 py-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary font-bold text-xs border border-border">2</div>
              <h3 className="font-semibold text-sm text-text-primary uppercase tracking-wider">Where & Key Skills</h3>
            </div>
            <CardContent className="p-5 grid sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Location</label>
                <Input 
                  placeholder="e.g. Bengaluru, India, or Remote"
                  value={criteria.location}
                  onChange={e => setCriteria(prev => ({ ...prev, location: e.target.value }))}
                  icon={<MapPin className="w-4 h-4" />}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-text-secondary">Skills</label>
                <Input 
                  placeholder="Type skill & press Enter (e.g. Java)"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkill}
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {criteria.skills.map(skill => (
                    <span key={skill} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-border text-xs text-text-secondary">
                      {skill}
                      <button 
                        type="button" 
                        onClick={() => removeSkill(skill)} 
                        className="text-text-muted hover:text-error ml-1 font-bold"
                        aria-label={`Remove ${skill}`}
                      >×</button>
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: BACKGROUND */}
          <Card>
            <div className="bg-surface border-b border-border px-5 py-3 flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary font-bold text-xs border border-border">3</div>
              <h3 className="font-semibold text-sm text-text-primary uppercase tracking-wider">Your Background</h3>
            </div>
            <CardContent className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Experience Level</label>
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    value={criteria.experience}
                    onChange={e => setCriteria(prev => ({ ...prev, experience: e.target.value as any }))}
                  >
                    <option value="any">Any Experience</option>
                    <option value="student">Student / Intern</option>
                    <option value="fresher">Fresher / 0-1 Years</option>
                    <option value="entry_level">Entry Level (1-3 Years)</option>
                    <option value="associate">Mid Level (3-5 Years)</option>
                    <option value="mid_level">Senior (5+ Years)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-text-secondary">Education Degree</label>
                  <select 
                    className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    value={criteria.education?.degree || ''}
                    onChange={e => setCriteria(prev => ({
                      ...prev,
                      education: { ...prev.education, degree: e.target.value, includeInQuery: !!e.target.value }
                    }))}
                  >
                    <option value="">Any Degree</option>
                    {COMMON_DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAdvancedEdu(!showAdvancedEdu)}
                className="text-xs text-text-secondary hover:text-accent-primary inline-flex items-center gap-1 font-medium"
              >
                {showAdvancedEdu ? 'Hide extra education fields' : '+ Add field of study, grad year, etc.'}
              </button>

              {showAdvancedEdu && (
                <div className="grid sm:grid-cols-3 gap-3 pt-2 animate-fade-in border-t border-border/40 mt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] text-text-muted">Branch / Field</label>
                    <select 
                      className="w-full h-8 px-2 py-1 rounded border border-border bg-surface text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                      value={criteria.education?.field || ''}
                      onChange={e => setCriteria(prev => ({ ...prev, education: { ...prev.education, field: e.target.value } }))}
                    >
                      <option value="">Any Field</option>
                      {COMMON_BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-text-muted">Graduation Year</label>
                    <select 
                      className="w-full h-8 px-2 py-1 rounded border border-border bg-surface text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                      value={criteria.education?.graduationYear || ''}
                      onChange={e => setCriteria(prev => ({ ...prev, education: { ...prev.education, graduationYear: e.target.value } }))}
                    >
                      <option value="">Any Year</option>
                      {GRADUATION_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-text-muted">Study Status</label>
                    <select 
                      className="w-full h-8 px-2 py-1 rounded border border-border bg-surface text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                      value={criteria.education?.studyStatus || ''}
                      onChange={e => setCriteria(prev => ({ ...prev, education: { ...prev.education, studyStatus: e.target.value } }))}
                    >
                      <option value="">Any Status</option>
                      <option value="Final Year">Final Year</option>
                      <option value="Recently Graduated">Recently Graduated</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Step 4: PREFERENCES */}
          <Card>
            <div className="bg-surface border-b border-border px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-surface-elevated flex items-center justify-center text-text-secondary font-bold text-xs border border-border">4</div>
                <h3 className="font-semibold text-sm text-text-primary uppercase tracking-wider">Preferences</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvancedPref(!showAdvancedPref)}
                className="text-xs text-text-secondary hover:text-accent-primary inline-flex items-center gap-1 font-medium"
              >
                {showAdvancedPref ? 'Hide' : 'Show Details'}
              </button>
            </div>
            {showAdvancedPref && (
              <CardContent className="p-5 space-y-4 animate-fade-in">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Work Mode</label>
                    <select 
                      className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      value={criteria.workMode}
                      onChange={e => setCriteria(prev => ({ ...prev, workMode: e.target.value as any }))}
                    >
                      <option value="any">Any Mode</option>
                      <option value="remote">Remote</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">On-site</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Employment Type</label>
                    <select 
                      className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      value={criteria.employmentType}
                      onChange={e => setCriteria(prev => ({ ...prev, employmentType: e.target.value as any }))}
                    >
                      <option value="any">Any Type</option>
                      <option value="full_time">Full-time</option>
                      <option value="internship">Internship</option>
                      <option value="part_time">Part-time</option>
                      <option value="contract">Contract</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Posted Within</label>
                    <select 
                      className="w-full h-10 px-3 py-2 rounded-md border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
                      value={criteria.datePosted}
                      onChange={e => setCriteria(prev => ({ ...prev, datePosted: e.target.value as any }))}
                    >
                      <option value="any">Any time</option>
                      <option value="past_24h">Past 24 hours</option>
                      <option value="past_week">Past 7 days</option>
                      <option value="past_month">Past 30 days</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-border/40 mt-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Minimum Expected Salary</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">₹</span>
                      <Input 
                        placeholder="e.g. 5,00,000"
                        value={criteria.salaryMin}
                        onChange={e => setCriteria(prev => ({ ...prev, salaryMin: e.target.value }))}
                        className="pl-7"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-text-secondary">Maximum Expected Salary</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-medium">₹</span>
                      <Input 
                        placeholder="e.g. 12,00,000"
                        value={criteria.salaryMax}
                        onChange={e => setCriteria(prev => ({ ...prev, salaryMax: e.target.value }))}
                        className="pl-7"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-border/40 mt-4">
                  <label className="text-xs font-medium text-text-secondary">Target Companies</label>
                  <Input 
                    placeholder="Type company & press Enter (e.g. Google, TCS)"
                    value={companyInput}
                    onChange={e => setCompanyInput(e.target.value)}
                    onKeyDown={handleAddCompany}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(criteria.targetCompanies || []).map(comp => (
                      <span key={comp} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface border border-border text-xs text-text-secondary">
                        {comp}
                        <button 
                          type="button" 
                          onClick={() => removeCompany(comp)} 
                          className="text-text-muted hover:text-error ml-1 font-bold"
                          aria-label={`Remove ${comp}`}
                        >×</button>
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Proceed Button */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <Button 
              variant="outline"
              onClick={handleSaveSearch}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Save Criteria
            </Button>
            
            <Button 
              onClick={() => {
                if (!criteria.role) {
                  alert('Please enter a Target Role to proceed.');
                  return;
                }
                setIsSearching(true);
              }}
              className="px-8 bg-accent-primary text-background hover:bg-accent-primary/90 font-bold"
            >
              Find Search Destinations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          {saveSuccessMsg && (
            <p className="text-xs text-success font-medium">{saveSuccessMsg}</p>
          )}
        </div>
      ) : (
        /* ================= SEARCH LAUNCH CENTER ================= */
        <div className="space-y-6 animate-fade-in">
          <button 
            onClick={() => setIsSearching(false)}
            className="text-xs font-semibold text-text-secondary hover:text-accent-primary flex items-center gap-1 mb-4 transition-colors"
          >
            ← Back to refine criteria
          </button>

          {/* Summary Panel */}
          <Card className="bg-surface-elevated border-accent-primary/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent-primary" />
            <CardContent className="p-6">
              <h3 className="text-[10px] font-mono font-bold text-accent-primary uppercase tracking-wider mb-3">Your Configured Search</h3>
              <div className="flex flex-wrap gap-2 text-sm text-text-primary">
                <span className="font-bold text-base w-full mb-1">{criteria.role}</span>
                {criteria.location && <span className="px-2 py-1 rounded bg-surface border border-border flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-success"/>{criteria.location}</span>}
                {criteria.experience !== 'any' && <span className="px-2 py-1 rounded bg-surface border border-border capitalize">{criteria.experience.replace('_', ' ')}</span>}
                {criteria.workMode !== 'any' && <span className="px-2 py-1 rounded bg-surface border border-border capitalize">{criteria.workMode}</span>}
                {criteria.employmentType !== 'any' && <span className="px-2 py-1 rounded bg-surface border border-border capitalize">{criteria.employmentType.replace('_', ' ')}</span>}
                {criteria.education?.degree && <span className="px-2 py-1 rounded bg-surface border border-border flex items-center gap-1.5"><GraduationCap className="w-3.5 h-3.5 text-accent-secondary"/>{criteria.education.degree}</span>}
              </div>
              {criteria.skills.length > 0 && (
                <div className="mt-4 pt-3 border-t border-border/40 text-xs text-text-secondary">
                  <span className="font-medium mr-2">Skills included:</span>
                  {criteria.skills.join(' · ')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommendations / Broadening Box */}
          {((criteria.skills.length > 3) || (criteria.location && criteria.experience !== 'any' && criteria.workMode !== 'any')) && (
            <div className="p-4 rounded-xl bg-surface border border-warning/30 flex items-start gap-3 text-sm">
              <Info className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-text-primary mb-1">Make your search broader</p>
                <p className="text-text-secondary text-xs leading-relaxed mb-3">
                  You have applied many restrictive filters. If you see "No results" on the destination platforms, try removing some skills or expanding your location/work mode.
                </p>
                <button 
                  onClick={() => {
                    setCriteria(prev => ({...prev, skills: prev.skills.slice(0,2), workMode: 'any', location: ''}));
                    setIsSearching(false);
                  }}
                  className="text-xs font-semibold text-accent-primary hover:underline"
                >
                  Broaden automatically
                </button>
              </div>
            </div>
          )}

          {/* Primary Sources Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-text-muted uppercase tracking-wider">Recommended Search Sources</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {primarySources.map(source => {
                const unsupported = UniversalSearchAdapter.getUnsupportedFilters(source, criteria);
                
                return (
                  <Card key={source.id} className="hover:border-accent-primary/40 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-text-primary flex items-center gap-2">
                          <Layers className="w-4 h-4 text-accent-primary" />
                          {source.name}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-mono">{source.domain}</Badge>
                      </div>
                      
                      {unsupported.length > 0 ? (
                        <p className="text-[10px] text-warning font-mono mb-4 leading-relaxed">
                          ⚠️ Cannot transfer: {unsupported.join(', ')}. You may need to refine these manually on {source.name}.
                        </p>
                      ) : (
                        <p className="text-[10px] text-success font-mono mb-4">
                          ✓ All filters perfectly compatible.
                        </p>
                      )}
                      
                      <Button 
                        className="w-full justify-between group"
                        variant={source.id === 'linkedin' ? 'primary' : 'outline'}
                        onClick={() => handleSearchLaunch(source)}
                      >
                        Search on {source.name}
                        <ExternalLink className="w-4 h-4 text-text-muted group-hover:text-current transition-colors" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Secondary & Fallback Sources */}
          <div className="pt-4 border-t border-border">
            <button 
              onClick={() => setShowMoreSources(!showMoreSources)}
              className="text-xs font-semibold text-text-secondary hover:text-text-primary flex items-center gap-2 transition-colors mb-4"
            >
              {showMoreSources ? <ChevronUp className="w-4 h-4"/> : <ChevronDown className="w-4 h-4"/>}
              {showMoreSources ? 'Hide additional sources' : 'More sources & Wider Web Fallback'}
            </button>

            {showMoreSources && (
              <div className="grid sm:grid-cols-2 gap-3 animate-fade-in">
                {[...secondarySources, ...fallbackSources].map(source => {
                  const unsupported = UniversalSearchAdapter.getUnsupportedFilters(source, criteria);
                  return (
                    <div key={source.id} className="p-4 rounded-xl bg-surface border border-border hover:border-text-muted transition-colors flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-bold text-sm text-text-primary">{source.name}</span>
                          {source.category === 'fallback' && <Badge variant="outline" className="text-[9px]">FALLBACK</Badge>}
                        </div>
                        {unsupported.length > 0 && (
                          <p className="text-[10px] text-text-muted font-mono mb-4">
                            Omits: {unsupported.join(', ')}
                          </p>
                        )}
                      </div>
                      <Button 
                        size="sm"
                        variant="outline" 
                        className="w-full text-xs justify-between mt-auto"
                        onClick={() => handleSearchLaunch(source)}
                      >
                        Open {source.name}
                        <ExternalLink className="w-3 h-3 text-text-muted" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
