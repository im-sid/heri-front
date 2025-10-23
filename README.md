# 🎨 Heri-Sci Frontend

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=flat-square&logo=tailwind-css)

**Modern React Frontend for AI-Powered Historical Artifact Analysis**

[Features](#-features) • [Installation](#-installation) • [Configuration](#-configuration) • [Deployment](#-deployment)

</div>

---

## 🌟 Overview

The Heri-Sci frontend is a modern Next.js application built with TypeScript, React, and Tailwind CSS. It provides an intuitive interface for AI-powered historical artifact analysis, image enhancement, and creative sci-fi story generation.

---

## ✨ Features

### 🔬 **AI Lab**
- Image upload with drag-and-drop
- Real-time super-resolution and restoration
- Side-by-side image comparison slider
- AI-powered chat with Gemini 2.0 Flash
- Automatic artifact detection and Wikipedia integration

### 🚀 **Sci-Fi Writer**
- 25+ genre selection with multi-select
- Custom story preferences
- Real-time story generation
- Interactive story development
- Export stories as text files

### 🖼️ **Gallery**
- Unified session management
- Search and filter capabilities
- Session continuation
- Image downloads
- Chat history viewer

### 🎨 **UI/UX**
- Responsive design (mobile, tablet, desktop)
- Dark theme with ancient artifact aesthetics
- Smooth animations and transitions
- Toast notifications
- Loading states and error handling

---

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running (see [backend repo](https://github.com/im-sid/heri-back))
- Firebase project for authentication and Firestore

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/im-sid/heri-front.git
cd heri-front
```

#### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

#### 3. Configure Environment
```bash
# Copy example environment file
cp .env.local.example .env.local

# Edit .env.local with your configuration
```

#### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Configuration

### Environment Variables

Create `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend-url.com
# For local development: http://localhost:5000
```

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Enable Firestore Database

2. **Get Firebase Config**
   - Project Settings → General → Your apps
   - Copy config values to `.env.local`

3. **Set Firestore Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

4. **Deploy Firestore Indexes**
   ```bash
   firebase login
   firebase init firestore
   firebase deploy --only firestore:indexes
   ```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── chatbot/           # AI Lab page
│   │   ├── scifi-writer/      # Sci-Fi Writer page
│   │   ├── gallery/           # Gallery page
│   │   ├── gemini-chat/       # Direct Gemini chat
│   │   └── layout.tsx         # Root layout
│   │
│   ├── components/            # React components
│   │   ├── chatbot/          # AI Lab components
│   │   ├── scifi/            # Sci-Fi Writer components
│   │   ├── gallery/          # Gallery components
│   │   └── layout/           # Layout components
│   │
│   ├── lib/                  # Utilities
│   │   ├── firebase.ts       # Firebase config
│   │   ├── firestore.ts      # Firestore operations
│   │   ├── scifiFirestore.ts # Sci-Fi Firestore
│   │   ├── storage.ts        # Image storage
│   │   ├── imageUtils.ts     # Image compression
│   │   └── api.ts            # API utilities
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useImageProcessing.ts
│   │   └── useGalleryRefresh.ts
│   │
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx   # Authentication
│   │
│   └── styles/               # Global styles
│       ├── globals.css
│       └── responsive.css
│
├── public/                   # Static assets
├── .env.local.example        # Environment template
├── next.config.js            # Next.js config
├── tailwind.config.ts        # Tailwind config
├── tsconfig.json             # TypeScript config
└── package.json              # Dependencies
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

### Adding New Features

1. **Create Component**
   ```tsx
   // src/components/feature/MyComponent.tsx
   export default function MyComponent() {
     return <div>My Component</div>
   }
   ```

2. **Create Page**
   ```tsx
   // src/app/my-page/page.tsx
   export default function MyPage() {
     return <div>My Page</div>
   }
   ```

3. **Add Route**
   - Next.js automatically creates routes from `app/` directory structure

---

## 🎨 Styling

### Tailwind CSS

The project uses Tailwind CSS with custom theme:

```javascript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: '#D4AF37',
      secondary: '#8B7355',
      dark: '#1A1A1A',
      wheat: '#F5DEB3',
    }
  }
}
```

### Custom Classes

- `.glass-effect` - Glassmorphism effect
- `.stone-texture` - Ancient stone texture
- `.text-glow` - Text glow effect
- `.ancient-glyph` - Ancient font styling

---

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Add environment variables
   - Deploy

### Other Platforms

The app can be deployed to:
- Netlify
- AWS Amplify
- Google Cloud Run
- Docker container

### Build for Production

```bash
npm run build
npm start
```

---

## 🔧 Troubleshooting

### Common Issues

**1. Firebase Connection Error**
- Check Firebase config in `.env.local`
- Verify Firebase project is active
- Check Firestore rules

**2. API Connection Error**
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check backend is running
- Check CORS settings on backend

**3. Build Errors**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

**4. Type Errors**
```bash
# Run type check
npm run type-check
```

---

## 📊 Performance

### Optimization Features

- **Image Compression**: Automatic compression to 1200x900 @ 85%
- **Lazy Loading**: Components and images load on demand
- **Code Splitting**: Automatic with Next.js
- **Static Generation**: Pre-rendered pages where possible
- **API Caching**: Cached responses for repeated requests

### Lighthouse Scores

- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 100

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] User authentication (sign up, login, logout)
- [ ] Image upload and processing
- [ ] AI chat functionality
- [ ] Sci-fi story generation
- [ ] Gallery operations (save, load, delete)
- [ ] Responsive design on all devices
- [ ] Error handling and edge cases

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🔗 Links

- **Main Repository**: https://github.com/im-sid/heri
- **Frontend Repository**: https://github.com/im-sid/heri-front
- **Backend Repository**: https://github.com/im-sid/heri-back
- **Live Demo**: [Your deployed URL]

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/im-sid/heri-front/issues)
- **Discussions**: [GitHub Discussions](https://github.com/im-sid/heri-front/discussions)

---

<div align="center">

**Made with ❤️ by the Heri-Sci Team**

</div>
