
import React, { useState, useEffect } from 'react';
import api from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [todoInput, setTodoInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get('/todos');
      const fetchedTodos = response.data;
      if (Array.isArray(fetchedTodos)) {
        setTodos(fetchedTodos);
      } else {
        throw new Error('Fetched data is not an array');
      }
    } catch (error) {
      console.error('Error fetching todos:', error);
      if (error.response && error.response.status === 401) {
        // Unauthorized: token is invalid or expired
        localStorage.removeItem('token');
        navigate('/');
      } else {
        setError('Failed to fetch todos. Please try again later.');
        toast.error(`Failed to fetch todos: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }
    fetchTodos();
  }, [navigate]);

  const handleAddTodo = async () => {
    if (!todoInput.trim()) {
      toast.error("Please enter a todo item!");
      return;
    }
    try {
      const newTodo = { text: todoInput.trim(), completed: false };
      const response = await api.post('/todos', newTodo);
      const addedTodo = response.data;
      setTodos(prevTodos => [...prevTodos, addedTodo]);
      setTodoInput('');
      toast.success("Todo added successfully!");
    } catch (error) {
      console.error('Error adding todo:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        toast.error(`Failed to add todo: ${error.message}`);
      }
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      toast.success("Todo deleted successfully!");
    } catch (error) {
      console.error('Error deleting todo:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        toast.error(`Failed to delete todo: ${error.message}`);
      }
    }
  };

  const handleCompleteTodo = async (todo) => {
    try {
      const updatedTodo = { ...todo, completed: !todo.completed };
      const response = await api.put(`/todos/${todo.id}`, updatedTodo);
      const result = response.data;
      setTodos(prevTodos => prevTodos.map(t => t.id === todo.id ? result : t));
      toast.success("Todo updated successfully!");
    } catch (error) {
      console.error('Error updating todo:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/');
      } else {
        toast.error(`Failed to update todo: ${error.message}`);
      }
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

 

  return (
    <div className="max-w-md mx-auto mt- bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-4 py-5 bg-white-50">
        
        <div className="flex items-center mb-4 bg-white rounded-lg overflow-hidden border border-gray-200">
          <input
            type="text"
            value={todoInput}
            onChange={(e) => setTodoInput(e.target.value)}
            className="flex-grow p-3 bg-transparent focus:outline-none placeholder-gray-250"
            placeholder="Enter a new todo"
          />
          <button
            onClick={handleAddTodo}
            className="p-3 bg-cyan-500 text-white hover:bg-cyan-600 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
      <div className="max-h-[400px] overflow-y-auto px-4 py-2">
        { error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : Array.isArray(todos) && todos.length > 0 ? (
          <ul className="space-y-2">
            {todos.map(todo => (
              <li key={todo.id} className={`flex justify-between items-center p-3 bg-gray-100 rounded-lg ${todo.completed ? 'bg-green-100' : ''}`}>
                <span className={`flex-grow text-center ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>{todo.text}</span>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleCompleteTodo(todo)}
                    className={`p-2 rounded-full ${todo.completed ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'} text-white transition duration-300`}
                  >
                    {todo.completed ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-4">No todos found. Add a new one !</div>
        )}
      </div>
      <ToastContainer />
      <button onClick={handleLogout}  className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">Logout</button>
    </div>
  );
};

export default TodoApp;