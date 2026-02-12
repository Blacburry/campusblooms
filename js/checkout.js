const BACKEND_URL = "https://campusblooms-backend.onrender.com";

function getCartTotal() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  return cart.reduce((sum, item) => sum + item.price, 0);
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
          // 🔹 Verify Payment
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

          const data = await verifyResponse.json();

          if (data.success) {
            localStorage.removeItem("cart");
            window.location.href = "success.html";
          } else {
            alert("Payment succeeded but order notification failed.");
          }

        } catch (err) {
          alert("Payment verification failed.");
          console.error(err);
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();

  } catch (error) {
    alert("Something went wrong. Please try again.");
    console.error(error);
  }
}

loadCheckoutTotal();
