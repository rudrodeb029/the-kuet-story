# The KUET Story 📖💖

An interactive, romantic digital storybook and proposal web application built with **TanStack Start**, **React 19**, **Tailwind CSS**, and **Firebase / Firestore**.

Live Demo: [https://TheKUETStory.web.app](https://TheKUETStory.web.app)  
Admin Panel: [https://TheKUETStory.web.app/admin](https://TheKUETStory.web.app/admin) *(PIN protected)*

---

## ✨ Features

- **Realistic Flipbook & Book Cover**: 3D perspective opening animation with pages, realistic drop shadows, and delicate page turn sounds.
- **Interactive Love Story**: Multi-chapter heartfelt storytelling with soft watermarks and floating particles.
- **Dynamic Proposal Page**: Interactive "Will You Be Mine?" chapter featuring an evasive "উঁহু" button and celebratory confetti upon acceptance.
- **Real-Time Response Tracker & Admin Panel**: Secure Firestore backend logging proposal responses with timestamp, device information, and a protected dashboard (`/admin`).
- **PWA & Mobile Ready**: Full responsive design optimized for mobile and desktop screens.

---

## 🚀 Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) / Vite 8
- **UI Library**: React 19, Tailwind CSS, Lucide Icons, Canvas Confetti
- **State & Data**: TanStack Query & Router
- **Database**: Cloud Firestore (REST API integration)
- **Deployment**: Firebase Hosting

---

## 🛠️ Getting Started

### Prerequisites

Node.js 20+ and npm.

### Installation

```bash
git clone https://github.com/rudrodeb029/the-kuet-story.git
cd the-kuet-story
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build & Deploy

```bash
npm run build
firebase deploy --only hosting
```
