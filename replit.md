# Video Call & Host Platform

## Overview

This is a modern web application built for video calling and host interaction services. The platform allows users to connect with verified hosts through video calls using a coin-based payment system. It features a React frontend with TypeScript, Express.js backend, PostgreSQL database with Drizzle ORM, and a comprehensive UI component library built with shadcn/ui and Tailwind CSS.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Mobile-First**: Responsive design with mobile navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful APIs with JSON responses
- **Error Handling**: Centralized error middleware
- **Development**: Hot reloading with Vite middleware integration

### Data Layer
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with type-safe schema definitions
- **Migrations**: Drizzle Kit for schema migrations
- **Storage Interface**: Abstracted storage layer with memory fallback for development

## Key Components

### Database Schema
- **Users**: Phone-based authentication, coin balance, VIP status
- **Hosts**: User profiles with ratings, earnings, online status, verification
- **Gifts**: Virtual gifts with coin costs and animations
- **Transactions**: Financial records for purchases, calls, and gifts
- **Calls**: Video call records with duration and costs

### Authentication System
- Phone number-based authentication
- Session-less authentication with local storage
- User roles: Regular users, hosts, and admin capabilities

### Payment System
- Coin-based virtual currency
- Predefined coin packages with bonus incentives
- Real-time balance updates during calls
- Transaction history and audit trail

### Video Call Features
- Host availability status
- Real-time coin deduction during calls
- Gift sending during calls
- Call duration tracking
- Mobile-optimized call interface

## Data Flow

1. **User Authentication**: Phone number → Login API → User session → Local storage
2. **Host Discovery**: User browse → Hosts API → Filter/search → Host selection
3. **Video Calls**: Host selection → Balance check → Call initiation → Real-time billing
4. **Payments**: Package selection → Purchase API → Balance update → Transaction record
5. **Gifts**: Gift selection → Balance deduction → Host notification → Animation

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe SQL query builder
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **date-fns**: Date manipulation utilities

### UI Dependencies
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and dev server
- **typescript**: Type checking
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Bundle server code for production

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with Replit modules
- **Database**: PostgreSQL 16 module
- **Port**: Application runs on port 5000
- **Hot Reload**: Vite dev server with Express integration

### Production Build
- **Frontend**: Vite build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Static Files**: Served from Express with Vite-built assets
- **Deployment**: Replit autoscale deployment target

### Environment Configuration
- **DATABASE_URL**: Required for Drizzle database connection
- **NODE_ENV**: Controls development vs production behavior
- **REPL_ID**: Enables Replit-specific development features

## Changelog
```
Changelog:
- June 20, 2025. Initial setup
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```