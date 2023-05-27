const buy = document.getElementById("buyBtn");

buy.addEventListener("click", async () => {
  const randNum = Math.random();
  const num = Math.floor(randNum * 10000);
  try {
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: "200",
        first_name: "mita",
        email: "mita@gmail.com",
        last_name: "sisay",
        currency: "USD",
        phone_number: "0912345678",
        tx_ref: "chewatatest-" + num,
        return_url: "http://localhost:5000/verification?id=chewatatest-" + num,
        "customization[title]": "Payment for cracking the code interview book",
        "customization[description]": "200ETB for one book",
      }),
    });

    const result = await response.json();
    window.location = result.data.data.checkout_url;
  } catch (error) {
    console.error("its the clients fetch:", error);
  }
});
