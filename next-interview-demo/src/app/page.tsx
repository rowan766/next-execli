// src/app/page.tsx
import Counter from '@/components/Counter'
import UserManagement from '@/components/UserManagement'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Next.js 面试知识点 Demo</h1>
        <p className="text-gray-600">涵盖 React Hooks、Context API、TypeScript 等核心概念</p>
      </div>
      
      <div className="grid gap-8">
        {/* React 基础 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">React 基础概念</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Counter />
          </div>
        </section>

        {/* Context API 状态管理 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Context API 全局状态管理</h2>
          <UserManagement />
        </section>

        {/* 即将添加的内容 */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">即将添加的内容</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-3">自定义 Hooks</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• useLocalStorage</li>
                <li>• useDebounce</li>
                <li>• useFetch</li>
              </ul>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-3">性能优化</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• React.memo</li>
                <li>• useMemo</li>
                <li>• useCallback</li>
              </ul>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Next.js 特性</h3>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• SSR / SSG</li>
                <li>• API Routes</li>
                <li>• Dynamic Routes</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}