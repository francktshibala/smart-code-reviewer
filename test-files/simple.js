// Simple JavaScript file - should get high score
function greetUser(name) {
  return `Hello, ${name}!`;
}

function calculateSum(a, b) {
  return a + b;
}

const users = ['Alice', 'Bob', 'Charlie'];
users.forEach(user => {
  console.log(greetUser(user));
});

export { greetUser, calculateSum };