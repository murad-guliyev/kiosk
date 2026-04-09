/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-brand-primary)',
          secondary: 'var(--color-brand-secondary)',
        },
        surface: {
          default: 'var(--color-surface-default)',
          muted: 'var(--color-surface-muted)',
          sidebar: 'var(--color-surface-sidebar)',
          'sidebar-hover': 'var(--color-surface-sidebar-hover)',
          'sidebar-active': 'var(--color-surface-sidebar-active)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          sidebar: 'var(--color-text-sidebar)',
          'sidebar-muted': 'var(--color-text-sidebar-muted)',
        },
        border: {
          default: 'var(--color-border-default)',
        },
      },
      borderRadius: {
        card: 'var(--radius-card)',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },
    },
  },
  plugins: [],
}
