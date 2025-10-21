export default function Footer() {
  return (
    <footer className="mt-auto py-6 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Developed by{' '}
            <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Supreme Info Tech
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            © {new Date().getFullYear()} Supreme Temple Jewellery. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
