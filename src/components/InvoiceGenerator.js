// App.js
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Invoice = React.forwardRef(({ invoiceData }, ref) => (
  <div ref={ref} style={{ padding: '20px', maxWidth: '700px', margin: 'auto', border: '1px solid #ddd', fontFamily: 'Arial' }}>
    <h2 style={{ color: '#333', textAlign: 'center' }}>Invoice</h2>
    <h1 style={{ color: '#333', textAlign: 'center' }}>Baban Enterprises</h1>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
      <div>
        <p><strong>Invoice Date:</strong> {new Date().toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> {invoiceData.dueDate || "Not specified"}</p>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p><strong>Bill To:</strong></p>
        <p>{invoiceData.customerName}</p>
        <p>{invoiceData.customerAddress}</p>
      </div>
    </div>
    <table width="100%" border="1" cellPadding="10" cellSpacing="0" style={{ borderCollapse: 'collapse', marginBottom: '20px' }}>
      <thead>
        <tr style={{ backgroundColor: '#f5f5f5', textAlign: 'left' }}>
          <th>Item</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>GST (%)</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        {invoiceData.items.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>₹{item.price.toFixed(2)}</td>
            <td>{item.gst}%</td>
            <td>₹{(item.quantity * item.price * (1 + item.gst / 100)).toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <p><strong>Notes:</strong> {invoiceData.notes}</p>
      <p><strong>Subtotal:</strong> ₹{invoiceData.subtotal.toFixed(2)}</p>
      <p><strong>Discount:</strong> {invoiceData.discount}%</p>
      <p><strong>Total Amount Due:</strong> ₹{invoiceData.total.toFixed(2)}</p>
    </div>
  </div>
));

const InvoiceGenerator = () => {
  const componentRef = useRef();
  const [invoiceData, setInvoiceData] = useState({
    customerName: '',
    customerAddress: '',
    items: [{ name: '', quantity: 1, price: 0, gst: 0 }],
    subtotal: 0,
    total: 0,
    discount: 0,
    dueDate: '',
    notes: '',
  });

  const handleDownload = async () => {
    const canvas = await html2canvas(componentRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save("invoice.pdf");
  };

  const handleInputChange = (e, index, field) => {
    const newItems = [...invoiceData.items];
    newItems[index][field] = field === 'quantity' || field === 'price' || field === 'gst' ? parseFloat(e.target.value) : e.target.value;
    const newSubtotal = newItems.reduce((sum, item) => sum + item.quantity * item.price * (1 + item.gst / 100), 0);
    const newTotal = newSubtotal - (newSubtotal * (invoiceData.discount / 100));
    setInvoiceData({ ...invoiceData, items: newItems, subtotal: newSubtotal, total: newTotal });
  };

  const addItem = () => {
    setInvoiceData({ ...invoiceData, items: [...invoiceData.items, { name: '', quantity: 1, price: 0, gst: 0 }] });
  };

  const handleCustomerChange = (e) => {
    const { name, value } = e.target;
    let newTotal = invoiceData.subtotal;
    if (name === 'discount') {
      newTotal = invoiceData.subtotal - (invoiceData.subtotal * (parseFloat(value) / 100));
    }
    setInvoiceData({ ...invoiceData, [name]: name === 'discount' ? parseFloat(value) : value, total: newTotal });
  };

  return (
    <div style={{ textAlign: 'left', marginTop: '50px', fontFamily: 'Arial', paddingLeft: '50px', paddingRight: '50px' }}>
      <h2 style={{ textAlign: 'Left' }}>Invoice Generator</h2>
      <h1 style={{ textAlign: 'Right' }}>GST NO :-10BFAPD3284H1Z2</h1>

      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <div style={{ flex: 1, paddingRight: '10px' }}>
          <label>Customer Name</label>
          <input
            type="text"
            name="customerName"
            placeholder="Enter Customer Name"
            value={invoiceData.customerName}
            onChange={handleCustomerChange}
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
          <label>Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={invoiceData.dueDate}
            onChange={handleCustomerChange}
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
          <label>Notes</label>
          <input
            type="text"
            name="notes"
            placeholder="Additional notes (e.g., 'Thank you for your business!')"
            value={invoiceData.notes}
            onChange={handleCustomerChange}
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
        </div>
        <div style={{ flex: 1, paddingLeft: '10px' }}>
          <label>Customer Address</label>
          <input
            type="text"
            name="customerAddress"
            placeholder="Enter Customer Address"
            value={invoiceData.customerAddress}
            onChange={handleCustomerChange}
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
          <label>Discount (%)</label>
          <input
            type="number"
            name="discount"
            placeholder="Enter Discount Percentage"
            value={invoiceData.discount}
            onChange={handleCustomerChange}
            style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
          />
        </div>
      </div>
      {invoiceData.items.map((item, index) => (
        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <label>Item Name</label>
            <input
              type="text"
              placeholder="Enter Item Name"
              value={item.name}
              onChange={(e) => handleInputChange(e, index, 'name')}
              style={{ padding: '8px', width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Quantity</label>
            <input
              type="number"
              placeholder="Enter Quantity"
              value={item.quantity}
              onChange={(e) => handleInputChange(e, index, 'quantity')}
              style={{ padding: '8px', width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>Price (₹)</label>
            <input
              type="number"
              placeholder="Enter Price"
              value={item.price}
              onChange={(e) => handleInputChange(e, index, 'price')}
              style={{ padding: '8px', width: '100%' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label>GST (%)</label>
            <input
              type="number"
              placeholder="Enter GST"
              value={item.gst}
              onChange={(e) => handleInputChange(e, index, 'gst')}
              style={{ padding: '8px', width: '100%' }}
            />
          </div>
        </div>
      ))}
      <button onClick={addItem} style={{ marginBottom: '20px', padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Add Item
      </button>
      <Invoice ref={componentRef} invoiceData={invoiceData} />
      <button onClick={handleDownload} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Download PDF
      </button>
    </div>
  );
};

export default InvoiceGenerator;