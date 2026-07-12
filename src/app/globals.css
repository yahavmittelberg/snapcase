@import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap');
@import "tailwindcss";

@theme {
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --font-hebrew: 'Heebo', sans-serif;
  --color-brand-50: #fdf4f5;
  --color-brand-100: #fce8eb;
  --color-brand-200: #f9d5da;
  --color-brand-300: #f3b0ba;
  --color-brand-400: #ea8293;
  --color-brand-500: #dd5570;
  --color-brand-600: #c93357;
  --color-brand-700: #a92548;
  --color-brand-800: #8e2241;
  --color-brand-900: #7a203c;
  --color-warm-50: #fefaf6;
  --color-warm-100: #fdf3ea;
  --color-warm-200: #fbe5d0;
  --color-warm-800: #5c3d1e;
  --color-warm-900: #2d1f0f;
}

@layer base {
  * {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  html[dir="rtl"] {
    font-family: 'Heebo', sans-serif;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideInLeft {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.3s ease-out forwards;
}

.animate-slide-in-left {
  animation: slideInLeft 0.3s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out forwards;
}

.animation-delay-100 { animation-delay: 0.1s; }
.animation-delay-200 { animation-delay: 0.2s; }
.animation-delay-300 { animation-delay: 0.3s; }
.animation-delay-400 { animation-delay: 0.4s; }

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

/* RTL specific adjustments */
[dir="rtl"] .flip-rtl {
  transform: scaleX(-1);
}
