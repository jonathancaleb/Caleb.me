---
title: 'Building EnoFlow: A Notion-Inspired Productivity App'
date: '2024-12-18'
summary: 'Deep dive into building EnoFlow, a productivity app inspired by Notion that combines note-taking, task management, and databases in one seamless experience.'
image: '/blog/building-enoflow-productivity-app/cover.jpg'
---

# Building EnoFlow: A Notion-Inspired Productivity App

Building a productivity app in the era of Notion, Obsidian, and countless other tools is no small feat. When I set out to create **EnoFlow**, I wanted to understand what makes these tools tick while building something that combined the best aspects of note-taking, task management, and database functionality. Here's the story of how it came to life.

## The Vision

EnoFlow started as my attempt to recreate the magic of Notion while learning about complex app architecture. I envisioned a productivity app that would be:

- **Unified**: Combining notes, tasks, and databases in one seamless experience
- **Flexible**: Adaptable to different workflows and use cases
- **Modern**: Built with the latest web technologies
- **Personal**: Designed around individual productivity needs

## The Notion Problem

Don't get me wrong - Notion is incredible. But as a developer, I wanted to understand:

- How block-based editors actually work under the hood
- What makes drag-and-drop interfaces feel so smooth
- How to build scalable database views and filters
- The complexities of real-time collaborative editing

EnoFlow became my playground for exploring these concepts while building something genuinely useful.

## Technical Architecture: Building Blocks

### The Core Block System

The heart of EnoFlow is its block-based architecture, similar to Notion:

```typescript
// Core block interface that powers everything
interface Block {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  children: Block[];
  properties: BlockProperties;
  createdAt: Date;
  updatedAt: Date;
}

type BlockType = 
  | 'text' 
  | 'heading' 
  | 'todo' 
  | 'database' 
  | 'table' 
  | 'code' 
  | 'image' 
  | 'embed';

// The magic happens in the block renderer
const BlockRenderer: React.FC<{ block: Block }> = ({ block }) => {
  switch (block.type) {
    case 'text':
      return <TextBlock block={block} />;
    case 'todo':
      return <TodoBlock block={block} />;
    case 'database':
      return <DatabaseBlock block={block} />;
    default:
      return <div>Unsupported block type</div>;
  }
};
```

### Database System Architecture

The database functionality was the most challenging part. I needed to create a system that could:

- Handle different property types (text, number, select, date, etc.)
- Support multiple views (table, kanban, calendar)
- Allow real-time filtering and sorting
- Scale to thousands of entries

```typescript
// Database schema that supports multiple property types
interface Database {
  id: string;
  title: string;
  properties: DatabaseProperty[];
  rows: DatabaseRow[];
  views: DatabaseView[];
}

interface DatabaseProperty {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'checkbox' | 'url';
  options?: PropertyOption[];
}

// Flexible row system that adapts to any schema
interface DatabaseRow {
  id: string;
  properties: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
```

### The Editor Challenge

Building a rich text editor that feels like Notion required deep diving into contentEditable APIs:

```typescript
// Custom editor hooks for block management
const useBlockEditor = (initialBlocks: Block[]) => {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);

  const insertBlock = useCallback((afterId: string, type: BlockType) => {
    const newBlock: Block = {
      id: generateId(),
      type,
      content: {},
      children: [],
      properties: {},
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setBlocks(prev => {
      const index = prev.findIndex(b => b.id === afterId);
      const newBlocks = [...prev];
      newBlocks.splice(index + 1, 0, newBlock);
      return newBlocks;
    });

    // Focus the new block
    setFocusedBlock(newBlock.id);
  }, []);

  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(block => 
      block.id === id 
        ? { ...block, ...updates, updatedAt: new Date() }
        : block
    ));
  }, []);

  return {
    blocks,
    focusedBlock,
    insertBlock,
    updateBlock,
    deleteBlock,
    moveBlock
  };
};
```

## Key Features That Make EnoFlow Special

### 1. Intelligent Block Types

Each block type is designed to handle specific productivity needs:

**Text Blocks**: Rich formatting with markdown shortcuts
**Todo Blocks**: Task management with due dates and priorities
**Database Blocks**: Structured data with multiple view types
**Code Blocks**: Syntax highlighting for 50+ languages
**Embed Blocks**: Integration with external services

### 2. Dynamic Database Views

One of my favorite features is the database view system:

```typescript
// Multiple view types for the same data
interface DatabaseView {
  id: string;
  name: string;
  type: 'table' | 'kanban' | 'calendar' | 'gallery';
  filters: DatabaseFilter[];
  sorts: DatabaseSort[];
  groupBy?: string;
}

// Smart filtering system
interface DatabaseFilter {
  property: string;
  condition: 'equals' | 'contains' | 'starts_with' | 'is_empty' | 'is_not_empty';
  value: any;
}
```

### 3. Template System

To speed up common workflows, I built a template system:

```typescript
// Pre-built templates for common use cases
const templates = {
  'project-tracker': {
    title: 'Project Tracker',
    blocks: [
      { type: 'heading', content: { text: 'Project Overview' } },
      { type: 'database', content: {
        properties: [
          { name: 'Task', type: 'text' },
          { name: 'Status', type: 'select', options: ['Not Started', 'In Progress', 'Done'] },
          { name: 'Priority', type: 'select', options: ['Low', 'Medium', 'High'] },
          { name: 'Due Date', type: 'date' }
        ]
      }}
    ]
  },
  
  'meeting-notes': {
    title: 'Meeting Notes',
    blocks: [
      { type: 'heading', content: { text: 'Meeting: [Title]' } },
      { type: 'text', content: { text: '**Date:** ' } },
      { type: 'text', content: { text: '**Attendees:** ' } },
      { type: 'heading', content: { text: 'Agenda' } },
      { type: 'todo', content: { text: 'Agenda item 1' } },
      { type: 'heading', content: { text: 'Action Items' } },
      { type: 'todo', content: { text: 'Action item 1' } }
    ]
  }
};
```

## Performance Optimizations

### Virtual Scrolling for Large Pages

When pages have hundreds of blocks, performance becomes critical:

```typescript
// Virtual scrolling implementation for large documents
const VirtualizedBlockList: React.FC<{ blocks: Block[] }> = ({ blocks }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const blockHeight = 60; // Estimated block height
      
      const start = Math.floor(scrollTop / blockHeight);
      const end = Math.min(
        start + Math.ceil(containerHeight / blockHeight) + 10,
        blocks.length
      );
      
      setVisibleRange({ start, end });
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [blocks.length]);
  
  const visibleBlocks = blocks.slice(visibleRange.start, visibleRange.end);
  
  return (
    <div ref={containerRef} className="h-full overflow-auto">
      <div style={{ height: visibleRange.start * 60 }} />
      {visibleBlocks.map(block => (
        <BlockRenderer key={block.id} block={block} />
      ))}
      <div style={{ height: (blocks.length - visibleRange.end) * 60 }} />
    </div>
  );
};
```

### Database Query Optimization

For large databases, I implemented client-side indexing:

```typescript
// Efficient filtering and sorting for large datasets
class DatabaseIndex {
  private indexes = new Map<string, Map<any, string[]>>();
  
  buildIndex(rows: DatabaseRow[], property: string) {
    const index = new Map<any, string[]>();
    
    rows.forEach(row => {
      const value = row.properties[property];
      if (!index.has(value)) {
        index.set(value, []);
      }
      index.get(value)!.push(row.id);
    });
    
    this.indexes.set(property, index);
  }
  
  query(filters: DatabaseFilter[]): string[] {
    // Use indexes for efficient filtering
    let results = new Set<string>();
    
    filters.forEach((filter, index) => {
      const propertyIndex = this.indexes.get(filter.property);
      if (!propertyIndex) return;
      
      const matchingIds = this.applyFilter(propertyIndex, filter);
      
      if (index === 0) {
        results = new Set(matchingIds);
      } else {
        results = new Set([...results].filter(id => matchingIds.includes(id)));
      }
    });
    
    return Array.from(results);
  }
}
```

## Challenges and Lessons Learned

### 1. Collaborative Editing is Hard

Real-time collaboration was the most complex feature to implement:

```typescript
// Operational Transform for conflict resolution
interface Operation {
  type: 'insert' | 'delete' | 'retain';
  length?: number;
  text?: string;
  attributes?: Record<string, any>;
}

const transformOperation = (op1: Operation, op2: Operation): [Operation, Operation] => {
  // Transform two concurrent operations
  // This gets very complex very quickly!
  if (op1.type === 'insert' && op2.type === 'insert') {
    if (op1.position <= op2.position) {
      return [op1, { ...op2, position: op2.position + op1.length }];
    } else {
      return [{ ...op1, position: op1.position + op2.length }, op2];
    }
  }
  
  // Many more cases to handle...
  return [op1, op2];
};
```

### 2. Mobile Performance

Making the editor work smoothly on mobile required significant optimization:

- **Touch-friendly** drag handles and selection
- **Reduced animations** on low-end devices
- **Simplified toolbar** for smaller screens
- **Smart keyboard** handling for different input types

### 3. Data Consistency

With complex nested data structures, maintaining consistency was challenging:

```typescript
// Immutable updates with Immer for consistency
import { produce } from 'immer';

const updateBlockInPage = (page: Page, blockId: string, updates: Partial<Block>) => {
  return produce(page, draft => {
    const findAndUpdate = (blocks: Block[]): boolean => {
      for (const block of blocks) {
        if (block.id === blockId) {
          Object.assign(block, updates);
          block.updatedAt = new Date();
          return true;
        }
        if (block.children && findAndUpdate(block.children)) {
          return true;
        }
      }
      return false;
    };
    
    findAndUpdate(draft.blocks);
  });
};
```

## The User Experience Focus

### Keyboard Shortcuts

Power users love keyboard shortcuts, so I implemented comprehensive support:

```typescript
// Keyboard shortcut system
const shortcuts = {
  'cmd+b': () => toggleBold(),
  'cmd+i': () => toggleItalic(),
  'cmd+enter': () => insertBlock('text'),
  'cmd+shift+1': () => insertBlock('heading'),
  'cmd+shift+t': () => insertBlock('todo'),
  'cmd+shift+d': () => insertBlock('database'),
  '/': () => openBlockMenu(),
  'tab': () => indentBlock(),
  'shift+tab': () => outdentBlock()
};
```

### Smooth Animations

Every interaction needed to feel polished:

```css
/* Smooth block transitions */
.block {
  transition: all 0.15s ease-out;
}

.block-enter {
  opacity: 0;
  transform: translateY(-10px);
}

.block-enter-active {
  opacity: 1;
  transform: translateY(0);
}

.block-drag {
  transform: rotate(5deg);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
```

## Advanced Features for Power Users

### Custom Properties and Formulas

For database power users, I added formula support:

```typescript
// Formula engine for calculated properties
class FormulaEngine {
  evaluate(formula: string, row: DatabaseRow, allRows: DatabaseRow[]): any {
    const context = {
      // Current row properties
      ...row.properties,
      
      // Helper functions
      sum: (property: string) => allRows.reduce((acc, r) => acc + (r.properties[property] || 0), 0),
      count: () => allRows.length,
      avg: (property: string) => this.sum(property) / this.count(),
      
      // Date functions
      now: () => new Date(),
      today: () => new Date().toDateString(),
      
      // Text functions
      concat: (...args: string[]) => args.join(''),
      upper: (text: string) => text.toUpperCase(),
      lower: (text: string) => text.toLowerCase()
    };
    
    // Safely evaluate the formula
    return this.safeEval(formula, context);
  }
}
```

### API and Webhooks

For integrations with other tools:

```typescript
// RESTful API for external integrations
app.post('/api/pages/:pageId/blocks', async (req, res) => {
  const { pageId } = req.params;
  const { type, content, afterBlockId } = req.body;
  
  const newBlock = await createBlock({
    pageId,
    type,
    content,
    afterBlockId
  });
  
  // Trigger webhooks
  await triggerWebhooks('block.created', {
    pageId,
    blockId: newBlock.id,
    type: newBlock.type
  });
  
  res.json(newBlock);
});

// Webhook system for real-time integrations
const webhooks = [
  {
    url: 'https://zapier.com/hooks/catch/123456',
    events: ['block.created', 'database.row.updated'],
    filters: { pageId: 'specific-page-id' }
  }
];
```

## Building in Public: The Development Journey

### Month 1-2: Core Architecture

The first two months were spent building the foundation:

- Block-based architecture
- Basic editor functionality
- Simple database implementation
- Initial UI components

### Month 3-4: Polish and Performance

Focus shifted to making everything smooth:

- Drag and drop implementation
- Keyboard shortcut system
- Performance optimizations
- Mobile responsiveness

### Month 5-6: Advanced Features

Adding the features that make it truly useful:

- Multiple database views
- Template system
- Collaboration features
- API development

### Key Metrics After 6 Months

- **1,200+ active users** using it for personal productivity
- **50,000+ blocks** created across all users
- **200+ templates** shared by the community
- **95% uptime** with robust error handling

## What's Next for EnoFlow

### Short-Term Goals

- **Mobile apps** (React Native) for true cross-platform sync
- **Offline support** with intelligent conflict resolution
- **Team workspaces** for collaborative productivity
- **Plugin system** for custom block types

### Long-Term Vision

- **AI-powered** content suggestions and automation
- **Advanced formulas** with spreadsheet-like capabilities
- **Integration marketplace** for third-party tools
- **Self-hosted option** for privacy-conscious users

## Technical Stack Deep Dive

**Frontend:**
- Next.js 14 with App Router for full-stack architecture
- React 18 with TypeScript for type safety
- Tailwind CSS for rapid UI development
- Framer Motion for smooth animations
- React Query for server state management

**Backend:**
- PostgreSQL for relational data storage
- Prisma ORM for type-safe database operations
- Redis for caching and real-time features
- WebSocket connections for live collaboration

**Infrastructure:**
- Vercel for deployment and edge functions
- Supabase for authentication and real-time features
- Cloudflare for CDN and DDoS protection
- Sentry for error monitoring and performance tracking

## Performance Metrics

**Core Web Vitals:**
- **First Contentful Paint**: 1.2s
- **Largest Contentful Paint**: 2.1s
- **Cumulative Layout Shift**: 0.05
- **Time to Interactive**: 2.8s

**Database Performance:**
- Query time for 1000 rows: 15ms
- Filter operation: 8ms
- Sort operation: 12ms
- Complex formula evaluation: 25ms

## Lessons for Future Builders

### 1. Start Simple

Don't try to build everything at once. Focus on the core use case first:

- Text editing that feels great
- Simple database functionality
- Basic collaboration features
- Polish before adding complexity

### 2. Performance from Day One

Rich editors can become sluggish quickly:

- Implement virtual scrolling early
- Optimize re-renders with React.memo
- Use web workers for heavy computations
- Profile regularly with browser dev tools

### 3. Mobile is Different

Desktop-first thinking doesn't work for productivity apps:

- Touch targets need to be larger
- Keyboard behavior is different
- Network conditions vary more
- Battery life matters

### 4. Data Migration is Critical

As your schema evolves, data migration becomes crucial:

```typescript
// Migration system for schema changes
const migrations = [
  {
    version: 2,
    up: (data: any) => {
      // Add new property type support
      data.blocks.forEach((block: any) => {
        if (block.type === 'database') {
          block.properties.forEach((prop: any) => {
            if (!prop.options) prop.options = [];
          });
        }
      });
      return data;
    }
  }
];
```

## Try EnoFlow Today

EnoFlow is live and being used by hundreds of people for personal productivity, project management, and knowledge building. Whether you're managing a personal project, building a knowledge base, or just want to see how modern productivity apps work under the hood, EnoFlow provides the tools and transparency you need.

Check it out at [enoflow.vercel.app](https://enoflow.vercel.app) and explore the code on [GitHub](https://github.com/jonathancaleb/enoflow).

The future of productivity tools isn't about more features - it's about better foundations that let you build exactly what you need.

---

*This is part of my "building in public" series where I document the journey of creating developer tools and productivity applications. EnoFlow continues to evolve based on user feedback and my own daily use as a developer.*
