import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateInvoice = (order) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(22, 101, 52); // Dark Green
    doc.text("INVOICE", 105, 20, null, null, "center");

    // Business Details (Static for now, can be dynamic later)
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("MSME Business Manager", 14, 30);
    doc.text("India", 14, 35);

    // Order Info
    doc.text(`Order ID: ${order._id.slice(-6).toUpperCase()}`, 140, 30);
    doc.text(`Date: ${new Date(order.date).toLocaleDateString()}`, 140, 35);
    doc.text(`Customer: ${order.customerName || 'Walk-in'}`, 140, 40);

    // Line Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 45, 196, 45);

    // Table
    const tableColumn = ["Item", "Price", "Qty", "Total"];
    const tableRows = [];

    order.items.forEach(item => {
        const itemData = [
            item.name,
            `$${item.price}`,
            item.quantity,
            `$${item.price * item.quantity}`
        ];
        tableRows.push(itemData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [22, 101, 52] }, // Primary Green
    });

    // Total
    const finalY = doc.lastAutoTable.finalY || 60;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: $${order.totalAmount}`, 140, finalY + 20);

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100);
    doc.text("Thank you for your business!", 105, finalY + 40, null, null, "center");

    // Save
    doc.save(`Invoice_${order._id.slice(-6)}.pdf`);
};
