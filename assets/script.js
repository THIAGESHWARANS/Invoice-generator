document.querySelectorAll('.editable').forEach(textarea => {
  textarea.addEventListener('input',function(){
    this.style.height='auto';
    this.style.height=(this.scrollHeight)+'px';
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Calculate totals on initial load
  updateTotals();

  // Add Line Item Button Event Listener
  document.getElementById('addLineItem').addEventListener('click', function() {
    addLineItem();
    updateTotals();
  });

  // Calculate totals on input change
  document.querySelectorAll('.qty, .rate, .sgst, .cgst, .cess').forEach(input => {
    input.addEventListener('input', function() {
      updateTotals();
    });
  });
});

function addLineItem() {
  const tbody = document.querySelector('#invoiceTable tbody');
  
  // Create a new row
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><textarea class="editable">Enter item name/description</textarea></td>
    <td><input type="text" class="form-control hsn-sac" value="HSN/SAC" /></td>
    <td><input type="number" class="form-control qty" value="1" /></td>
    <td><input type="number" class="form-control rate" value="100.00" /></td>
    <td><input type="number" class="form-control sgst" value="6" /></td>
    <td><input type="number" class="form-control cgst" value="6" /></td>
    <td><input type="number" class="form-control cess" value="0" /></td>
    <td><span class="total-value">100.00</span></td>
  `;

  // Append the new row to the tbody
  tbody.appendChild(newRow);

  // Add event listeners to new row inputs
  newRow.querySelectorAll('.qty, .rate, .sgst, .cgst, .cess').forEach(input => {
    input.addEventListener('input', function() {
      updateTotals();
    });
  });
}




function updateTotals() {
  let subTotal = 0;
  let totalSGST = 0;
  let totalCGST = 0;
  let totalCess = 0;

  const rows = document.querySelectorAll('#invoiceTable tbody tr');
  rows.forEach(row => {
    const qty = parseFloat(row.querySelector('.qty').value) || 0;
    const rate = parseFloat(row.querySelector('.rate').value) || 0;
    const sgst = parseFloat(row.querySelector('.sgst').value) || 0;
    const cgst = parseFloat(row.querySelector('.cgst').value) || 0;
    const cess = parseFloat(row.querySelector('.cess').value) || 0;
    const totalAmount = qty * rate; // Calculate Total Amount

    row.querySelector('.total-value').textContent = totalAmount.toFixed(2); // Display Total Amount with two decimal places

    subTotal += totalAmount;
    totalSGST += (totalAmount * sgst / 100); // Calculate SGST based on percentage
    totalCGST += (totalAmount * cgst / 100); // Calculate CGST based on percentage
    totalCess += cess;
  });

  document.getElementById('subTotal').textContent = subTotal.toFixed(2); // Display Sub Total

  // Update SGST and CGST totals in footer
  document.getElementById('totalSGST').textContent = totalSGST.toFixed(2);
  document.getElementById('totalCGST').textContent = totalCGST.toFixed(2);

  // Calculate and display the total in footer
  const total = subTotal + totalSGST + totalCGST + totalCess;
  document.getElementById('total').textContent = total.toFixed(2);
}
