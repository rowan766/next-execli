// src/components/UserManagement.tsx
'use client'

import { useState } from 'react'
import { useUser, useCurrentUser, useUsers } from '@/contexts/UserContext'

// 用户编辑表单组件
function UserEditForm() {
  const { addUser, updateUser } = useUser()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user' as 'admin' | 'user' | 'guest'
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingId) {
      // 更新用户
      updateUser(editingId, formData)
      setEditingId(null)
    } else {
      // 添加新用户
      const newUser = {
        id: Date.now(), // 简单的 ID 生成
        ...formData
      }
      addUser(newUser)
    }
    
    // 重置表单
    setFormData({ name: '', email: '', role: 'user' })
  }

  const handleEdit = (user: any) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
    })
    setEditingId(user.id)
  }

  const handleCancel = () => {
    setFormData({ name: '', email: '', role: 'user' })
    setEditingId(null)
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">
        {editingId ? '编辑用户' : '添加用户'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">姓名</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">邮箱</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">角色</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">普通用户</option>
            <option value="admin">管理员</option>
            <option value="guest">访客</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {editingId ? '更新' : '添加'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              取消
            </button>
          )}
        </div>
      </form>
      
      {/* 演示如何在子组件中触发编辑 */}
      <UserListForEdit onEdit={handleEdit} />
    </div>
  )
}

// 用户列表组件（用于编辑）
function UserListForEdit({ onEdit }: { onEdit: (user: any) => void }) {
  const users = useUsers() // 使用选择器 Hook
  const { deleteUser, setCurrentUser } = useUser()

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这个用户吗？')) {
      deleteUser(id)
    }
  }

  return (
    <div className="mt-6">
      <h4 className="font-medium mb-3">用户列表</h4>
      <div className="space-y-2">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between p-3 border rounded">
            <div>
              <span className="font-medium">{user.name}</span>
              <span className="ml-2 text-sm text-gray-600">({user.role})</span>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentUser(user)}
                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
              >
                设为当前
              </button>
              <button
                onClick={() => onEdit(user)}
                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
              >
                编辑
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// 当前用户显示组件
function CurrentUserDisplay() {
  const currentUser = useCurrentUser() // 使用选择器 Hook
  const { state } = useUser()

  if (state.loading) {
    return <div className="p-4 text-center">加载中...</div>
  }

  if (state.error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        错误: {state.error}
      </div>
    )
  }

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">当前用户</h3>
      {currentUser ? (
        <div className="space-y-2">
          <p><strong>姓名:</strong> {currentUser.name}</p>
          <p><strong>邮箱:</strong> {currentUser.email}</p>
          <p><strong>角色:</strong> {currentUser.role}</p>
          <div className={`inline-block px-2 py-1 rounded text-sm ${
            currentUser.role === 'admin' 
              ? 'bg-red-100 text-red-700'
              : currentUser.role === 'user'
              ? 'bg-blue-100 text-blue-700'
              : 'bg-gray-100 text-gray-700'
          }`}>
            {currentUser.role === 'admin' ? '管理员' : 
             currentUser.role === 'user' ? '普通用户' : '访客'}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">暂无当前用户</p>
      )}
    </div>
  )
}

// 主组件：用户管理
export default function UserManagement() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">用户管理系统</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <CurrentUserDisplay />
        <UserEditForm />
      </div>
    </div>
  )
}