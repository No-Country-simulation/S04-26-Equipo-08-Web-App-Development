export default function MainFooter() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-outline-variant bg-background">
      <div className="flex flex-col items-center justify-center gap-6 w-full max-w-7xl mx-auto px-8">
        <div className="flex gap-8">
          <a
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Privacy Policy
          </a>

          <a
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Terms of Service
          </a>

          <a
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
            href="#"
          >
            Support
          </a>
        </div>

        <p className="text-xs text-on-surface-variant">
          © 2026 SilkPortal Administration. All rights reserved.
        </p>
      </div>
    </footer>
  )
}