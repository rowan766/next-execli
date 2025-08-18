// src/components/Counter.tsx
'use client'

import { useState, useEffect } from 'react'

// 面试重点 1: useState Hook
export default function Counter() {
  const [count, setCount] = useState(0)
  const [isEven, setIsEven] = useState(true)

  // 面试重点 2: useEffect Hook
  useEffect(() => {
    console.log('useEffect')
    setIsEven(count % 2 === 0)
  }, [count]) // 依赖数组

  // 面试重点 3: 事件处理函数
  const handleIncrement = () => {
    // 函数式更新，避免闭包陷阱
  
    // setCount(count+1)
    // setCount(count+1)// 重复调用，不会生效,多次调用也只是触发一次 useEffect

    setCount(prevCount => prevCount + 1)
    setCount(prevCount => prevCount + 1) // 函数式重复调用，会生效但也只触发一次 useEffect
  }

  const handleDecrement = () => {
    setCount(prevCount => prevCount - 1)
  }


useEffect(() => {
  const timer = setInterval(() => {
    console.log('定时器执行');
  }, 1000);

  return () => {
    console.log('清理函数执行'); // 什么时候执行？
    clearInterval(timer);
  };
}, []) // 依赖数组


  // 面试重点 4: 条件渲染
  return (
    <div className="p-6 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">计数器组件</h2>
      
      <div className="space-y-4">
        <div className="text-center">
          <span className="text-4xl font-bold">{count}</span>
          <p className={`text-sm ${isEven ? 'text-green-600' : 'text-red-600'}`}>
            {isEven ? '偶数' : '奇数'}
          </p>
        </div>

        <div className="flex gap-2 justify-center">
          <button
            onClick={handleDecrement}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -1
          </button>
          <button
            onClick={handleIncrement}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            +1
          </button>
        </div>
      </div>
    </div>
  )
}

//面试题
// 1. 为什么要使用函数式更新？
// 函数式更新是指在更新 state 的时候，使用函数而不是直接赋值的方式。
// 原因：
// 解决闭包陷阱：避免使用过期的状态值
// 批量更新安全：确保基于最新状态进行更新
// 异步更新可靠：在异步操作中保证状态一致性

// 2. useEffect 的清理函数什么时候执行？
// 原因：
// 当组件从 DOM 中移除时，会执行清理函数来释放资源。。  
// 2. 当 useEffect 的依赖数组中的值发生变化时，会先执行上一次的清理函数，再执行新的 effec。  
// 3. 每次重新执行 effect 前都会先清理上一次的副作用。

// 3.如何避免无限循环的 useEffect
// 会产生循环依赖的场景
// 1. 缺少依赖项 解决方案  添加所有使用的依赖
// 2.依赖项包含对象或数组 解决方案 将对象移到 effect 内部|使用 useMemo 稳定引用|只依赖对象的具体属性
// 3.在 effect 中更新依赖的状态 解决方案 移除 count 依赖使用函数更新|添加判断条件
// 4.函数依赖导致的循环 解决方案 使用 useCallback 稳定函数引用|将函数移到 effect 内部

// 4.TanStack Query 知识点