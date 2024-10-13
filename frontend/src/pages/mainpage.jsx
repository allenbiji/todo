import React,{ useEffect} from 'react';
import TodoApp from '../components/todo'; 
import { useNavigate } from 'react-router-dom';

const TodoPage = () => {
    
    

    return (
      <div className="h-auto bg-gray-100 py-6 flex flex-col justify-center sm:py-8">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-16">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-bold text-center mb-6">My Todo List</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-2 text-gray-700 sm:text-lg sm:leading-7">
                  <p>Welcome to your personal todo list. Stay organized and boost your productivity!</p>
                </div>
                <div className=" text-base leading-6 font-bold sm:text-lg sm:leading-7">
                  <TodoApp />
                </div>
              </div>
            </div>
          </div>
        </div>
         
      </div>
    );
  };
  
  export default TodoPage;
  