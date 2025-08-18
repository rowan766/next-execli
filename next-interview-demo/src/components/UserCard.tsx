// src/components/UserCard.tsx
'use client'

// 面试重点 1: TypeScript 接口定义
interface User {
  id: number
  name: string
  email: string
  avatar?: string // 可选属性
}

interface UserCardProps {
  user: User
  onEdit?: (user: User) => void // 可选的回调函数
  isActive?: boolean
}

// 面试重点 2: 默认参数和解构赋值
export default function UserCard({ 
  user, 
  onEdit, 
  isActive = false 
}: UserCardProps) {
  
  // 面试重点 3: 事件处理和数据传递
  const handleEditClick = () => {
    onEdit?.(user) // 可选链调用
  }

  return (
    <div className={`
      p-4 border rounded-lg shadow-sm transition-all
      ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
      hover:shadow-md
    `}>
      <div className="flex items-center gap-3">
        {/* 面试重点 4: 条件渲染的不同方式 */}
        {user.avatar ? (
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        
        {/* 面试重点 5: 条件渲染 - 短路运算符 */}
        {onEdit && (
          <button
            onClick={handleEditClick}
            className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            编辑
          </button>
        )}
      </div>
    </div>
  )
}

// 面试重点 6: 组件组合 - 用户列表
interface UserListProps {
  users: User[]
  activeUserId?: number
}

export function UserList({ users, activeUserId }: UserListProps) {
  const handleEdit = (user: User) => {
    console.log('编辑用户:', user)
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold">用户列表</h3>
      {users.map(user => (
        <UserCard
          key={user.id} // 面试重点 7: key 属性的重要性
          user={user}
          isActive={user.id === activeUserId}
          onEdit={handleEdit}
        />
      ))}
    </div>
  )
}