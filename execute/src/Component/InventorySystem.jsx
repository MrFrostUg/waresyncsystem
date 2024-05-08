import { useState } from "react";

function Inventory() {
  const [price, setPrice] = useState(0);
  const [qty, setQty] = useState(0);
  const [total, setTotal] = useState(0);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [sum, setSum] = useState(0);

  function Calculation() {
    const updatedUsers = [...users, { name, qty, price, sum }];
    setUsers(updatedUsers);

    const newTotal = updatedUsers.reduce(
      (acc, user) => acc + Number(user.sum),
      0
    );
    setTotal(newTotal);

    setName("");
    setQty(0);
    setPrice(0);
    setSum(0);
  }

  const handlePriceChange = (e) => {
    const newPrice = parseFloat(e.target.value);
    if (!isNaN(newPrice)) {
      setPrice(newPrice);
      calculateTotal(newPrice, qty);
    }
  };

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity)) {
      setQty(newQuantity);
      calculateTotal(price, newQuantity);
    }
  };

  const calculateTotal = (price, qty) => {
    const newTotal = price * qty;
    setSum(newTotal);
  };

  function refreshPage() {
    window.location.reload();
  }

  return (
    <div className="container-fluid bg-2 text-center">
      <h1>WARE SYNC SYSTEM TECHNOLOGIES</h1>
      <br />
      <div className="row">
        <div className="col-sm-8">
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Option</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Item Name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Price"
                    value={price}
                    onChange={handlePriceChange}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter Qty"
                    value={qty}
                    onChange={handleQuantityChange}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={sum}
                    className="form-control"
                    placeholder="Enter Total"
                    id="total_cost"
                    name="total_cost"
                    disabled
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success"
                    type="submit"
                    onClick={Calculation}
                  >
                    Add
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <h3>Add Products</h3>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {users.map((row, index) => (
                <tr key={index}>
                  <td>{row.name}</td>
                  <td>{row.price}</td>
                  <td>{row.qty}</td>
                  <td>{row.sum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="col-sm-4">
          <div className="form-group">
            <h3>Total</h3>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Total"
              required
              disabled
              value={total}
            />
            <br />
            <button
              type="button"
              className="btn btn-success"
              onClick={refreshPage}
            >
              Complete Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
