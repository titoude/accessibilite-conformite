import { chromium } from 'playwright';
// re-teste 3 états corrigés : cast-menu, theme-light-dash, mobile-nav-390
const src = (await import('fs')).readFileSync('./audit.mjs','utf8');
