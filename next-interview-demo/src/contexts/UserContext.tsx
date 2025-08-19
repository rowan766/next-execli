// src/contexts/UserContext.tsx
'use client'

import { createContext, useContext, useReducer, ReactNode } from 'react'

// 1. 定义用户数据类型
interface User {
  id: number
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user' | 'guest'
}

// 2. 定义状态类型
interface UserState {
  currentUser: User | null
  users: User[]
  loading: boolean
  error: string | null
}

// 3. 定义 Action 类型（重要面试点）
type UserAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User }
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: { id: number; updates: Partial<User> } }
  | { type: 'DELETE_USER'; payload: number }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }

// 4. 定义 Context 类型
interface UserContextType {
  state: UserState
  dispatch: React.Dispatch<UserAction>
  // 便捷方法
  setCurrentUser: (user: User) => void
  addUser: (user: User) => void
  updateUser: (id: number, updates: Partial<User>) => void
  deleteUser: (id: number) => void
  setLoading: (loading: boolean) => void
}

// 5. Reducer 函数（面试重点：纯函数、不可变性）
const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_USER':
      return { ...state, currentUser: action.payload, error: null }
    
    case 'SET_USERS':
      return { ...state, users: action.payload, error: null }
    
    case 'ADD_USER':
      return { 
        ...state, 
        users: [...state.users, action.payload],
        error: null 
      }
    
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id 
            ? { ...user, ...action.payload.updates }
            : user
        ),
        // 如果更新的是当前用户，也要更新 currentUser
        currentUser: state.currentUser?.id === action.payload.id
          ? { ...state.currentUser, ...action.payload.updates }
          : state.currentUser,
        error: null
      }
    
    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
        // 如果删除的是当前用户，清空 currentUser
        currentUser: state.currentUser?.id === action.payload ? null : state.currentUser,
        error: null
      }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    default:
      return state
  }
}

// 6. 初始状态
const initialState: UserState = {
  currentUser: null,
  users: [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' }
  ],
  loading: false,
  error: null
}

// 7. 创建 Context
const UserContext = createContext<UserContextType | undefined>(undefined)

// 8. Provider 组件
interface UserProviderProps {
  children: ReactNode
}

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialState)

  // 便捷方法（封装复杂的 dispatch 操作）
  const setCurrentUser = (user: User) => {
    dispatch({ type: 'SET_USER', payload: user })
  }

  const addUser = (user: User) => {
    dispatch({ type: 'ADD_USER', payload: user })
  }

  const updateUser = (id: number, updates: Partial<User>) => {
    dispatch({ type: 'UPDATE_USER', payload: { id, updates } })
  }

  const deleteUser = (id: number) => {
    dispatch({ type: 'DELETE_USER', payload: id })
  }

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }

  const value: UserContextType = {
    state,
    dispatch,
    setCurrentUser,
    addUser,
    updateUser,
    deleteUser,
    setLoading
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

// 9. 自定义 Hook（面试重点：错误处理）
export function useUser() {
  const context = useContext(UserContext)
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  
  return context
}

// 10. 选择器 Hook（性能优化）
export function useCurrentUser() {
  const { state } = useUser()
  return state.currentUser
}

export function useUsers() {
  const { state } = useUser()
  return state.users
}

export function useUserLoading() {
  const { state } = useUser()
  return state.loading
}