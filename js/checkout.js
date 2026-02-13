const API_URLS = {
  development: "http://localhost:5000",
  production: "https://campusblooms-backend.onrender.com" // 🔴 REPLACE THIS WITH YOUR DEPLOYED BACKEND URL
};

const BACKEND_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? API_URLS.development
  : API_URLS.production;

function getCartTotal() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  let total = 0;

  cart.forEach(item => {
    const product = products.find(p => p.id === item.id);
    total += product.price * item.quantity;
  });

  return total;
}


function loadCheckoutTotal() {
  const total = getCartTotal();
  const totalDisplay = document.getElementById("checkout-total");
  if (totalDisplay) {
    totalDisplay.innerText = "Total: ₹" + total;
  }
}

async function startPayment() {
  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  const totalAmount = getCartTotal();

  if (!name || !phone || !address) {
    alert("Please fill all customer details.");
    return;
  }

  const payBtn = document.getElementById("pay-btn");
  payBtn.innerText = "Processing...";
  payBtn.disabled = true;

  try {
    // 🔹 Create Order
    const orderResponse = await fetch(`${BACKEND_URL}/create-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount })
    });

    if (!orderResponse.ok) {
      throw new Error("Failed to create Razorpay order");
    }

    const order = await orderResponse.json();

    const options = {
      key: "rzp_test_SFNQT0wxXlGuFI", // Replace with live key when going live
      amount: order.amount,
      currency: "INR",
      order_id: order.id,

      handler: async function (response) {
  try {

    const verifyResponse = await fetch(`${BACKEND_URL}/verify-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        customer: { name, phone, address }
      })
    });

    if (!verifyResponse.ok) {
      throw new Error("Backend verification failed");
    }

    const data = await verifyResponse.json();

    if (data.success) {
      localStorage.removeItem("cart");
      window.location.href = "success.html";
    } else {
      alert("Order recorded but notification failed.");
      localStorage.removeItem("cart");
      window.location.href = "success.html";
    }

  } catch (err) {
    console.error(err);
    alert("Payment verification failed.");
    payBtn.innerText = "Pay Now 💖";
    payBtn.disabled = false;
  }
}

    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Payment error:", error);
    alert("Payment failed. Please check the console for details and ensure the backend URL is configured correctly.");
  }
}

loadCheckoutTotal();
