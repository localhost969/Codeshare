import ThemeToggle from '../ThemeToggle';
export default function Footer() { 


    return (    
        <footer
          className="fixed bottom-0 left-0 right-0 border-t py-4 px-6"
          style={{
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            zIndex: 50
          }}
        >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <p className="text-sm" style={{ color: 'var(--muted)' }}>
            © 2025 Codeshare. Built for developers, by developer.
          </p>
          <ThemeToggle />
        </div>
      </footer>

    )

}