# BillCheck.pk - Pakistani Utility Bill Checking Platform

## Overview

BillCheck.pk is a comprehensive web application designed to help Pakistani citizens check their utility bills online. The platform supports multiple bill types including electricity (LESCO, FESCO, MEPCO, etc.), gas (SNGPL, SSGCL), mobile, internet, and water bills. The application provides a user-friendly interface for searching and checking bills across various Pakistani utility providers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using React with TypeScript and follows a modern component-based architecture:

- **React Router**: Uses Wouter for client-side routing with support for dynamic routes
- **State Management**: TanStack Query for server state management and caching
- **UI Framework**: Implements Shadcn/UI components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming and consistent design
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Build Tool**: Vite for fast development and optimized production builds

The application follows a feature-based directory structure with reusable UI components, custom hooks, and utility functions. The design system uses a neutral color palette with CSS custom properties for easy theming.

### Backend Architecture
The backend is built as a REST API using Express.js with TypeScript:

- **Framework**: Express.js with middleware for JSON parsing and request logging
- **Architecture Pattern**: Modular route-based architecture with service abstraction
- **Data Layer**: Currently uses in-memory storage with interface abstraction for easy database migration
- **API Design**: RESTful endpoints following standard HTTP conventions
- **Error Handling**: Centralized error handling middleware with consistent error responses

The server implements a storage interface pattern that allows switching between different storage implementations (currently in-memory, designed for future database integration).

### Data Storage Solutions
The application uses a flexible storage architecture:

- **Current Implementation**: In-memory storage for development and testing
- **Database Schema**: Designed with Drizzle ORM for PostgreSQL migration
- **Schema Design**: Three main entities - bill services, bill checks, and bill reminders
- **Data Models**: Type-safe schemas using Drizzle-Zod for validation

The database schema supports bill service management, tracking bill check history, and managing user reminders for bill payments.

### Component Architecture
The UI follows atomic design principles:

- **Base Components**: Reusable UI primitives from Shadcn/UI
- **Feature Components**: Business logic components like BillCard, SearchBar, RecentBills
- **Page Components**: Top-level route components that compose features
- **Layout Components**: Header and Footer for consistent page structure

Components are designed to be responsive and accessible, using semantic HTML and ARIA attributes.

## External Dependencies

### Third-Party Services
- **Neon Database**: PostgreSQL database hosting for production data storage
- **Font Integration**: Google Fonts (Inter) for typography
- **Icon Library**: Font Awesome for utility icons and Lucide React for interface icons

### Development Tools
- **Replit Integration**: Custom Vite plugins for Replit development environment
- **Build Tools**: Vite with React plugin and TypeScript support
- **Code Quality**: ESBuild for server bundling and production optimization

### API Dependencies
- **TanStack Query**: For server state management and caching
- **Zod**: Runtime type validation and schema parsing
- **Drizzle ORM**: Type-safe database queries and migrations

The application is designed to integrate with actual Pakistani utility company APIs for real bill checking functionality, currently using mock data for demonstration purposes.