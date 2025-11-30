import { MailX } from 'lucide-react';
import Link from 'next/link';

export default function InviteNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
              <MailX className="w-8 h-8 text-gray-600 dark:text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Invitation Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The invitation link you&apos;re trying to access is invalid, expired, or
              has been removed. Please contact the event organizer for a new
              invitation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <Link
                href="/"
                className="flex-1 px-4 py-2 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-lg transition-colors text-center font-medium"
              >
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

