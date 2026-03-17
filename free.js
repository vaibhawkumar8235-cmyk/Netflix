// fee.js
let payments = []; // Array to store all payments

function processPayment() {
    let name = document.getElementById("studentName").value.trim();
    let roll = document.getElementById("rollNo").value.trim();
    let semester = document.getElementById("semester").value;
    let amount = document.getElementById("amount").value;
    let method = document.querySelector('input[name="paymentMethod"]:checked').value;

    if (!name || !roll || !amount) {
        alert("Please fill all fields!");
        return;
    }

    // Hide all extra payment fields initially
    document.getElementById("qrCodeDiv").style.display = "none";
    document.getElementById("upiField").style.display = "none";
    document.getElementById("cardField").style.display = "none";

    // Show fields based on payment method
    if(method === "QR") {
        document.getElementById("qrCodeDiv").style.display = "block";
    } else if(method === "UPI") {
        document.getElementById("upiField").style.display = "block";
    } else if(method === "Card") {
        document.getElementById("cardField").style.display = "block";
    }

    // Save payment record
    let paymentRecord = {
        studentName: name,
        rollNo: roll,
        semester: semester,
        amount: amount,
        method: method,
        upiId: method === "UPI" ? document.getElementById("upiId").value.trim() : null,
        cardNumber: method === "Card" ? document.getElementById("cardNumber").value.trim() : null,
        date: new Date().toLocaleString()
    };
    payments.push(paymentRecord);

    // Display confirmation
    document.getElementById("paymentResult").innerHTML = 
        `Payment of ₹${amount} via <b>${method}</b> successful!`;

    console.log("All Payments:", payments);
}

// Function to dynamically update payment method fields when user selects a method
document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
    radio.addEventListener('change', () => {
        processPayment(); // Optional: Update visible fields instantly on change
    });
});