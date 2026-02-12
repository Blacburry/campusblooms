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
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address").value;

  const totalAmount = getCartTotal();

  if (!name || !phone || !address) {
    alert("Please fill all customer details.");
    return;
  }

  const orderResponse = await fetch("http://localhost:5000/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: totalAmount })
  });

  const order = await orderResponse.json();

  const options = {
    key: "rzp_test_SFHeLgkEUUfs9T",
    amount: order.amount,
    currency: "INR",
    order_id: order.id,

    handler: async function (response) {

      const verifyResponse = await fetch("http://localhost:5000/verify-payment", {
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
        localStorage.removeItem("cart"); // clear cart
        window.location.href = "success.html";
      } else {
        alert("Payment succeeded but order notification failed.");
      }
    }
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

loadCheckoutTotal();
