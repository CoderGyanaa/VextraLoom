# VEXTRALOOM — LinkedIn Optimized Search Architecture

## 1. Executive Summary & Core Positioning

**VEXTRALOOM is a Search Intent Optimizer.**  
**LinkedIn is the Search, Ranking, and Results Platform.**

### Critical Architectural Boundary
- **What VEXTRALOOM Optimizes**:
  - Structured student intent (Target roles, degrees, branches, graduation batches, core skills, experience level, location, work modes, and posting recency).
  - Clean, natural-language query construction free of keyword stuffing.
  - Precise mapping to official LinkedIn-supported URL search query parameters and destinations.
  - Multi-category routing (Jobs, Job Posts, Recruiters, Companies, Events, Courses).
- **What LinkedIn Controls**:
  - Result ranking, relevancy scoring, personalized feed algorithms, account connectivity, and application processing.
- **Strict Anti-Manipulation Guarantee**:
  - VEXTRALOOM **does not** claim to manipulate, hack, or reverse-engineer LinkedIn's internal proprietary ranking algorithm.
  - VEXTRALOOM **never** scrapes LinkedIn, never automates connection requests or recruiter messages, and never asks for LinkedIn credentials, cookies, or sessions.
  - All searches launch directly on official LinkedIn domains (`https://www.linkedin.com/...`).

---

## 2. Guest-First & Public Access Architecture

In adherence to VEXTRALOOM's core philosophy ("*Explore freely. Personalize when ready*"):
- **Unrestricted Guest Experience**:
  - Any student can open `/linkedin-search`, select student presets (e.g., *B.Tech Fresher*, *MCA Fresher*, *2026 Graduate*), configure degrees, skills, and locations, preview generated natural queries, and execute searches without creating an account.
- **Authentication Value-Add (Personalization, Not a Paywall)**:
  - Account creation unlocks:
    - Persistent Saved Searches with custom labels.
    - Full Search History with timestamped re-launch capabilities.
    - Automatic pre-population from the student's VEXTRALOOM Profile (degree, branch, skills).
    - Future scheduled alerts for fresh opportunity matches.

---

## 3. Supported Search Categories & Destinations

| Category | Purpose | Destination URL Pattern | Query & Filter Strategy |
| :--- | :--- | :--- | :--- |
| **Jobs** | Official job listings & internships | `https://www.linkedin.com/jobs/search/?...` | Maps role, education, skills, location, date posted (`f_TPR`), experience (`f_E`), work mode (`f_WT`), employment type (`f_JT`), Easy Apply (`f_AL`), and low applicants (`f_EA`). |
| **Job Posts** | Hiring announcements from founders & managers | `https://www.linkedin.com/search/results/content/?...` | Formulates direct hiring intent queries (e.g. `hiring Java developer Bengaluru 2026`) sorted by latest (`sortBy="date_posted"`). |
| **Recruiters & People** | Talent acquisition & engineering leads | `https://www.linkedin.com/search/results/people/?...` | Searches for recruiters, talent partners, and hiring managers matching the target role and company. |
| **Companies** | Organizations hiring in target domain | `https://www.linkedin.com/search/results/companies/?...` | Identifies relevant firms by domain, industry, and location. |
| **Events** | Webinars, hiring hackathons & fairs | `https://www.linkedin.com/search/results/events/?...` | Surfaces relevant technical and career events. |
| **Courses** | LinkedIn Learning skill credentials | `https://www.linkedin.com/learning/search?...` | Directs to verified skill upskilling resources. |
| **All-in-One** | Multi-vector exploration | All 6 destinations | Generates ready-to-launch actions across all 6 categories simultaneously from a single criteria configuration. |

---

## 4. Supported Filters & LinkedIn Mapping

LinkedIn's official public query parameters are strictly adhered to without fabricating unsupported parameters:

- **Date Posted (`f_TPR`)**:
  - `past_24h` ➔ `r86400` (Past 24 hours)
  - `past_week` ➔ `r604800` (Past 7 days)
  - `past_month` ➔ `r2592000` (Past 30 days)
- **Experience Level (`f_E`)**:
  - Student / Fresher / Entry-Level ➔ `1,2` (Internship & Entry Level)
  - Associate ➔ `3`
  - Mid-Senior ➔ `4`
- **Work Mode (`f_WT`)**:
  - On-site ➔ `1`
  - Remote ➔ `2`
  - Hybrid ➔ `3`
- **Employment Type (`f_JT`)**:
  - Full-time ➔ `F`
  - Part-time ➔ `P`
  - Contract ➔ `C`
  - Internship ➔ `I`
- **Application Filters**:
  - Easy Apply ➔ `f_AL=true`
  - Under 10 Applicants ➔ `f_EA=true`

### Note on Education Parameters in Job Search
LinkedIn's consumer job search URL API does not support direct query parameters for `Degree` or `Graduation Year` (which are reserved for Recruiter enterprise products). VEXTRALOOM bridges this gap by intelligently weaving degree, field of study, and batch year into the natural-language search query itself (e.g., *"Entry-level Java developer Bengaluru for 2026 Computer Science graduates"*), ensuring maximum discovery without generating invalid URL parameters.

---

## 5. Education & Student Optimization

### Supported Qualifications
- **Degrees**: B.Tech / B.E., BCA, B.Sc., B.Sc. Computer Science, MCA, M.Tech, MBA, M.Sc., Diploma, and custom write-ins.
- **Fields / Specializations**: Computer Science, IT, Data Science, AI, ECE, Mechanical, Civil, Business, etc.
- **Batches / Graduation**: Dynamic support for 2024 through 2030+.
- **Study Status**: 1st Year, 2nd Year, 3rd Year, Final Year, Recently Graduated, Postgraduate.

### Branch-Aware Suggestions
When a student selects their branch (e.g. *Computer Science*), the optimizer suggests relevant target roles (*Software Engineer, Java Developer, Cloud Trainee, AI/ML Engineer*) without locking the user into any single path.

### Student Presets
One-click presets instantly load tailored combinations:
- `[ B.Tech Fresher ]`: Software Engineer · Java · 2026 · Fresher
- `[ MCA Fresher ]`: Java Developer · Spring Boot · SQL · 2026
- `[ Final-Year Student ]`: Software Developer Trainee · Internship
- `[ 2026 Graduate ]`: Graduate Engineer Trainee · IT · Entry Level
- `[ Internship for Students ]`: Remote Frontend Intern · React
- `[ Entry-Level Jobs ]`: Junior Backend Engineer · Hybrid

---

## 6. Privacy & Ethical Guardrails

- **Zero Scraping Policy**: VEXTRALOOM does not scrape user profiles, job posts, or company listings.
- **No Inferred Sensitive Data**: Education details provided by students are strictly utilized for search formulation. No inferences regarding caste, religion, ethnicity, income, or disability are ever made.
- **Client-Side Intent Generation**: Query formulation executes securely in the client runtime without sharing search queries with unapproved third parties.

---

## 7. Future Search Source Adapter Architecture

The `SearchCriteria` interface in `client/src/services/search/types.ts` is platform-agnostic. The source adapter design allows future platforms to be added cleanly without changing the search UI:

```typescript
export interface SearchSourceAdapter {
  buildJobSearch(criteria: SearchCriteria): OptimizedSearchResult;
  buildPostSearch?(criteria: SearchCriteria): OptimizedSearchResult;
  buildPeopleSearch?(criteria: SearchCriteria): OptimizedSearchResult;
  buildCompanySearch?(criteria: SearchCriteria): OptimizedSearchResult;
}

// Future implementations:
// - NaukriSearchAdapter
// - IndeedSearchAdapter
// - InternshalaSearchAdapter
// - WellfoundSearchAdapter
// - CompanyCareerPageAdapter
```
