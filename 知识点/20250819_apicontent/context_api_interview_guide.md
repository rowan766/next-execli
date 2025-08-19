# React Context API 面试题总结

## 🔥 核心概念题（必考）

### 1. 什么是 Context API？解决了什么问题？

**答案要点：**
- Context API 是 React 提供的状态管理解决方案，用于跨组件传递数据
- 解决了 "prop drilling"（属性下钻）问题
- 适合管理全局状态：用户信息、主题、语言设置等

**代码示例：**
```javascript
// ❌ Prop Drilling 问题
function App() {
  const [user, setUser] = useState()
  return <Header user={user} setUser={setUser} />
}

function Header({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />
}

function UserMenu({ user, setUser }) {
  return <div>{user?.name}</div> // 深层组件才使用
}

// ✅ Context 解决方案
const UserContext = createContext()

function App() {
  const [user, setUser] = useState()
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header />
    </UserContext.Provider>
  )
}

function UserMenu() {
  const { user } = useContext(UserContext) // 直接获取
  return <div>{user?.name}</div>
}
```

---

### 2. Context API vs Redux vs Zustand，什么时候选择哪个？

**对比表格：**

| 特性 | Context API | Redux | Zustand |
|------|-------------|-------|---------|
| **学习成本** | 低 | 高 | 中 |
| **样板代码** | 中 | 多 | 少 |
| **性能** | 需优化 | 优秀 | 良好 |
| **开发工具** | 基础 | 强大 | 基础 |
| **适用场景** | 中小型应用 | 大型应用 | 快速开发 |

**选择建议：**
```javascript
// Context API 适用场景：
- 中小型应用（<50 个组件）
- 用户认证、主题等相对稳定的状态
- 不想引入额外依赖
- 团队对 React 基础 API 更熟悉

// Redux 适用场景：
- 大型应用（>100 个组件）
- 复杂的状态更新逻辑
- 需要时间旅行调试
- 需要强大的中间件生态

// Zustand 适用场景：
- 快速原型开发
- 想要简单的 API
- 需要轻量级解决方案
```

---

### 3. useReducer vs useState，什么时候使用 useReducer？

**核心判断标准：**

```javascript
// ✅ 使用 useState 的场景
const [count, setCount] = useState(0)
const [name, setName] = useState('')
const [isVisible, setIsVisible] = useState(false)

// ✅ 使用 useReducer 的场景
const [state, dispatch] = useReducer(reducer, {
  users: [],
  currentUser: null,
  loading: false,
  error: null
})
```

**什么时候用 useReducer：**
1. **多个相关的状态值**
2. **复杂的状态更新逻辑**
3. **状态更新依赖于前一个状态**
4. **多个地方需要触发相同类型的更新**

**实际案例：**
```javascript
// ❌ 用 useState 管理复杂状态（难维护）
const [users, setUsers] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)

const addUser = (user) => {
  setLoading(true)
  setError(null)
  setUsers(prev => [...prev, user])
  setLoading(false)
}

// ✅ 用 useReducer 管理复杂状态（更清晰）
const [state, dispatch] = useReducer(userReducer, initialState)

const addUser = (user) => {
  dispatch({ type: 'ADD_USER_START' })
  dispatch({ type: 'ADD_USER_SUCCESS', payload: user })
}
```

---

## 🎯 技术深度题（重要）

### 4. 什么是不可变性？为什么 React 需要不可变性？

**核心概念：**
- 不可变性：不直接修改原数据，而是创建新的数据结构
- React 使用 `Object.is()` 进行浅比较来决定是否重新渲染

**错误示例：**
```javascript
// ❌ 错误：直接修改状态
case 'UPDATE_USER':
  state.users[0].name = '新名字' // React 检测不到变化
  return state // 相同引用，不会重渲染

// ❌ 错误：修改数组
case 'ADD_USER':
  state.users.push(action.payload) // 直接修改数组
  return state
```

**正确示例：**
```javascript
// ✅ 正确：返回新对象
case 'UPDATE_USER':
  return {
    ...state, // 浅拷贝顶层
    users: state.users.map(user => 
      user.id === action.payload.id 
        ? { ...user, ...action.payload.updates } // 深度更新
        : user
    )
  }

// ✅ 正确：返回新数组
case 'ADD_USER':
  return {
    ...state,
    users: [...state.users, action.payload] // 创建新数组
  }
```

**为什么需要不可变性：**
1. **React 性能优化**：只有引用变化才重渲染
2. **调试便利**：便于追踪状态变化
3. **时间旅行**：支持撤销/重做功能
4. **避免副作用**：防止意外的状态修改

---

### 5. Context 会导致性能问题吗？如何优化？

**性能问题根源：**
```javascript
// ❌ 性能问题：每次渲染都创建新对象
function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  // 问题：每次都是新对象，导致所有消费者重渲染
  const value = {
    state,
    dispatch,
    updateUser: (id, updates) => dispatch({ type: 'UPDATE_USER', payload: { id, updates } })
  }
  
  return <Context.Provider value={value}>{children}</Context.Provider>
}
```

**优化方案：**

#### 方案1：useMemo 稳定引用
```javascript
function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  const updateUser = useCallback((id, updates) => {
    dispatch({ type: 'UPDATE_USER', payload: { id, updates } })
  }, [])
  
  const value = useMemo(() => ({
    state,
    dispatch,
    updateUser
  }), [state, updateUser]) // 只有依赖变化时才重新创建
  
  return <Context.Provider value={value}>{children}</Context.Provider>
}
```

#### 方案2：选择器 Hook
```javascript
// 只订阅特定状态，减少重渲染
export function useCurrentUser() {
  const { state } = useUser()
  return state.currentUser // 只有 currentUser 变化时才重渲染
}

export function useUsers() {
  const { state } = useUser()
  return state.users // 只有 users 变化时才重渲染
}
```

#### 方案3：拆分 Context
```javascript
// 分离状态和方法，避免不必要的重渲染
const StateContext = createContext()
const ActionsContext = createContext() // 方法不变，避免重渲染

function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  const actions = useMemo(() => ({
    updateUser: (id, updates) => dispatch({ type: 'UPDATE_USER', payload: { id, updates } }),
    addUser: (user) => dispatch({ type: 'ADD_USER', payload: user })
  }), []) // 方法不依赖状态，永远不变
  
  return (
    <StateContext.Provider value={state}>
      <ActionsContext.Provider value={actions}>
        {children}
      </ActionsContext.Provider>
    </StateContext.Provider>
  )
}
```

---

### 6. 如何确保 Hook 在正确的地方使用？

**错误边界处理：**
```javascript
export function useUser() {
  const context = useContext(UserContext)
  
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  
  return context
}
```

**为什么需要这样做：**
```javascript
// ❌ 如果在 Provider 外使用会返回 undefined
function SomeComponent() {
  const user = useContext(UserContext) // undefined
  return <div>{user.name}</div> // 运行时错误！
}

// ✅ 有了错误检查，开发时就能发现问题
function SomeComponent() {
  const user = useUser() // 抛出清晰的错误信息
  return <div>{user.name}</div>
}
```

---

### 7. Reducer 函数有什么要求？

**Reducer 必须是纯函数：**

```javascript
// ✅ 正确的 Reducer
const userReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload] // 纯函数，无副作用
      }
    default:
      return state
  }
}

// ❌ 错误的 Reducer
const badReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_USER':
      // ❌ 异步操作
      fetch('/api/users', { method: 'POST', body: JSON.stringify(action.payload) })
      
      // ❌ 修改外部状态
      window.localStorage.setItem('user', JSON.stringify(action.payload))
      
      // ❌ 不纯的函数调用
      const id = Math.random()
      
      // ❌ 直接修改状态
      state.users.push(action.payload)
      return state
  }
}
```

**纯函数的特征：**
1. **相同输入，相同输出**
2. **无副作用**：不修改外部变量、不发起网络请求
3. **不修改参数**：不能直接修改 state
4. **不依赖外部状态**：不读取全局变量

---

## 💡 实战应用题

### 8. 如何在 Context 中处理异步操作？

**方案1：在组件中处理**
```javascript
function UserList() {
  const { setLoading, setUsers, setError } = useUser()
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const users = await api.getUsers()
        setUsers(users)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUsers()
  }, [setLoading, setUsers, setError])
  
  return <div>...</div>
}
```

**方案2：自定义 Hook 封装**
```javascript
function useUserAPI() {
  const { setLoading, setUsers, setError } = useUser()
  
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const users = await api.getUsers()
      setUsers(users)
      setError(null)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [setLoading, setUsers, setError])
  
  const createUser = useCallback(async (userData) => {
    setLoading(true)
    try {
      const newUser = await api.createUser(userData)
      // 乐观更新或重新获取数据
      fetchUsers()
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [setLoading, setError, fetchUsers])
  
  return { fetchUsers, createUser }
}
```

**方案3：结合 React Query（推荐）**
```javascript
function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers
  })
  
  const { mutate: createUser } = useMutation({
    mutationFn: api.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  
  return <div>...</div>
}
```

---

### 9. 如何持久化 Context 状态？

**localStorage 集成：**
```javascript
function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState, (initial) => {
    // 初始化时从 localStorage 恢复状态
    const saved = localStorage.getItem('userState')
    return saved ? JSON.parse(saved) : initial
  })
  
  // 状态变化时保存到 localStorage
  useEffect(() => {
    localStorage.setItem('userState', JSON.stringify(state))
  }, [state])
  
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  )
}
```

**优化版本（避免频繁写入）：**
```javascript
function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState)
  
  // 使用 debounce 避免频繁写入
  const debouncedSave = useMemo(() => 
    debounce((state) => {
      localStorage.setItem('userState', JSON.stringify(state))
    }, 500), []
  )
  
  useEffect(() => {
    debouncedSave(state)
  }, [state, debouncedSave])
  
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      {children}
    </UserContext.Provider>
  )
}
```

---

### 10. 如何测试 Context 和 Reducer？

**测试 Reducer：**
```javascript
import { userReducer } from './UserContext'

describe('userReducer', () => {
  const initialState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null
  }
  
  it('should add user', () => {
    const action = { 
      type: 'ADD_USER', 
      payload: { id: 1, name: 'Test User', email: 'test@example.com' } 
    }
    
    const newState = userReducer(initialState, action)
    
    expect(newState.users).toHaveLength(1)
    expect(newState.users[0]).toEqual(action.payload)
    expect(newState.error).toBeNull()
  })
  
  it('should update user', () => {
    const stateWithUser = {
      ...initialState,
      users: [{ id: 1, name: 'Old Name', email: 'test@example.com' }]
    }
    
    const action = {
      type: 'UPDATE_USER',
      payload: { id: 1, updates: { name: 'New Name' } }
    }
    
    const newState = userReducer(stateWithUser, action)
    
    expect(newState.users[0].name).toBe('New Name')
    expect(newState.users[0].email).toBe('test@example.com')
  })
})
```

**测试 Hook：**
```javascript
import { renderHook, act } from '@testing-library/react'
import { UserProvider, useUser } from './UserContext'

const wrapper = ({ children }) => (
  <UserProvider>{children}</UserProvider>
)

test('should add user', () => {
  const { result } = renderHook(() => useUser(), { wrapper })
  
  const newUser = { id: 1, name: 'Test User', email: 'test@example.com' }
  
  act(() => {
    result.current.addUser(newUser)
  })
  
  expect(result.current.state.users).toContain(newUser)
})
```

**测试组件：**
```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import { UserProvider } from './UserContext'
import UserProfile from './UserProfile'

test('should display and update user name', () => {
  render(
    <UserProvider>
      <UserProfile />
    </UserProvider>
  )
  
  // 测试初始显示
  expect(screen.getByText('张三')).toBeInTheDocument()
  
  // 测试更新功能
  fireEvent.click(screen.getByText('编辑'))
  fireEvent.change(screen.getByDisplayValue('张三'), {
    target: { value: '李四' }
  })
  fireEvent.click(screen.getByText('保存'))
  
  expect(screen.getByText('李四')).toBeInTheDocument()
})
```

---

## 🚀 高级进阶题

### 11. 如何组织多个 Context？

**方案1：Context 组合器**
```javascript
function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <UserProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </UserProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}

// 使用
function App() {
  return (
    <AppProviders>
      <Routes />
    </AppProviders>
  )
}
```

**方案2：Context 工厂函数**
```javascript
function createGenericContext<T>() {
  const context = createContext<T | undefined>(undefined)
  
  function useContext() {
    const c = React.useContext(context)
    if (c === undefined) {
      throw new Error('useContext must be used within a Provider')
    }
    return c
  }
  
  return [useContext, context.Provider] as const
}

// 使用
const [useAuth, AuthProvider] = createGenericContext<AuthContextType>()
const [useTheme, ThemeProvider] = createGenericContext<ThemeContextType>()
```

---

### 12. Context 与 Redux 的架构差异？

**Context 架构：**
```
Component → useContext → Context Provider → useReducer → State
```

**Redux 架构：**
```
Component → useSelector/useDispatch → Store → Reducer → State
                ↓
           Middleware (Redux Thunk/Saga)
```

**关键差异：**

| 特性 | Context API | Redux |
|------|-------------|-------|
| **中间件支持** | 无 | 丰富（thunk、saga、observable） |
| **开发工具** | 基础 | Redux DevTools（时间旅行） |
| **代码分割** | 需要手动实现 | 原生支持 |
| **性能优化** | 需要手动优化 | 内置优化 |
| **学习曲线** | 平缓 | 陡峭 |

---

## 📝 面试准备策略

### **必须掌握（基础分）：**
1. Context API 基本概念和使用
2. useReducer vs useState 的选择
3. 不可变性的重要性和实现
4. 基本的性能优化技巧

### **加分项（提升分）：**
1. TypeScript 类型设计能力
2. 错误边界和边界情况处理
3. 测试策略和实践
4. 与其他状态管理库的深度对比
5. 实际项目架构经验

### **面试技巧：**
1. **准备具体例子**：用你的 UserContext 代码作为案例
2. **说出权衡**：每个技术选择的利弊
3. **展示思考过程**：为什么这样设计，考虑了哪些因素
4. **连接实际场景**：在什么项目中用过，解决了什么问题

### **常见面试流程：**
1. **概念题** → 基础理解
2. **对比题** → 技术选型能力  
3. **代码题** → 实际编程能力
4. **架构题** → 系统设计思维
5. **经验题** → 实战经验分享

**记住：面试官更看重你的思考过程和解决问题的能力，而不仅仅是记住答案！**