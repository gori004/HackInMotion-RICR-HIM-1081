export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} CareerCoach AI. Built for HackInMotion.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="/about" className="hover:text-indigo-600">About</a>
            <a href="/privacy" className="hover:text-indigo-600">Privacy</a>
            <a href="/contact" className="hover:text-indigo-600">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}