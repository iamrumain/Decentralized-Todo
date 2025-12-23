// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TodoList {
    uint public nextId = 1;

    struct Todo {
        uint id;
        address owner;
        string text;
        bool isCompleted;
    }


    uint[] private todoIds;


    mapping(uint => Todo) private todos;

    /* ---------------- EVENTS ---------------- */

    event TodoCreated(uint id, address owner, string text);
    event TodoToggled(uint id, bool isCompleted);
    event TodoDeleted(uint id);

    /* ---------------- CREATE ---------------- */

    function createTodo(string memory _text) public {
        require(bytes(_text).length > 0, "Todo text can't be empty");

        uint currentId = nextId;

        todos[currentId] = Todo({
            id: currentId,
            owner: msg.sender,
            text: _text,
            isCompleted: false
        });

        todoIds.push(currentId);
        nextId++;

        emit TodoCreated(currentId, msg.sender, _text);
    }

    /* ---------------- TOGGLE ---------------- */

    function toggleCompleted(uint _id) public {
        require(_id > 0 && _id < nextId, "Todo does not exist");

        Todo storage todo = todos[_id];
        require(todo.owner == msg.sender, "Not the owner");

        todo.isCompleted = !todo.isCompleted;

        emit TodoToggled(_id, todo.isCompleted);
    }

    /* ---------------- DELETE ---------------- */

    function deleteTodo(uint _id) public {
        require(_id > 0 && _id < nextId, "Todo does not exist");

        Todo storage todo = todos[_id];
        require(todo.owner == msg.sender, "Not the owner");

        uint length = todoIds.length;

        // remove id from todoIds array (swap & pop)
        for (uint i = 0; i < length; i++) {
            if (todoIds[i] == _id) {
                todoIds[i] = todoIds[length - 1];
                todoIds.pop();
                break;
            }
        }

        delete todos[_id];

        emit TodoDeleted(_id);
    }

    /* ---------------- READ ---------------- */

    function getTodoCount() public view returns (uint) {
        return todoIds.length;
    }

    function getTodoByIndex(
        uint _index
    )
        public
        view
        returns (
            uint id,
            address owner,
            string memory text,
            bool isCompleted
        )
    {
        require(_index < todoIds.length, "Index out of bounds");

        uint todoId = todoIds[_index];
        Todo storage todo = todos[todoId];

        return (
            todo.id,
            todo.owner,
            todo.text,
            todo.isCompleted
        );
    }
}
