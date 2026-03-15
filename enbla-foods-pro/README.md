# Enbla Foods - Professional Food Delivery Dashboard

A high-performance, responsive food delivery interface built with **React** and **Tailwind CSS**. This project demonstrates industry-standard practices in state management and modular architecture.

## 🚀 Key Professional Features
- **Modular Component Architecture**: Separated Logic (Hooks), UI (Components), and Data (Constants).
- **Persistent Cart Engine**: Utilizes `LocalStorage` to maintain user selections across sessions without requiring a database hit.
- **Dynamic Localization**: Full support for English and Amharic toggling using a centralized translation dictionary.
- **Independent Scroll Layout**: Advanced CSS/Tailwind layout allowing independent scrolling of menu and cart while keeping navigation fixed.

## 🛠 Tech Stack
- **Frontend**: React.js
- **Styling**: Tailwind CSS (Utility-first approach)
- **State**: Custom React Hooks (`useCart`)
- **Icons**: Lucide-React / Heroicons

## 🧠 Engineering Decisions
### Why LocalStorage?
I implemented `LocalStorage` to enhance User Experience (UX). It allows guest users to build a cart instantly without the latency of a database call or the friction of a login screen.

### Independent Scrolling
To ensure a "Desktop App" feel, I utilized `flex-1 overflow-y-auto` combined with `h-screen`. This prevents the entire page from scrolling and keeps the professional sidebar and total calculations pinned.