import { useState } from 'react'
import { SerialInput } from './components/SerialInput'
import { DeviceInfo } from './components/DeviceInfo'
import { DotPattern } from './components/DotPattern'
import { MacRangeTable } from './components/MacRangeTable'
import { IdRangeTable } from './components/IdRangeTable'
import { DarkModeToggle } from './components/DarkModeToggle'
import { useDarkMode } from './hooks/useDarkMode'
import { parseInput, type SupremaDeviceInfo } from './utils/supremaParser'

function App() {
  const [deviceInfo, setDeviceInfo] = useState<SupremaDeviceInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  const handleSearch = async (input: string) => {
    setIsLoading(true)

    // Simulate a small delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const result = parseInput(input)
    setDeviceInfo(result)
    setIsLoading(false)
  }

  const handleReset = () => {
    setDeviceInfo(null)
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
      <DotPattern
        className="fill-gray-400/20 dark:fill-gray-600/20"
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
      />

      <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-600 to-primary-700 rounded-full mb-6 shadow-lg animate-scale-in">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-up transition-colors duration-300">
            Suprema Device Finder
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-slide-up-delay transition-colors duration-300">
            Discover device information including MAC address, model, and generation from your Suprema device serial number
          </p>
        </header>

        <main className="max-w-6xl mx-auto">
          <SerialInput onSearch={handleSearch} isLoading={isLoading} />

          {deviceInfo && (
            <div key={deviceInfo.serialNumber} className="animate-fade-in">
              <DeviceInfo deviceInfo={deviceInfo} />

              <div className="text-center mt-8 animate-slide-up-delay">
                <button
                  onClick={handleReset}
                  className="px-6 py-3 text-primary-600 border-2 border-primary-600 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 hover:scale-105 active:scale-95"
                >
                  Search Another Device
                </button>
              </div>
            </div>
          )}

          {/* Reference Tables - Always visible */}
          <div className="mt-16 space-y-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors duration-300">Device Reference Tables</h2>
              <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">Explore all Suprema device models and their ranges</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MacRangeTable
                currentModelByte={deviceInfo?.macAddress?.replace(/[-:]/g, '').substring(6, 8)}
              />
              <IdRangeTable
                currentModelByte={deviceInfo?.macAddress?.replace(/[-:]/g, '').substring(6, 8)}
              />
            </div>
          </div>
        </main>

        <footer className="mt-16 animate-fade-in-late">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 transition-colors duration-300">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 transition-colors duration-300">
                  Algorithm based on official documentation:
                </p>
                <a
                  href="https://kb.supremainc.com/knowledge/doku.php?id=en:tc_appnote_searching_a_device_s_ip_and_mac_address_manually"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium underline decoration-2 underline-offset-2 hover:decoration-blue-800 dark:hover:decoration-blue-300 transition-colors"
                >
                  Suprema Knowledge Base - Device MAC Address Manual
                </a>
              </div>

              <div className="text-center md:text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 transition-colors duration-300">
                  <strong>Disclaimer:</strong> This tool is not affiliated with or endorsed by Suprema Inc.
                  <br />Suprema® is a registered trademark of Suprema Inc.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-end transition-colors duration-300">
                  Vibe-coded with ❤ by
                  <a
                    href="https://github.com/easis"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white font-medium transition-colors hover:underline"
                  >
                    easis
                  </a>
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
