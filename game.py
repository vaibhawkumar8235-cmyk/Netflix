import random

print("🎮 Welcome to Guess The Number Game!")
print("------------------------------------")

# Computer random number choose karega (1 to 10)
number = random.randint(1, 10)

guess = int(input("Guess a number between 1 and 10: "))

if guess == number:
    print("🎉 Congratulations! You guessed it right!")
else:
    print("❌ Wrong guess!")
    print("The correct number was:", number)