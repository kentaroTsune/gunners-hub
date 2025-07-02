const Fixtures = () => {
  return (
    <div className="space-y-6 py-8">
      <h2 className="text-2xl font-bold text-gray-800">
        試合日程
      </h2>
      <ul className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <li className="grid grid-rows-subgrid row-span-3 gap-0 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {/* 日付・会場情報 */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">2025年7月23日（水）</p>
                <p className="text-sm text-gray-600 mt-1">20:30 キックオフ</p>
                <p className="text-sm font-medium text-gray-700 mt-2">シンガポール：NATIONAL STADIUM</p>
              </div>
              <ul className="flex justify-end">
                <li className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  FRIENDLY MATCH
                </li>
              </ul>
            </div>
          </div>
          <div className="h-0.5 bg-red-600"></div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">ARS</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">アーセナル</p>
              </div>
              <div className="px-4">
                <span className="text-2xl font-bold text-gray-400">VS</span>
              </div>
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-red-800 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">MIL</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">ACミラン</p>
              </div>
            </div>
          </div>
        </li>
        <li className="grid grid-rows-subgrid row-span-3 gap-0 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {/* 日付・会場情報 */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">2025年7月27日（日）</p>
                <p className="text-sm text-gray-600 mt-1">20:30 キックオフ</p>
                <p className="text-sm font-medium text-gray-700 mt-2">シンガポール：NATIONAL STADIUM</p>
              </div>
              <div className="flex justify-end">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  FRIENDLY MATCH
                </span>
              </div>
            </div>
          </div>
          <div className="h-0.5 bg-red-600"></div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">ARS</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">アーセナル</p>
              </div>
              <div className="px-4">
                <span className="text-2xl font-bold text-gray-400">VS</span>
              </div>
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">NEW</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">ニューカッスル</p>
              </div>
            </div>
          </div>
        </li>
        <li className="grid grid-rows-subgrid row-span-3 gap-0 bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          {/* 日付・会場情報 */}
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <p className="text-lg font-semibold text-gray-900">2025年7月31日（木）</p>
                <p className="text-sm text-gray-600 mt-1">20:30 キックオフ</p>
                <p className="text-sm font-medium text-gray-700 mt-2">香港：啓徳体育園</p>
              </div>
              <div className="flex justify-end">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                  FRIENDLY MATCH
                </span>
              </div>
            </div>
          </div>
          <div className="h-0.5 bg-red-600"></div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">ARS</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">アーセナル</p>
              </div>
              <div className="px-4">
                <span className="text-2xl font-bold text-gray-400">VS</span>
              </div>
              <div className="text-center flex-1">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold text-sm">TOT</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm">トッテナム</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  )
}

export default Fixtures