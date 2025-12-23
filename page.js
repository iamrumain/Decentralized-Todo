"use client";
import { Todo_address, TodoListABI } from "@/constants";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [loading, setLoading] = useState(false);
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(account[0]);
        setIsConnected(true);
      } else {
        alert("Please install metamask");
      }
    } catch (error) {
      console.error("Connect is error.....", error);
    }
  };

  const getTodos = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const toContract = new ethers.Contract(
          Todo_address,
          TodoListABI,
          signer
        );
        const todoCount = await toContract.getTodoCount();

        const fetchTodos = [];

        for (let i = 0; i < todoCount.toNumber(); i++) {
          const todo = await toContract.getTodoByIndex(i);
          fetchTodos.push({
            id: todo[0],
            text: todo[2],
            isCompleted: todo[1],
          });
        }
        setTodos(fetchTodos);
      }
    } catch (error) {
      console.error("error fetching todos : ", error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();

    if (!newTodo.trim()) return;

    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const toContract = new ethers.Contract(
          Todo_address,
          TodoListABI,
          signer
        );

        const tx = await toContract.createTodo(newTodo);
        await tx.wait();
        setNewTodo("");
        await getTodos();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("addTodo error: ", error);
    }
  };
  const toggleTodo = async (id) => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const toContract = new ethers.Contract(
          Todo_address,
          TodoListABI,
          signer
        );

        const tx = await toContract.toggleCompleted(id);
        await tx.wait();

        await getTodos();
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Toggle Todo error : ", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      if (!window.ethereum) return;

      setLoading(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const todoContract = new ethers.Contract(
        Todo_address,
        TodoListABI,
        signer
      );

      const tx = await todoContract.deleteTodo(id);
      await tx.wait();

      await getTodos();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Delete todo error:", error);
    }
  };

  useEffect(() => {
    connectWallet();
    if (account) {
      getTodos();
    }
  }, [account]);
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
      <main className="w-full max-w-xl bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            📝 Decentralized Todo
          </h1>
          <p className="text-slate-400 text-sm mt-1">Powered by Blockchain</p>
        </div>

        {/* Wallet */}
        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition font-medium"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="mb-4 text-center">
              <p className="text-xs text-slate-400">Connected Wallet</p>
              <p className="text-sm font-mono text-emerald-400">
                {account.slice(0, 6)}...{account.slice(-4)}
              </p>
            </div>

            {/* Add Todo */}
            <form onSubmit={addTodo} className="flex gap-2 mb-5">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition"
              >
                {loading ? "..." : "Add"}
              </button>
            </form>

            {/* Todo List */}
            <ul className="space-y-3">
              {todos.map((todo) => (
                <li
                  key={todo.id.toString()}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-800 border border-slate-700"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={todo.isCompleted}
                    onChange={() => toggleTodo(todo.id)}
                    className="h-4 w-4 accent-blue-500"
                  />

                  {/* Text */}
                  <span
                    className={`flex-1 text-sm ${
                      todo.isCompleted
                        ? "line-through text-slate-500"
                        : "text-slate-200"
                    }`}
                  >
                    {todo.text}
                  </span>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    disabled={loading}
                    className="px-3 py-1.5 text-xs rounded-lg bg-red-600/90 hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
