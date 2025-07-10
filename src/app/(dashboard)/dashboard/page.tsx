"use client";

import { useAuth } from "../../../components/AuthProvider";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gebruikersbeheer</h3>
            <p className="text-gray-600 mb-4">Beheer admin gebruikers en rechten</p>
            <a
              href="/gebruikersbeheer"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Bekijk gebruikers →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Regio's</h3>
            <p className="text-gray-600 mb-4">Beheer regio's en territoria</p>
            <a
              href="/regios"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Bekijk regio's →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Klanten</h3>
            <p className="text-gray-600 mb-4">Beheer klantgegevens</p>
            <a
              href="/klanten"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Bekijk klanten →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verkopers</h3>
            <p className="text-gray-600 mb-4">Beheer verkopers en hun gegevens</p>
            <a
              href="/verkopers"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Bekijk verkopers →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Campagnes</h3>
            <p className="text-gray-600 mb-4">Beheer marketing campagnes</p>
            <a
              href="/campagnes"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Bekijk campagnes →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Gesprekken</h3>
            <p className="text-gray-600 mb-4">Beheer klantgesprekken</p>
            <a
              href="/gesprekken"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Bekijk gesprekken →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Belschema</h3>
            <p className="text-gray-600 mb-4">Beheer belplanningen</p>
            <a
              href="/belschema"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Bekijk belschema →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Logs</h3>
            <p className="text-gray-600 mb-4">Bekijk systeem logs</p>
            <a
              href="/logs"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Bekijk logs →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Rapporten</h3>
            <p className="text-gray-600 mb-4">Bekijk en genereer rapporten</p>
            <a
              href="/rapporten"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Bekijk rapporten →
            </a>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Instellingen</h3>
            <p className="text-gray-600 mb-4">Beheer systeem instellingen</p>
            <a
              href="/instellingen"
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Bekijk instellingen →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 