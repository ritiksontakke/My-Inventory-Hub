window.addEventListener("load", () => {
  let list = [];
  let tbody = document.querySelector("#tbody");
  let saveNewProductBtn = document.querySelector("#saveNewProductBtn");
  let imageFileElement = document.getElementById("pic");

  imageFileElement.addEventListener("change", () => {
    if (imageFileElement.files[0] !== undefined) {
      let ext = imageFileElement.files[0].name.substring(
        imageFileElement.files[0].name.lastIndexOf(".") + 1
      );
      ext = ext.toLowerCase();
      if (ext === "png" || ext === "jpg" || ext === "jpeg") {
        let reader = new FileReader();
        reader.onload = () => {
          document.querySelector("#preview").src = reader.result;
        };
        reader.readAsDataURL(imageFileElement.files[0]);
      } else {
        alert("File must of type JPG/JPEG/PNG");
        imageFileElement.value = "";
        document.querySelector("#preview").src = "";
      }
    }else {
      document.querySelector("#preview").src = "";
    }
  });

  saveNewProductBtn.addEventListener("click", async () => {
    let productFile = document.querySelector("#pic");
    let file = productFile.files[0];
    if (file === undefined) {
      alert("Please select a file");
      return false;
    }

    //FormData
    let formData = new FormData();

    formData.append(
      "productName",
      document.querySelector("#productName").value
    );
    formData.append("qty", document.querySelector("#qty").value);
    formData.append("price", document.querySelector("#price").value);
    formData.append("mangDate", document.querySelector("#mangDate").value);
    formData.append("id", id);
    formData.append("pic", file);

    let url = `http://localhost:3031/api/save-new-product`;
    let option = {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // "Content-Type": "multipart/form-data",
      },
      body: formData,
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
            document.querySelector("#pic").value =
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
                  <td>
                  <img src="/images/${product.image}" width="50" />
                  ${product.productName}</td>
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
