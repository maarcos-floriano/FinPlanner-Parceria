import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  // Estado para armazenar nosso valor
  // Passar uma função de estado inicial para useState, para que a lógica seja executada apenas uma vez
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      // Obter do armazenamento local pela chave
      const item = window.localStorage.getItem(key)
      // Analisar JSON armazenado ou retornar initialValue
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      // Se erro também retornar initialValue
      console.error(error)
      return initialValue
    }
  })

  // Retornar uma versão encapsulada da função setter de useState que...
  // ... persiste o novo valor no localStorage.
  const setValue = (value) => {
    try {
      // Permitir que o valor seja uma função para que tenhamos a mesma API que useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      // Salvar estado
      setStoredValue(valueToStore)
      // Salvar no armazenamento local
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        setStoredValue(JSON.parse(e.newValue))
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}