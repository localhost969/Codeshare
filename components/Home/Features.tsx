import LockIcon from '@mui/icons-material/Lock';
import ShareIcon from '@mui/icons-material/Share';
import CodeIcon from '@mui/icons-material/Code';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import Brightness6Icon from '@mui/icons-material/Brightness6';
import SpeedIcon from '@mui/icons-material/Speed';

export default function Features() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: 'var(--muted)' }}>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl border border-(--border)" style={{ backgroundColor: 'var(--background)' }}>
            <LockIcon className="text-6xl mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="text-2xl font-semibold mb-4">Secure Access</h3>
            <p className="text-(--muted) leading-relaxed">
              Simple username and password authentication. Your code snippets are protected and accessible only to you and those you share with.
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-(--border)" style={{ backgroundColor: 'var(--background)' }}>
            <ShareIcon className="text-6xl mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="text-2xl font-semibold mb-4">Real-Time Sharing</h3>
            <p className="text-(--muted) leading-relaxed">
              Share code snippets instantly. Collaborate in real-time with multiple users, just like protectedtext.com but designed for code.
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-(--border)" style={{ backgroundColor: 'var(--background)' }}>
            <CodeIcon className="text-6xl mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="text-2xl font-semibold mb-4">Syntax Highlighting</h3>
            <p className="text-(--muted) leading-relaxed">
              Beautiful code display with syntax highlighting for multiple programming languages. Clean, readable, and professional.
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-(--border)" style={{ backgroundColor: 'var(--background)' }}>
            <PhoneAndroidIcon className="text-6xl mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="text-2xl font-semibold mb-4">Responsive Design</h3>
            <p className="text-(--muted) leading-relaxed">
              Works seamlessly on desktop, tablet, and mobile devices. Code sharing on the go.
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-(--border)" style={{ backgroundColor: 'var(--background)' }}>
            <Brightness6Icon className="text-6xl mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="text-2xl font-semibold mb-4">Dark & Light Themes</h3>
            <p className="text-(--muted) leading-relaxed">
              Switch between light and dark themes for comfortable coding in any environment.
            </p>
          </div>
          <div className="text-center p-6 rounded-2xl border border-(--border)" style={{ backgroundColor: 'var(--background)' }}>
            <SpeedIcon className="text-6xl mb-4" style={{ color: 'var(--accent)' }} />
            <h3 className="text-2xl font-semibold mb-4">Fast & Reliable</h3>
            <p className="text-(--muted) leading-relaxed">
              Built for performance. Quick load times and reliable real-time synchronization.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}