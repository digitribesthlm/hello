export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-400">
              AdsKeywords helps you manage and optimize your advertising keywords effectively.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="text-gray-400 hover:text-white">Dashboard</a></li>
              <li><a href="/keywords" className="text-gray-400 hover:text-white">Keywords</a></li>
              <li><a href="/campaigns" className="text-gray-400 hover:text-white">Campaigns</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-gray-400">
              Email: support@adskeywords.com<br />
              Phone: (123) 456-7890
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2024 AdsKeywords. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 