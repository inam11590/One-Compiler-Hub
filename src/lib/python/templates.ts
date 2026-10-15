/**
 * OneCompilerHub - Beginner-Friendly Python Starter Templates
 *
 * 10 Editable, Executable Python Examples:
 * 1. Hello World
 * 2. Variables & Data Types
 * 3. If / Else Conditions
 * 4. For & While Loops
 * 5. Functions & Return Values
 * 6. Lists & Comprehensions
 * 7. Dictionaries & Data Structures
 * 8. Standard Input (input())
 * 9. Error Handling (try / except)
 * 10. Simple Calculations & Math
 */

export interface PythonStarterExample {
  id: string;
  name: string;
  description: string;
  category: "Beginner" | "Intermediate" | "Practical";
  code: string;
  defaultStdin?: string;
}

export const PYTHON_STARTER_EXAMPLES: PythonStarterExample[] = [
  {
    id: "hello-world",
    name: "1. Hello World",
    description: "Classic first Python program printing formatted text to standard output.",
    category: "Beginner",
    code: `# OneCompilerHub — Hello World in Python 3
print("👋 Hello, World!")
print("Welcome to OneCompilerHub's secure Python execution sandbox.")
print("-" * 50)
name = "Developer"
print(f"Happy coding, {name}! Click 'Run' to execute this code.")
`,
  },
  {
    id: "variables-and-types",
    name: "2. Variables & Types",
    description: "Demonstrates integers, floats, strings, booleans, and type inspection.",
    category: "Beginner",
    code: `# Variables and Primitive Data Types in Python
app_name = "OneCompilerHub"   # string
tools_count = 18              # integer
avg_duration = 0.042          # float
is_sandboxed = True           # boolean
features = None               # NoneType

print("=== Variable Inspection ===")
print(f"Platform: {app_name} (type: {type(app_name).__name__})")
print(f"Available Tools: {tools_count} (type: {type(tools_count).__name__})")
print(f"Average Duration: {avg_duration}s (type: {type(avg_duration).__name__})")
print(f"Secure Isolation: {is_sandboxed} (type: {type(is_sandboxed).__name__})")
print(f"Features: {features} (type: {type(features).__name__})")
`,
  },
  {
    id: "if-else-conditions",
    name: "3. If / Else Conditions",
    description: "Conditional logic, comparison operators, and grading evaluation.",
    category: "Beginner",
    code: `# Conditional Branching in Python
score = 88

print(f"Evaluating test score: {score}/100")

if score >= 90:
    grade = "A+ (Outstanding)"
elif score >= 80:
    grade = "A (Excellent)"
elif score >= 70:
    grade = "B (Good)"
elif score >= 60:
    grade = "C (Satisfactory)"
else:
    grade = "Needs Improvement"

print(f"Final Grade: {grade}")

# Ternary expression example
status = "Passed" if score >= 60 else "Failed"
print(f"Result Status: {status}")
`,
  },
  {
    id: "loops",
    name: "4. For & While Loops",
    description: "Iteration with range, while loop counters, and break/continue statements.",
    category: "Beginner",
    code: `# Loops & Iteration in Python

print("--- Counting with for loop ---")
for i in range(1, 6):
    square = i ** 2
    print(f"  {i} squared = {square}")

print("\n--- Countdown with while loop ---")
countdown = 3
while countdown > 0:
    print(f"  T-minus {countdown}...")
    countdown -= 1
print("  🚀 Liftoff!")

print("\n--- Filtering even numbers ---")
for n in range(1, 11):
    if n % 2 != 0:
        continue  # skip odd numbers
    print(f"  Found even number: {n}")
`,
  },
  {
    id: "functions",
    name: "5. Functions & Return Values",
    description: "Defining functions with parameters, default arguments, and type hints.",
    category: "Beginner",
    code: `# Functions and Modular Logic in Python

def calculate_stats(numbers: list[int]) -> dict:
    """Calculates min, max, sum, and average of a list of numbers."""
    if not numbers:
        return {}
    
    total = sum(numbers)
    count = len(numbers)
    return {
        "count": count,
        "total": total,
        "minimum": min(numbers),
        "maximum": max(numbers),
        "average": round(total / count, 2),
    }

def greet(user: str, role: str = "Developer") -> str:
    return f"Hello, {user}! Welcome to the {role} workspace."

print(greet("Ada"))
print(greet("Grace", role="Compiler Architect"))

data = [12, 45, 68, 23, 89, 34, 91]
stats = calculate_stats(data)

print("\nDataset Statistics:")
for key, value in stats.items():
    print(f"  {key.capitalize()}: {value}")
`,
  },
  {
    id: "lists",
    name: "6. Lists & Comprehensions",
    description: "Manipulating lists, sorting, filtering, and list comprehensions.",
    category: "Intermediate",
    code: `# Lists and List Comprehensions in Python

languages = ["Python", "JavaScript", "C++", "Java", "Go", "Rust", "TypeScript"]
print("Original Languages:", languages)

# Append & insert
languages.append("Kotlin")
languages.sort()
print("Alphabetical:", languages)

# List comprehension: Filter languages with > 4 characters
long_names = [lang.upper() for lang in languages if len(lang) > 4]
print("\nLanguages with > 4 letters (uppercase):")
for item in long_names:
    print(f"  • {item}")

# Numbers list comprehension: Squares of odd numbers
odd_squares = [x ** 2 for x in range(1, 12) if x % 2 != 0]
print("\nSquares of odd numbers 1..11:", odd_squares)
`,
  },
  {
    id: "dictionaries",
    name: "7. Dictionaries & Nested Data",
    description: "Key-value mappings, nested dictionary access, and iterations.",
    category: "Intermediate",
    code: `# Dictionaries and Structured Data in Python

compiler_hub = {
    "platform": "OneCompilerHub",
    "version": "1.0.0",
    "status": "active",
    "runtime": {
        "engine": "CPython",
        "version": "3.12",
        "sandbox": "runsc / isolated worker",
    },
    "supported_compilers": [
        {"name": "Python", "slug": "python", "status": "available"},
        {"name": "HTML/CSS/JS", "slug": "html", "status": "available"},
        {"name": "Java", "slug": "java", "status": "coming_soon"},
        {"name": "C++", "slug": "cpp", "status": "coming_soon"},
    ],
}

print(f"Platform: {compiler_hub['platform']} (v{compiler_hub['version']})")
print(f"Execution Engine: {compiler_hub['runtime']['engine']} via {compiler_hub['runtime']['sandbox']}")

print("\nCompiler Registry:")
for tool in compiler_hub["supported_compilers"]:
    icon = "✅" if tool["status"] == "available" else "⏳"
    print(f"  {icon} {tool['name']:<15} [{tool['status']}]")
`,
  },
  {
    id: "standard-input",
    name: "8. Standard Input (input())",
    description: "Reading user input from STDIN, processing strings, and calculating results.",
    category: "Beginner",
    code: `# Standard Input Processing in Python
# Tip: Check the 'Input (STDIN)' tab below to see or edit the input stream!

print("Reading input from STDIN...")

try:
    user_name = input("Enter your name: ")
    user_city = input("Enter your city: ")
    fav_num_str = input("Enter your favorite number: ")
    fav_number = int(fav_num_str)

    print("\n--- Processed Input Results ---")
    print(f"Hello, {user_name} from {user_city}!")
    print(f"Your favorite number squared is: {fav_number ** 2}")
    print(f"Double your favorite number is: {fav_number * 2}")

except (EOFError, ValueError) as err:
    print(f"Input error: {err}")
    print("Ensure you provide valid lines in the 'Input (STDIN)' panel before running.")
`,
    defaultStdin: "Alice\nTokyo\n7\n",
  },
  {
    id: "error-handling",
    name: "9. Error Handling (try/except)",
    description: "Gracefully handling exceptions, multiple except blocks, and finally cleanup.",
    category: "Intermediate",
    code: `# Robust Error Handling in Python

def safe_divide(a: float, b: float):
    print(f"\nAttempting: {a} / {b}")
    try:
        result = a / b
    except ZeroDivisionError:
        print("  ⚠️ Caught ZeroDivisionError: Cannot divide by zero!")
        return None
    except TypeError as e:
        print(f"  ⚠️ Caught TypeError: {e}")
        return None
    else:
        print(f"  ✅ Success! Quotient = {result}")
        return result
    finally:
        print("  🧹 Finally block executed (resource cleanup).")

safe_divide(100, 4)
safe_divide(42, 0)
safe_divide(80, "invalid")
`,
  },
  {
    id: "simple-calculations",
    name: "10. Calculations & Math",
    description: "Math standard library: trigonometry, square roots, factorials, and statistics.",
    category: "Beginner",
    code: `# Simple Calculations & Python Math Module
import math

print("=== Mathematical Computations ===")
radius = 5.0
area = math.pi * (radius ** 2)
circumference = 2 * math.pi * radius

print(f"Circle (radius = {radius}):")
print(f"  Area: {area:.4f}")
print(f"  Circumference: {circumference:.4f}")

# Factorials and Powers
number = 6
print(f"\nFactorial of {number}! = {math.factorial(number)}")
print(f"Square root of 144 = {math.isqrt(144)}")
print(f"Hypotenuse of triangle (3, 4) = {math.hypot(3, 4)}")
print(f"Greatest Common Divisor (48, 180) = {math.gcd(48, 180)}")
`,
  },
];
