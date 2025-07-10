# Clean Python file - should get high score
def calculate_fibonacci(n):
    """Calculate the nth Fibonacci number."""
    if n <= 1:
        return n
    return calculate_fibonacci(n - 1) + calculate_fibonacci(n - 2)

def is_prime(num):
    """Check if a number is prime."""
    if num < 2:
        return False
    for i in range(2, int(num ** 0.5) + 1):
        if num % i == 0:
            return False
    return True

def main():
    """Main function to demonstrate the utilities."""
    numbers = [1, 2, 3, 4, 5, 8, 13, 21]
    
    print("Fibonacci numbers:")
    for i in range(10):
        print(f"F({i}) = {calculate_fibonacci(i)}")
    
    print("\nPrime numbers in list:")
    for num in numbers:
        if is_prime(num):
            print(f"{num} is prime")

if __name__ == "__main__":
    main()