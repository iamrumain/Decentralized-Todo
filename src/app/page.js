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
  console.log(todos);
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

  useEffect(() => {
    connectWallet();
    if (account) {
      getTodos();
    }
  }, [account]);
  return (
    <div>
      <main>
        <h1>Decentralized Todo App</h1>

        {!isConnected ? (
          <button onClick={connectWallet}>Connect Wallet</button>
        ) : (
          <div>
            <p>Your Account: {account}</p>

            <form onSubmit={addTodo}>
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add new task"
              />

              <button type="submit" disabled={loading}>
                {loading ? "Adding.." : "Add Todo"}
              </button>
            </form>

            <ul>
              {todos.length == 0 ? (
                <p>No task yet, add one!</p>
              ) : (
                todos.map((todo) => (
                  <li key={todo.id.toString()}>
                    <input
                      type="checkbox"
                      checked={todo.isCompleted}
                      onChange={() => toggleTodo(todo.id)}
                      disabled={loading}
                    />
                    <span>{todo.text}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
