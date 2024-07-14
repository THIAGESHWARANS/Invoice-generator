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



function handleImageUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const uploadedImage = document.getElementById('uploadedImage');
    uploadedImage.src = e.target.result;
    const uploadedImageContainer = document.getElementById('uploadedImageContainer');
    uploadedImageContainer.classList.remove('d-none'); // Show uploaded image container
    hideUploadLogo(); // Hide upload logo button
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}


//upload functionalities

function editImage() {
  const uploadLogoInput = document.getElementById('uploadLogo');
  uploadLogoInput.click(); // Trigger file input click to choose new image
}

function deleteImage() {
  // Placeholder for delete functionality
  console.log('Delete image');
  const uploadedImageContainer = document.getElementById('uploadedImageContainer');
  const uploadedImage = document.getElementById('uploadedImage');
  uploadedImage.src = ''; // Clear the uploaded image
  uploadedImageContainer.classList.add('d-none'); // Hide uploaded image container
  showUploadLogo(); // Show upload logo button
}

function hideUploadLogo() {
  const uploadLogoContainer = document.querySelector('.upload-svg').parentNode;
  uploadLogoContainer.classList.add('d-none'); // Hide upload logo container
}

function showUploadLogo() {
  const uploadLogoContainer = document.querySelector('.upload-svg').parentNode;
  uploadLogoContainer.classList.remove('d-none'); // Show upload logo container
}


//downloading pdf

document.getElementById('downloadPDF').addEventListener('click', function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Check if a logo is uploaded
  const logoUpload = document.getElementById('uploadLogo').files[0];
  if (logoUpload) {
      const reader = new FileReader();
      reader.onload = function (event) {
          const logoDataUrl = event.target.result;

          // Add logo image to the PDF
          doc.addImage(logoDataUrl, 'PNG', 10, 10, 50, 50);

          // Generate the rest of the invoice content
          generateInvoiceContent(doc);

          // Save the PDF
          doc.save('invoice.pdf');
      };
      reader.readAsDataURL(logoUpload);
  } else {
      // Generate the invoice content without logo
      generateInvoiceContent(doc);

      // Save the PDF
      doc.save('invoice.pdf');
  }
});

function generateInvoiceContent(doc) {
  // Invoice heading
  const headingInput = document.getElementById('headingInput').value;
  doc.setFontSize(18);
  doc.text(headingInput, 20, 20);

  // Your Company Details
  const yourCompany = document.getElementById("yourcompany").value;
  const yourName = document.getElementById("yourname").value;
  const gstin = document.getElementById("gstin").value;
  const address = document.getElementById("address").value;
  const state = document.getElementById("state").value;
  const country = document.getElementById("country").value;

  doc.setFontSize(12);
  doc.text("Your Company:", 20, 40);
  doc.text(yourCompany, 20, 45);
  doc.text(yourName, 20, 50);
  doc.text(gstin, 20, 55);
  doc.text(address, 20, 60);
  doc.text(state, 20, 65);
  doc.text(country, 20, 70);

  // Bill To Details
  const billTo = document.getElementById("billto").value;
  const clientCompany = document.getElementById("clientcompany").value;
  const clientGstin = document.getElementById("clientgstin").value;
  const clientAddress = document.getElementById("clientaddress").value;
  const clientCity = document.getElementById("clientcity").value;
  const clientState = document.getElementById("clientstate").value;
  const clientCountry = document.getElementById("clientcountry").value;

  doc.text(billTo, 120, 45);
  doc.text(clientCompany, 120, 50);
  doc.text(clientGstin, 120, 55);
  doc.text(clientAddress, 120, 60);
  doc.text(clientCity, 120, 65);
  doc.text(clientState, 120, 70);
  doc.text(clientCountry, 120, 75);

  // Invoice Details
  const invoiceNo = document.getElementById("invoice").value;
  const invoiceDate = document.getElementById("date1").value;
  const dueDate = document.getElementById("date2").value;

  doc.text("Invoice No:", 20, 90);
  doc.text(invoiceNo, 60, 90);
  doc.text("Invoice Date:", 20, 95);
  doc.text(invoiceDate, 60, 95);
  doc.text("Due Date:", 20, 100);
  doc.text(dueDate, 60, 100);

  // Table
  const tableBody = [];
  const rows = document.querySelectorAll("#invoiceTable tbody tr");
  rows.forEach(row => {
      const itemDescription = row.querySelector("textarea").value;
      const hsnSac = row.querySelector(".hsn-sac").value;
      const qty = row.querySelector(".qty").value;
      const rate = row.querySelector(".rate").value;
      const sgst = row.querySelector(".sgst").value;
      const cgst = row.querySelector(".cgst").value;
      const cess = row.querySelector(".cess").value;
      const amount = row.querySelector(".total-value").innerText;

      tableBody.push([itemDescription, hsnSac, qty, rate, sgst, cgst, cess, amount]);
  });

  doc.autoTable({
      head: [['Item Description', 'HSN/SAC', 'Qty', 'Rate', 'SGST (%)', 'CGST (%)', 'Cess', 'Amount']],
      body: tableBody,
      startY: 110,
  });

  // Totals
  const subTotal = document.getElementById("subTotal").innerText;
  const totalSGST = document.getElementById("totalSGST").innerText;
  const totalCGST = document.getElementById("totalCGST").innerText;
  const total = document.getElementById("total").innerText;

  doc.text("Sub Total:", 140, doc.autoTable.previous.finalY + 10);
  doc.text(subTotal, 180, doc.autoTable.previous.finalY + 10);
  doc.text("SGST:", 140, doc.autoTable.previous.finalY + 15);
  doc.text(totalSGST, 180, doc.autoTable.previous.finalY + 15);
  doc.text("CGST:", 140, doc.autoTable.previous.finalY + 20);
  doc.text(totalCGST, 180, doc.autoTable.previous.finalY + 20);
  doc.text("Total:", 140, doc.autoTable.previous.finalY + 25);
  doc.text(total, 180, doc.autoTable.previous.finalY + 25);

  // Notes
  const notes = document.getElementById("notes").value;
  const notesContent = document.querySelector(".formcon5 textarea").value;

  doc.text(notes, 20, doc.autoTable.previous.finalY + 40);
  doc.text(notesContent, 20, doc.autoTable.previous.finalY + 45);

  // Terms and Conditions
  const terms = document.getElementById("terms").value;
  const termsContent = document.querySelector(".formcon6 textarea").value;

  doc.text(terms, 20, doc.autoTable.previous.finalY + 60);
  doc.text(termsContent, 20, doc.autoTable.previous.finalY + 65);
}
