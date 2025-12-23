async function main() {
  const TodoList = await ethers.getContractFactory("TodoList");
  const todo = await TodoList.deploy();

  await todo.waitForDeployment();

  console.log("TodoList deployed to:", await todo.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
