---
title: 'Building Andúril: A GitHub-Focused Productivity Tool for Developers'
date: '2024-02-20'
---

As a developer working on multiple projects, I found myself constantly switching between GitHub issues, pull requests, and project boards. While tools like ZenHub and Zerocracy exist, I wanted to understand how GitHub-focused productivity tools work under the hood.

That curiosity led me to build **Andúril** - a personal productivity tool designed to streamline GitHub workflows. Named after the legendary sword from Lord of the Rings, it's built to be a reliable companion for developer productivity within the GitHub ecosystem.

## The Problem I Set Out to Solve

This wasn't about building the next big productivity platform - it was about understanding developer workflow optimization:

- How do you integrate deeply with GitHub's API?
- What makes a productivity tool feel native to a developer's workflow?
- How do you visualize complex project relationships?
- What are the technical challenges of real-time GitHub synchronization?

The goal was simple: **Build a GitHub-focused productivity tool to understand how developer tools actually work**.

## Technical Architecture Decisions

### Why TypeScript and Next.js?

I chose **TypeScript** with **Next.js** for several reasons:

- **Type safety** - Critical when working with complex GitHub API responses
- **API routes** - Perfect for GitHub webhook handling and API proxying
- **Server-side rendering** - Better performance for dashboard views
- **Rich ecosystem** - Excellent GitHub integration libraries

### The GitHub Integration Challenge

The most complex part was creating seamless GitHub synchronization:

```typescript
class GitHubSyncManager {
  private octokit: Octokit;
  private webhookQueue: Queue<GitHubWebhookEvent>;
  
  async syncRepository(repo: Repository) {
    try {
      const [issues, pullRequests, projects] = await Promise.all([
        this.octokit.issues.listForRepo({
          owner: repo.owner,
          repo: repo.name,
          state: 'all'
        }),
        this.octokit.pulls.list({
          owner: repo.owner,
          repo: repo.name,
          state: 'all'
        }),
        this.octokit.projects.listForRepo({
          owner: repo.owner,
          repo: repo.name
        })
      ]);
      
      await this.updateLocalDatabase({
        issues: issues.data,
        pullRequests: pullRequests.data,
        projects: projects.data
      });
      
    } catch (error) {
      this.handleSyncError(error);
    }
  }
  
  async handleWebhook(event: GitHubWebhookEvent) {
    switch (event.action) {
      case 'opened':
      case 'closed':
      case 'edited':
        await this.updateIssueStatus(event.issue);
        break;
      case 'synchronize':
        await this.updatePullRequest(event.pull_request);
        break;
    }
  }
}
```

### Database Design for GitHub Data

I used **PostgreSQL** with **Prisma** to model GitHub relationships:

```typescript
model Repository {
  id          String   @id
  name        String
  owner       String
  description String?
  language    String?
  issues      Issue[]
  pullRequests PullRequest[]
  projects    Project[]
  
  @@unique([owner, name])
}

model Issue {
  id           Int          @id
  number       Int
  title        String
  body         String?
  state        IssueState
  labels       Label[]
  assignees    User[]
  repository   Repository   @relation(fields: [repositoryId], references: [id])
  repositoryId String
  
  @@unique([repositoryId, number])
}

model PullRequest {
  id           Int          @id
  number       Int
  title        String
  body         String?
  state        PRState
  isDraft      Boolean
  repository   Repository   @relation(fields: [repositoryId], references: [id])
  repositoryId String
  
  @@unique([repositoryId, number])
}
```

## Design Philosophy: Developer-First Interface

### Information Architecture

I designed Andúril with developer workflows in mind:

- **Command palette** for quick actions (Cmd+K)
- **Keyboard-first navigation** throughout the interface
- **Real-time updates** via WebSocket connections
- **Contextual views** that adapt to current work

### Key Interface Components

```typescript
// Command palette for quick GitHub actions
const GitHubCommandPalette = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CommandResult[]>([]);
  
  const commands = useMemo(() => [
    {
      id: 'create-issue',
      title: 'Create Issue',
      action: () => router.push('/issues/new'),
      icon: <PlusIcon />
    },
    {
      id: 'open-pr',
      title: 'Create Pull Request',
      action: () => createPullRequest(),
      icon: <GitPullRequestIcon />
    },
    {
      id: 'switch-repo',
      title: 'Switch Repository',
      action: (repo) => switchRepository(repo),
      icon: <RepoIcon />
    }
  ], []);
  
  useEffect(() => {
    const filtered = commands.filter(cmd => 
      cmd.title.toLowerCase().includes(query.toLowerCase())
    );
    setResults(filtered);
  }, [query, commands]);
  
  return (
    <CommandMenu open={isOpen} onOpenChange={setIsOpen}>
      <CommandInput 
        placeholder="Search repositories, issues, PRs..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {results.map(result => (
          <CommandItem 
            key={result.id}
            onSelect={result.action}
          >
            {result.icon}
            {result.title}
          </CommandItem>
        ))}
      </CommandList>
    </CommandMenu>
  );
};
```

## The Challenges I Overcame

### 1. GitHub API Rate Limiting

Managing GitHub's API limits while keeping data fresh:

```typescript
class RateLimitManager {
  private requestQueue: Queue<GitHubRequest>;
  private rateLimitStatus: RateLimitStatus;
  
  async executeRequest<T>(request: () => Promise<T>): Promise<T> {
    await this.waitForRateLimit();
    
    try {
      const result = await request();
      this.updateRateLimitStatus();
      return result;
    } catch (error) {
      if (error.status === 403) {
        // Rate limit exceeded
        await this.handleRateLimitError(error);
        return this.executeRequest(request);
      }
      throw error;
    }
  }
  
  private async waitForRateLimit() {
    if (this.rateLimitStatus.remaining === 0) {
      const waitTime = this.rateLimitStatus.resetTime - Date.now();
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
}
```

### 2. Real-Time Synchronization

Keeping local data in sync with GitHub changes:

```typescript
class WebSocketManager {
  private ws: WebSocket;
  private reconnectAttempts = 0;
  
  connect() {
    this.ws = new WebSocket(process.env.WEBSOCKET_URL);
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleGitHubUpdate(data);
    };
    
    this.ws.onclose = () => {
      if (this.reconnectAttempts < 5) {
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, Math.pow(2, this.reconnectAttempts) * 1000);
      }
    };
  }
  
  private handleGitHubUpdate(update: GitHubUpdate) {
    switch (update.type) {
      case 'issue_updated':
        this.updateIssueInUI(update.payload);
        break;
      case 'pr_merged':
        this.updatePRStatus(update.payload);
        break;
      case 'new_commit':
        this.refreshCommitHistory(update.payload.sha);
        break;
    }
  }
}
```

### 3. Complex State Management

Managing interconnected GitHub data efficiently:

```typescript
// Zustand store for GitHub data
interface GitHubStore {
  repositories: Repository[];
  currentRepo: Repository | null;
  issues: Issue[];
  pullRequests: PullRequest[];
  
  // Actions
  setCurrentRepo: (repo: Repository) => void;
  updateIssue: (issue: Issue) => void;
  addPullRequest: (pr: PullRequest) => void;
  syncRepository: (repoId: string) => Promise<void>;
}

const useGitHubStore = create<GitHubStore>((set, get) => ({
  repositories: [],
  currentRepo: null,
  issues: [],
  pullRequests: [],
  
  setCurrentRepo: (repo) => {
    set({ currentRepo: repo });
    // Auto-sync when switching repos
    get().syncRepository(repo.id);
  },
  
  updateIssue: (updatedIssue) => {
    set((state) => ({
      issues: state.issues.map(issue => 
        issue.id === updatedIssue.id ? updatedIssue : issue
      )
    }));
  },
  
  syncRepository: async (repoId) => {
    const syncManager = new GitHubSyncManager();
    await syncManager.syncRepository(repoId);
    // Update store with fresh data
  }
}));
```

## Key Features That Make Andúril Special

### 1. Intelligent Issue Management

GitHub issues with enhanced workflow automation:

```typescript
class IssueWorkflowManager {
  async autoAssignReviewer(issue: Issue): Promise<User | null> {
    // Analyze code changes to suggest best reviewer
    const changedFiles = await this.getChangedFiles(issue);
    const codeOwners = await this.getCodeOwners(changedFiles);
    
    // Find most available team member with relevant expertise
    const reviewers = await this.findAvailableReviewers(codeOwners);
    return this.selectBestReviewer(reviewers, issue.labels);
  }
  
  async createIssueTemplate(type: IssueType): Promise<IssueTemplate> {
    const templates = {
      'bug': {
        title: '🐛 Bug Report: ',
        body: `
## Description
Brief description of the bug

## Steps to Reproduce
1. 
2. 
3. 

## Expected Behavior
What should happen

## Actual Behavior  
What actually happens

## Environment
- OS: 
- Browser: 
- Version: 
        `
      },
      'feature': {
        title: '✨ Feature Request: ',
        body: `
## Summary
Brief description of the feature

## Motivation  
Why is this feature needed?

## Detailed Design
How should this work?

## Alternatives Considered
What other approaches did you consider?
        `
      }
    };
    
    return templates[type];
  }
}
```

### 2. Advanced Pull Request Analytics

Insights into PR patterns and team velocity:

```typescript
class PRAnalytics {
  async calculateTeamVelocity(team: string[], timeframe: number): Promise<VelocityMetrics> {
    const prs = await this.getPullRequestsForTimeframe(team, timeframe);
    
    return {
      averageReviewTime: this.calculateAverageReviewTime(prs),
      mergeSuccess: this.calculateMergeSuccessRate(prs),
      codeChurnRate: this.calculateCodeChurn(prs),
      collaborationScore: this.calculateCollaborationScore(prs)
    };
  }
  
  async generateReviewReport(pullRequest: PullRequest): Promise<ReviewReport> {
    const complexity = await this.analyzeCodeComplexity(pullRequest);
    const testCoverage = await this.calculateTestCoverage(pullRequest);
    const dependencies = await this.analyzeDependencyChanges(pullRequest);
    
    return {
      riskLevel: this.calculateRiskLevel(complexity, testCoverage, dependencies),
      suggestedReviewers: await this.suggestReviewers(pullRequest),
      estimatedReviewTime: this.estimateReviewTime(complexity),
      automatedChecks: await this.runAutomatedChecks(pullRequest)
    };
  }
}
```

### 3. Project Workflow Automation

Custom GitHub Actions integration and workflow triggers:

```typescript
class WorkflowAutomation {
  async setupProjectAutomation(project: Project): Promise<void> {
    const workflows = [
      {
        name: 'Auto-assign Issues',
        trigger: 'issues.opened',
        action: async (issue) => {
          const assignee = await this.findBestAssignee(issue);
          await this.assignIssue(issue, assignee);
        }
      },
      {
        name: 'PR Size Checker',
        trigger: 'pull_request.opened',
        action: async (pr) => {
          const size = await this.calculatePRSize(pr);
          if (size > 500) {
            await this.addLabel(pr, 'large-pr');
            await this.requestReviewBreakdown(pr);
          }
        }
      },
      {
        name: 'Stale Issue Cleanup',
        trigger: 'schedule.daily',
        action: async () => {
          const staleIssues = await this.findStaleIssues();
          for (const issue of staleIssues) {
            await this.addStaleComment(issue);
          }
        }
      }
    ];
    
    await this.registerWorkflows(project, workflows);
  }
}
```

## Lessons Learned Building Andúril

### 1. GitHub API Complexity

Working with GitHub's API taught me about enterprise integration challenges:

- **Rate limiting** requires sophisticated request queuing
- **Webhook reliability** needs robust error handling and retries
- **Data consistency** between GitHub and local state is tricky

### 2. Developer Tool UX is Different

Building for developers requires different UX principles:

- **Keyboard shortcuts** are absolutely critical
- **Command palette** feels more natural than traditional menus
- **Real-time feedback** prevents context switching anxiety
- **Customization** is expected, not optional

### 3. Productivity Tool Architecture

Effective productivity tools need specific architectural patterns:

```typescript
// Event-driven architecture for GitHub updates
class EventBus {
  private handlers = new Map<string, EventHandler[]>();
  
  on<T>(event: string, handler: (data: T) => void) {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)?.push(handler);
  }
  
  emit<T>(event: string, data: T) {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach(handler => handler(data));
  }
}

// Usage for GitHub events
eventBus.on('github:issue:opened', (issue) => {
  notificationManager.notify(`New issue: ${issue.title}`);
  analyticsTracker.track('issue_created', issue);
});

eventBus.on('github:pr:merged', (pr) => {
  celebrationManager.celebrate(`🎉 PR merged: ${pr.title}`);
  velocityTracker.recordMerge(pr);
});
```

## What I Discovered About Developer Tools

### Essential Components

1. **GitHub Integration Layer** - Robust API client with rate limiting
2. **Real-time Synchronization** - WebSocket-based updates
3. **Command Interface** - Keyboard-driven interactions
4. **Analytics Engine** - Insights into team productivity

### Performance Considerations

- **Optimistic updates** for better perceived performance
- **Background synchronization** to keep data fresh
- **Intelligent caching** to reduce API calls
- **Lazy loading** for large repositories

## Technical Stack Summary

**Frontend:**

- Next.js 14 with TypeScript
- React 18 with modern hooks
- Tailwind CSS for styling
- Radix UI for accessible components

**Backend & Integration:**

- GitHub API via Octokit
- PostgreSQL with Prisma ORM
- WebSocket for real-time updates
- GitHub App for enhanced permissions

**Developer Experience:**

- Command palette with fuzzy search
- Comprehensive keyboard shortcuts
- Dark mode optimized for coding
- Responsive design for all screen sizes

## Building in Public: What I Learned

Creating Andúril taught me valuable lessons about developer tooling:

### About GitHub Integration

- The complexity of maintaining consistent state with external APIs
- How webhook reliability impacts user experience
- The importance of graceful degradation when APIs are unavailable

### About Developer Productivity

- Small improvements in daily workflows compound significantly
- Context switching is the biggest productivity killer
- Automation should enhance human decision-making, not replace it

### About Tool Adoption

- Developers prefer tools that integrate with existing workflows
- Customization and keyboard shortcuts drive power user adoption
- Performance and reliability matter more than features

## The Numbers After 8 Months

While Andúril is primarily an exploration project:

- **8,000+ lines** of TypeScript code
- **100+ React components** with full accessibility
- **30+ GitHub API endpoints** integrated
- **50+ keyboard shortcuts** for power users

## Explore Andúril

Andúril is live at [anduril.onrender.com](https://anduril.onrender.com) and available on [GitHub](https://github.com/jonathancaleb/Anduril). It demonstrates:

- Deep GitHub integration patterns
- Real-time collaborative features
- Developer-focused UX design
- Scalable productivity tool architecture

The most valuable insight? **Great developer tools feel like natural extensions of your existing workflow**.

---

*This is part of my "building in public" series where I explore how complex tools work by building them from scratch. Andúril taught me more about developer productivity and GitHub integration than years of using existing tools.*
