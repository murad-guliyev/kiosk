/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: 'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
          accent: 'var(--color-brand-accent)',
        },
        surface: {
          default: 'var(--color-surface-default)',
          muted: 'var(--color-surface-muted)',
          elevated: 'var(--color-surface-elevated)',
          sidebar: 'var(--color-surface-sidebar)',
          'sidebar-hover': 'var(--color-surface-sidebar-hover)',
          'sidebar-active': 'var(--color-surface-sidebar-active)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          sidebar: 'var(--color-text-sidebar)',
          'sidebar-muted': 'var(--color-text-sidebar-muted)',
        },
        border: {
          default: 'var(--color-border-default)',
          light: 'var(--color-border-light)',
          primary: 'var(--color-border-primary)',
          secondary: 'var(--color-border-secondary)',
          strong: 'var(--color-border-strong)',
        },
        fg: {
          default: 'var(--color-fg-default)',
          secondary: 'var(--color-fg-secondary)',
          muted: 'var(--color-fg-muted)',
        },
        positive: 'var(--color-positive)',
        negative: 'var(--color-negative)',
        warning: 'var(--color-warning)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        sm: 'var(--radius-sm)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        elevated: 'var(--shadow-elevated)',
      },
    },
  },
  plugins: [],
}
