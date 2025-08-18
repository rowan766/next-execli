// src/app/page.tsx - 使用 UserCard 组件的示例
'use client'

import { useState } from 'react'
import Counter from '@/components/Counter'
import UserCard, { UserList } from '@/components/UserCard'

// 模拟用户数据
const mockUsers = [
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    // 没有 avatar，会显示首字母
  },
  {
    id: 3,
    name: '王五',
    email: 'wangwu@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu'
  }
]

export default function HomePage() {
  const [activeUserId, setActiveUserId] = useState<number>(1)

  // 面试重点：回调函数的定义和使用
  const handleUserEdit = (user: any) => {
    alert(`编辑用户: ${user.name}`)
    console.log('用户信息:', user)
  }

  const handleUserSelect = (userId: number) => {
    setActiveUserId(userId)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">
        Next.js 面试知识点 Demo
      </h1>
      
      <div className="grid gap-8 lg:grid-cols-2">
        {/* 左侧：基础组件 */}
        <div className="space-y-6">
          <Counter />
          
          {/* 面试重点：单个 UserCard 的使用方式 */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">单个用户卡片</h2>
            
            {/* 方式 1: 传递所有必需参数 */}
            <UserCard 
              user={mockUsers[0]} 
              onEdit={handleUserEdit}
              isActive={true}
            />
            
            {/* 方式 2: 只传递必需参数，其他使用默认值 */}
            <UserCard 
              user={mockUsers[1]} 
            />
            
            {/* 方式 3: 传递回调函数但不激活 */}
            <UserCard 
              user={mockUsers[2]} 
              onEdit={handleUserEdit}
              isActive={false}
            />
          </div>
        </div>

        {/* 右侧：用户列表 */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">用户管理</h2>
            
            {/* 控制按钮 */}
            <div className="mb-4 space-x-2">
              {mockUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className={`px-3 py-1 rounded text-sm ${
                    activeUserId === user.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200'
                  }`}
                >
                  选择 {user.name}
                </button>
              ))}
            </div>
            
            {/* 用户列表组件 */}
            <UserList 
              users={mockUsers}
              activeUserId={activeUserId}
            />
          </div>
        </div>
      </div>
    </main>
  )
}