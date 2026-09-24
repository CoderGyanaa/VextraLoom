# VEXTRALOOM Database Architecture

## Overview
VEXTRALOOM uses MongoDB Atlas as the primary data store, leveraging Mongoose for schema validation, business logic enforcement at the data layer, and query optimization. 

**Core Philosophies**:
1. **Strict Models**: Prevent schema pollution by ignoring undefined fields.
2. **Normalized Profiles vs Auth**: The \`User\` collection is strictly for authentication, roles, and status. The \`Profile\` collection stores complex nested career, education, and scholarship details.
3. **Array over Strings**: Multi-value fields (e.g., \`skills\`, \`preferredLocations\`) are stored as an array of strings, not comma-separated text.
4. **Targeted Indexing**: Compound indexes are configured for read-heavy operations, explicitly prioritizing timestamps and categorical filters.

---

## Core Collections

### 1. User & Profile
- **User**: Core auth collection. 
  - *Schema*: \`email\`, \`passwordHash\`, \`role\` (student, recruiter, admin), \`status\` (active, suspended, unverified).
  - *Index*: \`{ email: 1 }\` (Unique).
- **Profile**: 1-to-1 mapping with User.
  - *Nested Documents*: \`basic\`, \`education\`, \`career\`, \`technical\`, \`scholarshipInfo\`.
  - *Index*: \`{ user: 1 }\` (Unique), \`{ "career.targetRoles": 1 }\`, \`{ "career.skills": 1 }\`.

### 2. Opportunity Collections
Each opportunity type has its own collection, allowing specialized query and indexing behavior. All contain a standard status lifecycle (\`active\`, \`expired\`, \`draft\`) and \`timestamps\`.

- **Job**: \`title\`, \`organization\`, \`description\`, \`skills[]\`, \`workMode\`, \`status\`. Index on \`{ status: 1, postedAt: -1 }\`.
- **Internship**: Includes \`stipend\`, \`duration\`. Index on \`{ status: 1, postedAt: -1 }\`.
- **Hackathon**: Includes \`themes[]\`, \`teamSize\`, \`prizePool\`. Index on \`{ status: 1, startDate: 1 }\`.
- **Scholarship**: Includes \`amount\`, complex \`eligibility\` (income, gender, state). Index on \`{ status: 1, deadline: 1 }\`.
- **OpenSourceOpportunity**: \`projectName\`, \`repositoryUrl\`, \`techStack[]\`, \`labels[]\`. Index on \`{ techStack: 1, status: 1 }\`.

### 3. Career & Learning
- **Roadmap**: A complex schema defining a career path.
  - *Fields*: \`title\`, \`category\`, \`targetRole\`, \`projects[]\`, \`monthByMonthPath[]\`.
  - *Index*: \`{ targetRole: 1 }\`.
- **Certification**: \`name\`, \`provider\`, \`difficulty\`, \`skills[]\`.
- **Resource**: Articles, videos, courses. \`tags[]\`, \`type\`.
- **Challenge**: Platform challenges (e.g. LeetCode). \`platform\`, \`difficulty\`, \`tags[]\`.
- **Tool**: AI Tools and dev resources. \`category\`, \`tags[]\`.

### 4. Interactive & State Collections
- **SavedItem**: Polymorphic saves system.
  - *Fields*: \`user\` (Ref: User), \`itemModel\` (Enum for collection type), \`itemId\` (RefPath: itemModel).
  - *Index*: \`{ user: 1, itemId: 1 }\` (Unique).
- **SearchHistory**: Stores prior queries for AI recommendations.
- **AIHistory**: Audits user AI prompts. *Note: Strict enforcement that no API keys are stored.*
- **UserPreference**: Dedicated settings (notification, privacy, UI).
- **Notification**: In-app user notifications. \`isRead\` flag. Index \`{ user: 1, isRead: 1, createdAt: -1 }\`.

## Schema Rules
1. **Never fabricate URLs**: All external URLs must be explicitly nullable or strictly validated.
2. **Timestamps**: All schemas automatically manage \`createdAt\` and \`updatedAt\`.
3. **No hardcoded DNS in production**: See \`server/src/config/db.ts\` for Windows local SRV fallback documentation.
