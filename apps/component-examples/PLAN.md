# Enhanced Component Examples System - Task Breakdown

## Overview

Transform the component examples system to be more flexible and developer-friendly by adding JSX templates, live props editing, event logging, and improved navigation.

## Goals

- Abstract Express.js logic for reuse
- Add router to navigate between examples
- Add initial page with navigation links
- Expose single command to run all examples
- Add TypeScript and JSX support (without React)
- Add live props editing with real-time updates
- Add comprehensive event logging
- Create three-panel layout (component, props, events)

---

## Phase 1: Infrastructure Setup

### ~~Subtask 1.1: Add TypeScript and JSX Configuration~~ ✅ **COMPLETED**

**Objective**: Set up TypeScript infrastructure with JSX support (without React)

**Deliverables**:

- ✅ Add `tsconfig.json` with JSX configuration (`"jsx": "react"` with custom factory)
- ✅ Update `package.json` to include TypeScript dependencies (`typescript`, `@types/node`, `@types/express`)
- ✅ Create custom JSX renderer for HTML generation
- ✅ Convert `utils/api-paths.js` to TypeScript
- ✅ Add build scripts for TypeScript compilation with JSX

### ~~Subtask 1.2: Create Express Server Abstraction with JSX Support~~ ✅ **COMPLETED**

**Objective**: Extract common Express.js logic and add custom JSX template rendering

**Deliverables**:

- Create `src/server/express-server.ts` with common server setup
- Create `src/server/auth-service.ts` for token management
- Create `src/server/static-assets.ts` for serving static files
- Create `src/server/jsx-renderer.ts` for custom JSX to HTML rendering
- Create `src/templates/base-template.tsx` for common HTML structure
- Update all example files to use the abstracted server logic

---

## Phase 2: Enhanced Template System

### Subtask 2.1: Create JSX Template Components

**Objective**: Replace HTML strings with JSX components using custom renderer

**Deliverables**:

- Create `src/components/ExampleLayout.tsx` - Base layout component
- Create `src/components/ComponentPreview.tsx` - Component display area
- Create `src/components/PropsEditor.tsx` - Live props editing interface
- Create `src/components/EventLogger.tsx` - Event logging display
- Create `src/components/NavigationMenu.tsx` - Navigation component
- Create `src/templates/example-template.tsx` - Main example template

### Subtask 2.2: Create Live Props System

**Objective**: Add interactive props editing with real-time component updates

**Deliverables**:

- Create `src/utils/props-manager.ts` for managing component props
- Create `src/components/PropsForm.tsx` - Dynamic form generation based on component props
- Create `src/utils/prop-schemas.ts` - TypeScript schemas for each component's props
- Add client-side JavaScript for live prop updates
- Create `src/components/PropsPanel.tsx` - Sidebar panel for props editing

---

## Phase 3: Event Logging System

### Subtask 3.1: Create Event Logging Infrastructure

**Objective**: Add comprehensive event logging for all component events

**Deliverables**:

- Create `src/components/EventLogger.tsx` - Real-time event display
- Create `src/utils/event-manager.ts` - Event capture and formatting
- Create `src/types/event-types.ts` - TypeScript interfaces for events
- Add client-side event listeners for all component events
- Create `src/components/EventFilters.tsx` - Filter events by type

### Subtask 3.2: Enhanced Example Layout

**Objective**: Create a three-panel layout with component, props, and events

**Deliverables**:

- Create `src/components/ThreePanelLayout.tsx` - Main layout component
- Create `src/styles/layout.css` - CSS for the three-panel layout
- Create `src/components/ResizablePanels.tsx` - Resizable panel system
- Add responsive design for mobile/tablet views
- Create `src/components/ComponentHeader.tsx` - Component title and description

---

## Phase 4: Navigation and Configuration

### Subtask 4.1: Create Enhanced Router System

**Objective**: Implement a router with metadata for each example

**Deliverables**:

- Create `src/router/example-router.ts` with Express router
- Create `src/router/routes.ts` with route definitions and metadata
- Create `src/types/route-types.ts` - TypeScript interfaces for routes
- Create `src/router/navigation.ts` for navigation logic
- Update server to use the router system

### Subtask 4.2: Create Enhanced Landing Page

**Objective**: Build a comprehensive landing page with example descriptions

**Deliverables**:

- Create `src/pages/LandingPage.tsx` with enhanced navigation
- Create `src/components/ExampleCard.tsx` - Card component for each example
- Create `src/components/SearchFilter.tsx` - Search and filter examples
- Add example descriptions and categories
- Create `src/data/examples-metadata.ts` - Centralized example information

---

## Phase 5: Example Refactoring with New Features

### Subtask 5.1: Convert Examples to JSX Templates

**Objective**: Convert all examples to use JSX templates with live props and event logging

**Deliverables**:

- Convert all `.js` files in `examples/` to `.tsx`
- Create `src/examples/checkout/CheckoutExample.tsx` - Example component
- Create `src/examples/checkout/checkout-props.ts` - Props schema
- Create `src/examples/checkout/checkout-events.ts` - Event handlers
- Repeat for all 25+ examples
- Update all examples to use the new three-panel layout

### Subtask 5.2: Create Component-Specific Props Schemas

**Objective**: Define TypeScript schemas for each component's props

**Deliverables**:

- Create `src/schemas/checkout-props.ts` - Checkout component props
- Create `src/schemas/business-details-props.ts` - Business details props
- Create `src/schemas/payment-details-props.ts` - Payment details props
- Create `src/utils/schema-validator.ts` - Props validation
- Create `src/components/PropsFormGenerator.tsx` - Dynamic form generation

---

## Phase 6: Advanced Features

### Subtask 6.1: Add Code Examples Panel

**Objective**: Show the actual code being used for each example

**Deliverables**:

- Create `src/components/CodePanel.tsx` - Syntax-highlighted code display
- Create `src/utils/code-generator.ts` - Generate code from current props
- Add copy-to-clipboard functionality
- Create `src/components/CodeTabs.tsx` - Tabs for different code views (JSX, HTML, etc.)

### Subtask 6.2: Add State Management

**Objective**: Add state persistence and sharing capabilities

**Deliverables**:

- Create `src/utils/state-manager.ts` - URL-based state management
- Create `src/components/ShareButton.tsx` - Share example state via URL
- Create `src/components/StateHistory.tsx` - Undo/redo functionality
- Add localStorage persistence for user preferences

---

## Phase 7: Package Scripts and Documentation

### Subtask 7.1: Update Package Scripts

**Objective**: Simplify the command structure and add build process for JSX

**Deliverables**:

- Update root `package.json` to have a single `dev:examples` command
- Update `apps/component-examples/package.json` with TypeScript/JSX scripts
- Add build scripts for TypeScript compilation with JSX
- Add development scripts with hot reload
- Remove individual example scripts in favor of router-based navigation

### Subtask 7.2: Enhanced Documentation

**Objective**: Document the new enhanced system

**Deliverables**:

- Create `apps/component-examples/README.md` with usage instructions
- Add JSDoc comments to all TypeScript/JSX files
- Create `docs/examples-development.md` for development guidelines
- Create `docs/component-props.md` - Documentation for all component props
- Update main project README with new example system information

---

## Phase 8: Testing and Validation

### Subtask 8.1: Add Testing Infrastructure

**Objective**: Ensure the new system works correctly

**Deliverables**:

- Add Jest configuration for TypeScript/JSX testing
- Create unit tests for JSX components
- Create integration tests for the props system
- Create tests for event logging functionality
- Add test scripts to package.json

### Subtask 8.2: Final Validation and Cleanup

**Objective**: Final validation and cleanup

**Deliverables**:

- Test all examples work with the new JSX system
- Verify live props editing works for all components
- Ensure event logging captures all component events
- Remove old `.js` files after successful migration
- Update `.gitignore` for TypeScript/JSX build artifacts

---

## Success Criteria

- [ ] Single command (`pnpm dev:examples`) starts all examples
- [ ] Navigation between examples via web interface
- [ ] All examples use JSX templates instead of HTML strings (without React)
- [ ] Live props editing with real-time component updates
- [ ] Comprehensive event logging for all component events
- [ ] Three-panel layout (component, props, events)
- [ ] All examples converted to TypeScript with JSX (no React dependency)
- [ ] Express.js logic abstracted and reusable
- [ ] Developer-friendly landing page with navigation
- [ ] Code examples panel with syntax highlighting
- [ ] State persistence and sharing capabilities
- [ ] All existing functionality preserved
- [ ] Proper documentation and testing in place

## Key Benefits

1. **JSX Templates**: Better maintainability, syntax highlighting, and type safety (without React)
2. **Live Props Editing**: Developers can experiment with different prop combinations without code changes
3. **Event Logging**: Real-time visibility into component behavior and debugging
4. **Three-Panel Layout**: Better organization and developer experience
5. **Code Examples**: Show developers exactly how to use each component
6. **State Management**: Share example states and persist user preferences
7. **Lightweight**: No React runtime overhead, perfect for web components

## Execution Order

1. **Phase 1**: Infrastructure Setup (TypeScript + Express abstraction) - **1.1 COMPLETED** ✅
2. **Phase 2**: Enhanced Template System (JSX components + Live props)
3. **Phase 3**: Event Logging System (Event capture + Three-panel layout)
4. **Phase 4**: Navigation and Configuration (Router + Landing page)
5. **Phase 5**: Example Refactoring (Convert all examples + Props schemas)
6. **Phase 6**: Advanced Features (Code panel + State management)
7. **Phase 7**: Package Scripts and Documentation (Build process + Docs)
8. **Phase 8**: Testing and Validation (Tests + Final cleanup)

Each subtask is designed to be independent enough for background agents to work on, with clear deliverables and success criteria. The order ensures dependencies are met before moving to dependent tasks.
