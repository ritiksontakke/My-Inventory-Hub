window.addEventListener("load", () => {
  let list = [];
  let tbody = document.querySelector("#tbody");
  let saveNewProductBtn = document.querySelector('#saveNewProductBtn')
  
  saveNewProductBtn.addEventListener('click',()=>{
    let newProduct = {
      productName: document.querySelector('#productName').value,
      qty: document.querySelector('#qty').value,
      price: document.querySelector('#price').value,
      mangDate: document.querySelector('#mangDate').value,
    }
    console.log(newProduct)
  })

  async function getProductDetails() {
    let url = `http://localhost:3031/api/get-product`;
    let response = await fetch(url, { method: "GET" });
    let data = await response.json();
    if (data.status === true) {
      list = data.result;
      printData(list);
    } else {
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
    let response = await fetch(url,{ method: "DELETE" });
    let data = await response.json();
    if (data.status === true) {
      getProductDetails();
    }
    alert(data.message);
  }

  getProductDetails();
});
