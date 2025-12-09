import React, { useState } from 'react';
import { TodoItem } from '../../../types';
import Button from '../../../components/Button';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';

const TodoApp: React.FC = () => {
    const [todos, setTodos] = useState<TodoItem[]>([
        { id: '1', text: 'Plan dinner for tomorrow', completed: false },
        { id: '2', text: 'Make your bed', completed: true },
    ]);
    const [input, setInput] = useState('');

    const addTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        const newTodo: TodoItem = {
            id: Date.now().toString(),
            text: input,
            completed: false,
        };
        setTodos([...todos, newTodo]);
        setInput('');
    };

    const toggleTodo = (id: string) => {
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const deleteTodo = (id: string) => {
        setTodos(todos.filter(t => t.id !== id));
    };

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Task Manager</h2>
                <p className="text-slate-400 text-sm">A simple To-Do list :)</p>
            </div>

            <form onSubmit={addTodo} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <Button type="submit">
                    <Plus size={18} />
                </Button>
            </form>

            <div className="space-y-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {todos.length === 0 && (
                    <div className="text-center text-slate-500 py-10">No tasks yet. Add one above!</div>
                )}
                {todos.map(todo => (
                    <div
                        key={todo.id}
                        className={`flex items-center justify-between p-3 rounded-lg border transition-all ${todo.completed
                            ? 'bg-slate-900/50 border-slate-800 opacity-75'
                            : 'bg-slate-800 border-slate-700'
                            }`}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <button
                                onClick={() => toggleTodo(todo.id)}
                                className={`flex-shrink-0 transition-colors ${todo.completed ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {todo.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                            </button>
                            <span className={`truncate ${todo.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                                {todo.text}
                            </span>
                        </div>
                        <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-slate-500 hover:text-red-400 p-1 rounded-md hover:bg-slate-900 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoApp;