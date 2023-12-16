window.addEventListener("load", () => {
  let list = [];
  let tbody = document.querySelector("#tbody");
  let saveNewProductBtn = document.querySelector("#saveNewProductBtn");

  saveNewProductBtn.addEventListener("click", async () => {
    let newProduct = {
      productName: document.querySelector("#productName").value,
      qty: document.querySelector("#qty").value,
      price: document.querySelector("#price").value,
      mangDate: document.querySelector("#mangDate").value,
      id: id,
    };
    let url = `http://localhost:3031/api/save-new-product`;
    let option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(newProduct),
    };
    try {
      let response = await fetch(url, option);
      let data = await response.json();
      if (data.status === true) {
        let isToAddNew = confirm(
          data.message + ", do you want to add new product ?"
        );
        if (isToAddNew) {
          document.querySelector("#productName").value =
            document.querySelector("#qty").value =
            document.querySelector("#price").value =
            document.querySelector("#mangDate").value =
              "";
        } else {
          window.location.reload();
        }
      } else {
        alert(data.message);
      }
      getProductDetails();
    } catch (error) {
      console.log(error);
    }
  });

  async function getProductDetails() {
    try {
      let url = `http://localhost:3031/api/get-product`;
      let response = await fetch(url, { method: "GET" });
      let data = await response.json();
      if (data.status === true) {
        list = data.result;
        printData(list);
      } else {
        alert(data.message);
        window.location.reload();
      }
    } catch (error) {
      alert(data.message);
    }
  }

  function printData(list) {
    tbody.innerHTML = list
      .map((product, index) => {
        return `<tr>
                  <th scope="row">${index + 1}</th>
                  <td>${product.productName}</td>
                  <td>Rs. ${product.price}</td>
                  <td>${product.qty} Units</td>
                  <td><button data-remove-id="${
                    product._id
                  }" class="remove btn btn-danger btn-sm">DEL</button></td>
              </tr>`;
      })
      .join("");

    AddRemoveButtonEvent();
  }
  function AddRemoveButtonEvent() {
    let removeBtn = document.querySelectorAll(".remove");
    removeBtn.forEach((button) => {
      button.addEventListener("click", () => {
        let { removeId } = button.dataset;
        removeProduct(removeId);
      });
    });
  }

  async function removeProduct(id) {
    let url = `http://localhost:3031/api/remove-product/${id}`;
    let response = await fetch(url, { method: "DELETE" });
    let data = await response.json();
    if (data.status === true) {
      getProductDetails();
    }
    alert(data.message);
  }

  getProductDetails();
});
