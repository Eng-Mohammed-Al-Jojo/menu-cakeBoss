import fs from 'fs';

let content = fs.readFileSync('src/index.css', 'utf8');

// 1. Clean up duplicate shadow-button and swiper imports in the middle
content = content.replace(
  /\/\*.*Button Shadows[\s\S]*?--shadow-button:[^;]+;[\s\S]*?--shadow-button:[^;]+;\s*\}/,
  `  /* ── Button Shadows ── */\n  --shadow-button: 0 4px 16px -2px rgba(74, 86, 56, 0.35);\n}`
);

content = content.replace(
  /\/\*\s*Swiper Customization[\s\S]*?@import "swiper\/css\/pagination";\s*/,
  `/* \n   Swiper Customization\n*/\n`
);

// 2. Update bg-page-pattern
content = content.replace(
  /\.bg-page-pattern\s*\{[\s\S]*?radial-gradient\(ellipse at 50% 50%[^}]+\}/,
  `.bg-page-pattern {
  background-color: var(--bg-page);
  background-image:
    radial-gradient(ellipse at 15% 10%, rgba(74, 86, 56, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 85% 90%, rgba(183, 146, 117, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(74, 86, 56, 0.03) 0%, transparent 70%);
}`
);

// 3. Update gold-divider
content = content.replace(
  /\.gold-divider::before,\s*\.gold-divider::after\s*\{[\s\S]*?background: linear-gradient\(90deg, transparent, rgba\(201, 151, 58, 0\.4\), transparent\);\s*\}/,
  `.gold-divider::before,
.gold-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74, 86, 56, 0.35), transparent);
}`
);

content = content.replace(
  /\.gold-divider-dot\s*\{[\s\S]*?box-shadow: 0 0 8px rgba\(201, 151, 58, 0\.5\);\s*\}/,
  `.gold-divider-dot {
  width: 6px;
  height: 6px;
  background: var(--gradient-gold);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(74, 86, 56, 0.4);
}`
);

// 4. Update btn-accent & btn-outline
content = content.replace(
  /\.btn-accent:hover\s*\{[\s\S]*?box-shadow: 0 8px 32px rgba\(122, 23, 51, 0\.4\);\s*\}/,
  `.btn-accent:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 32px rgba(183, 146, 117, 0.4);
}`
);

content = content.replace(
  /\.btn-outline:hover\s*\{[\s\S]*?background: rgba\(201, 151, 58, 0\.08\);[\s\S]*?\}/,
  `.btn-outline:hover {
  background: rgba(74, 86, 56, 0.08);
  border-color: var(--color-primary);
  transform: translateY(-1px);
}`
);

// 5. Update badges
content = content.replace(
  /\.badge-gold\s*\{[\s\S]*?text-transform: uppercase;\s*\}/,
  `.badge-gold {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: linear-gradient(135deg, rgba(107, 123, 83, 0.2), rgba(74, 86, 56, 0.12));
  border: 1px solid var(--border-gold);
  border-radius: 50px;
  color: var(--color-primary-dark);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}`
);

content = content.replace(
  /\.badge-burgundy\s*\{[\s\S]*?text-transform: uppercase;\s*\}/,
  `.badge-burgundy {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  background: linear-gradient(135deg, rgba(203, 170, 143, 0.25), rgba(183, 146, 117, 0.15));
  border: 1px solid var(--border-burgundy);
  border-radius: 50px;
  color: var(--color-accent-dark);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}`
);

// 6. Update keyframes goldGlow
content = content.replace(
  /@keyframes goldGlow\s*\{[\s\S]*?box-shadow: 0 0 32px rgba\(201, 151, 58, 0\.65\);\s*\}\s*\}/,
  `@keyframes goldGlow {
  0%,
  100% {
    box-shadow: 0 0 16px rgba(74, 86, 56, 0.35);
  }

  50% {
    box-shadow: 0 0 32px rgba(74, 86, 56, 0.55);
  }
}`
);

// 7. Update gold-line & burgundy-line
content = content.replace(
  /\.gold-line\s*\{[\s\S]*?box-shadow: 0 1px 8px rgba\(201, 151, 58, 0\.4\);\s*\}/,
  `.gold-line {
  height: 2px;
  background: var(--gradient-gold);
  border-radius: 2px;
  box-shadow: 0 1px 8px rgba(74, 86, 56, 0.3);
}`
);

content = content.replace(
  /\.burgundy-line\s*\{[\s\S]*?box-shadow: 0 1px 8px rgba\(122, 23, 51, 0\.3\);\s*\}/,
  `.burgundy-line {
  height: 2px;
  background: var(--gradient-burgundy);
  border-radius: 2px;
  box-shadow: 0 1px 8px rgba(183, 146, 117, 0.3);
}`
);

// 8. Update input-gold:focus
content = content.replace(
  /\.input-gold:focus\s*\{[\s\S]*?box-shadow: 0 0 0 3px rgba\(201, 151, 58, 0\.12\);\s*\}/,
  `.input-gold:focus {
  border-color: var(--border-gold-heavy);
  background: var(--bg-card);
  box-shadow: 0 0 0 3px rgba(74, 86, 56, 0.12);
}`
);

// 9. Update selection
content = content.replace(
  /::selection\s*\{[\s\S]*?color: var\(--text-main\);\s*\}/,
  `::selection {
  background: rgba(74, 86, 56, 0.2);
  color: var(--text-main);
}`
);

// 10. Update glass-card
content = content.replace(
  /\.glass-card\s*\{[\s\S]*?border: 1px solid rgba\(201, 151, 58, 0\.2\);\s*\}/,
  `.glass-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(74, 86, 56, 0.18);
}`
);

// 11. Update price-tag & unavailable-badge
content = content.replace(
  /\.price-tag\s*\{[\s\S]*?font-size: 0\.85rem;\s*\}/,
  `.price-tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 4px 12px;
  background: linear-gradient(135deg, rgba(74, 86, 56, 0.12), rgba(74, 86, 56, 0.05));
  border: 1px solid var(--border-gold);
  border-radius: 50px;
  color: var(--color-primary-dark);
  font-weight: 800;
  font-size: 0.85rem;
}`
);

content = content.replace(
  /\.unavailable-badge\s*\{[\s\S]*?letter-spacing: 0\.05em;\s*\}/,
  `.unavailable-badge {
  background: linear-gradient(135deg, rgba(90, 105, 68, 0.92), rgba(53, 62, 39, 0.92));
  color: white;
  padding: 3px 10px;
  border-radius: 50px;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}`
);

// 12. Update FAB & Social & star badge
content = content.replace(
  /@keyframes burgundyPulse\s*\{[\s\S]*?box-shadow: 0 8px 32px -4px rgba\(122, 23, 51, 0\.55\), 0 0 0 0 rgba\(122, 23, 51, 0\);\s*\}\s*\}/,
  `@keyframes olivePulse {
  0% {
    box-shadow: 0 8px 32px -4px rgba(61, 72, 46, 0.50), 0 0 0 0 rgba(74, 86, 56, 0.4);
  }

  60% {
    box-shadow: 0 8px 32px -4px rgba(61, 72, 46, 0.50), 0 0 0 12px rgba(74, 86, 56, 0);
  }

  100% {
    box-shadow: 0 8px 32px -4px rgba(61, 72, 46, 0.50), 0 0 0 0 rgba(74, 86, 56, 0);
  }
}`
);

content = content.replace(
  /\.fab-feedback\s*\{[\s\S]*?animation: none;\s*\}/,
  `.fab-feedback {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 200;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #556B43 0%, #334028 100%);
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px -4px rgba(61, 72, 46, 0.50), 0 2px 8px rgba(61, 72, 46, 0.3);
  animation: fabPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both, olivePulse 2.8s ease-out 1.2s infinite;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  outline: none;
}

.fab-feedback:hover {
  transform: scale(1.12) translateY(-2px);
  box-shadow: 0 16px 48px -4px rgba(61, 72, 46, 0.65), 0 4px 12px rgba(61, 72, 46, 0.35);
  animation: none;
}

.fab-feedback:active {
  transform: scale(0.91);
  box-shadow: 0 4px 16px rgba(61, 72, 46, 0.4);
  animation: none;
}`
);

content = content.replace(
  /\.fab-featured\s*\{[\s\S]*?animation: none;\s*\}/,
  `.fab-featured {
  position: fixed;
  top: 24px;
  left: 24px;
  z-index: 40;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #C29B7A 0%, #816148 100%);
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px -4px rgba(129, 97, 72, 0.45), 0 2px 8px rgba(129, 97, 72, 0.25);
  animation: fabPop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  outline: none;
}

.fab-featured:hover {
  transform: scale(1.12) translateY(-2px);
  box-shadow: 0 16px 48px -4px rgba(129, 97, 72, 0.6), 0 4px 12px rgba(129, 97, 72, 0.35);
}

.fab-featured:active {
  transform: scale(0.91);
  box-shadow: 0 4px 16px rgba(129, 97, 72, 0.4);
}`
);

content = content.replace(
  /\.feedback-close-btn:hover\s*\{[\s\S]*?border-color: rgba\(122, 23, 51, 0\.3\);\s*\}/,
  `.feedback-close-btn:hover {
  background: rgba(74, 86, 56, 0.08);
  color: var(--color-primary);
  border-color: rgba(74, 86, 56, 0.3);
}`
);

content = content.replace(
  /\.social-btn-premium\s*\{[\s\S]*?box-shadow: 0 4px 12px rgba\(122, 23, 51, 0\.35\);\s*\}/,
  `.social-btn-premium {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: linear-gradient(135deg, #556B43 0%, #334028 100%);
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(51, 64, 40, 0.35);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  text-decoration: none;
  flex-shrink: 0;
}

.social-btn-premium::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0);
  transition: background 0.25s ease;
  border-radius: inherit;
}

.social-btn-premium:hover {
  transform: translateY(-5px) scale(1.12);
  box-shadow: 0 14px 36px rgba(51, 64, 40, 0.5), 0 0 0 4px rgba(107, 132, 87, 0.2);
}

.social-btn-premium:hover::after {
  background: rgba(255, 255, 255, 0.14);
}

.social-btn-premium:active {
  transform: scale(0.88);
  box-shadow: 0 4px 12px rgba(51, 64, 40, 0.35);
}`
);

content = content.replace(
  /\.star-badge-burgundy\s*\{[\s\S]*?z-index: 10;\s*\}/,
  `.star-badge-burgundy {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #B79275, #8E684B);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(142, 104, 75, 0.4);
  z-index: 10;
}`
);

fs.writeFileSync('src/index.css', content, 'utf8');
console.log('src/index.css successfully updated!');
