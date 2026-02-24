#include <stdio.h>

int main() {
    int num1, num2, result;
    char operator;

    printf("Simple Calculator\n");
    printf("-----------------\n");

    printf("Enter first number: ");
    scanf("%d", &num1);

    printf("Enter operator (+, -, *, /): ");
    scanf(" %c", &operator);

    printf("Enter second number: ");
    scanf("%d", &num2);

    if(operator == '+') {
        result = num1 + num2;
        printf("Result = %d", result);
    }
    else if(operator == '-') {
        result = num1 - num2;
        printf("Result = %d", result);
    }
    else if(operator == '*') {
        result = num1 * num2;
        printf("Result = %d", result);
    }
    else if(operator == '/') {
        if(num2 != 0) {
            result = num1 / num2;
            printf("Result = %d", result);
        } else {
            printf("Error! Division by zero not allowed.");
        }
    }
    else {
        printf("Invalid operator!");
    }

    return 0;
}