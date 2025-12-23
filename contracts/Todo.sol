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

    uint[] public todoIds;
    mapping(uint => Todo) public todos;

    event TodoCreated(uint id, address owner, string text);
    event TodoToggled(uint id, bool isCompleted);

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

    function toggleCompleted(uint _id) public {
        require(_id > 0 && _id < nextId, "Todo does not exist");

        Todo storage todo = todos[_id];
        require(todo.owner == msg.sender, "Not the owner");

        todo.isCompleted = !todo.isCompleted;

        emit TodoToggled(_id, todo.isCompleted);
    }

    function getTodoCount() public view returns (uint) {
        return todoIds.length;
    }

    function getTodoByIndex(uint _index)
        public
        view
        returns (uint id, address owner, string memory text, bool isCompleted)
    {
        require(_index < todoIds.length, "Index out of bounds");

        uint todoId = todoIds[_index];
        Todo storage todo = todos[todoId];

        return (todo.id, todo.owner, todo.text, todo.isCompleted);
    }
}
