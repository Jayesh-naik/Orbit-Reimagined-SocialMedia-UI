# Orbit — Reimagine Social

<div align="center">
  <img src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&auto=format&fit=crop&q=80" alt="Universe Orbit Background" width="100%" style="border-radius: 12px;"/>
  <br/><br/>
  <strong>Moments, not metrics.</strong>
  <br/>
  <em>Built for the Frontend Odyssey Hackathon: "Reimagine Social"</em>
</div>

---

## 🚀 The Anti-Feed Thesis

Every existing "anti-feed" app still retains the two mechanics that make social feeds toxic:
1. **Asymmetric Metrics** (followers, likes, streaks).
2. **Permanent Accumulation** (profiles as public grids of past posts).

**Orbit attacks both mechanics directly.** It completely rejects linear feeds, algorithmic recommendations, and follower counts, replacing them with a live **3D radial orbital space**, **decaying moments**, and **mutual-only signal reciprocity**.

---

## ✨ Core Mechanics

### 1. The 3D Orbital Map
Instead of a linear scroll, moments ("Sparks") from other users drift around you in a beautifully crafted 3D trackball-rotatable starfield. Interactions feel spatial, not chronological.

### 2. Decaying Sparks
Nothing accumulates by default. Sparks exist for a limited time (represented by their glow and a countdown) and then vanish forever into the cosmos.

### 3. Mutual-Only Resonance (No "Likes")
Interaction is a two-way signal. You tap "Resonate" on a spark, and it privately pends. Only if the other user also independently resonates does a private chat thread unlock. **Zero public metrics. Zero one-sided broadcasting.**

### 4. Anchoring (Private Sky Sanctuary)
Instead of a public profile that acts as a performance stage, your profile is a **Private Sky**. It only contains the specific moments you deliberately tapped "Anchor" on to save them from decaying. It is visible to nobody but you.

---

## 🎨 Visual & Technical Polish

- **Deep Space Universe Backdrop**: A dynamic background featuring twinkling stars, starlight grid, and glowing nebula gas.
- **Audio Synthesizer Engine**: Crystal-clear Web Audio API generated sound effects for Resonating, Anchoring, and Time pulses—with zero external audio asset dependencies.
- **Fluid Drag Controls**: Full 360° rotation and 2-axis tilting of the 3D orbital plane using cursor tracking.

---

## 🏆 Evaluation Criteria Audit

| Hackathon Requirement | How Orbit Complies |
| :--- | :--- |
| **Originality** | Introduces an entirely original model: Decaying Sparks + 3D Orbital Map + Mutual Resonance. |
| **Meaningful Interaction** | Replaces passive liking/doom-scrolling with 2-way mutual matching. |
| **Visual Design** | 3D tilted planetary space aesthetic, concentric glowing rings, deep universe backdrop. |
| **Functionality** | 100% interactive frontend prototype. Try the "Let moment pass" button to see time decay! |
| **Responsiveness** | Mobile-first adaptive layout with a floating action navigation pill. |

---

## 💻 Running Locally

This project is built using **React 18**, **Vite**, **Tailwind CSS**, and **Framer Motion**.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jayesh-naik/Orbit-Reimagined-SocialMedia-UI.git
   cd Orbit-Reimagined-SocialMedia-UI
   ```

2. Navigate to the client folder and install dependencies:
   ```bash
   cd client
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

> **Note on APIs:** This prototype uses local storage for state persistence and does not require any external API keys or `.env` files. Images are served via Unsplash source URLs. All audio is synthesized procedurally in the browser.

---

<div align="center">
  <em>A sanctuary from the algorithm.</em>
</div>
