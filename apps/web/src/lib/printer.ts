export interface ReceiptData {
  header?: string;
  footer?: string;
  orderNumber: string;
  date: string;
  servicePointName: string;
  mainCustomerName?: string;
  mainCustomerPhone?: string;
  items: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    notes?: string;
    modifiers?: string[];
  }>;
  subtotal: number;
  serviceAmount: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  amountPaid: number;
  change: number;
  earnedPoints?: number;
}

export function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(num);
}

export function generateReceiptHTML(data: ReceiptData): string {
  const itemsHTML = data.items.map(item => `
    <tr>
      <td style="padding: 4px 0; vertical-align: top;">
        <div style="font-weight: bold;">${item.name}</div>
        ${item.modifiers && item.modifiers.length > 0 ? `<div style="font-size: 10px; color: #555;">+ ${item.modifiers.join(', ')}</div>` : ''}
        ${item.notes ? `<div style="font-size: 10px; color: #777; font-style: italic;">* ${item.notes}</div>` : ''}
      </td>
      <td style="padding: 4px 0; vertical-align: top; text-align: center;">${item.quantity}x</td>
      <td style="padding: 4px 0; vertical-align: top; text-align: right;">${formatRupiah(item.totalPrice)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Struk Pembayaran ${data.orderNumber}</title>
      <style>
        @page { size: 80mm auto; margin: 0; }
        body {
          width: 72mm;
          margin: 0 auto;
          padding: 8px;
          font-family: 'Courier New', Courier, monospace;
          font-size: 12px;
          color: #000;
          line-height: 1.3;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .divider { border-top: 1px dashed #000; margin: 8px 0; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      <div class="text-center bold" style="font-size: 16px;">${data.header || 'RESTOQU'}</div>
      <div class="text-center" style="font-size: 10px; margin-top: 2px;">Resto & Cafe Operating System</div>
      <div class="divider"></div>
      
      <div>No. Order : <span class="bold">${data.orderNumber}</span></div>
      <div>Tanggal   : ${data.date}</div>
      <div>Lokasi    : ${data.servicePointName}</div>
      <div>Pelanggan : ${data.mainCustomerName || 'Pelanggan'}</div>
      <div>Kasir     : POS Admin</div>
      
      <div class="divider"></div>

      <table>
        <thead>
          <tr style="border-bottom: 1px dashed #000;">
            <th style="text-align: left; padding-bottom: 4px;">Item</th>
            <th style="text-align: center; padding-bottom: 4px;">Qty</th>
            <th style="text-align: right; padding-bottom: 4px;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="divider"></div>

      <table>
        <tr>
          <td>Subtotal</td>
          <td class="text-right">${formatRupiah(data.subtotal)}</td>
        </tr>
        ${data.serviceAmount > 0 ? `<tr><td>Service Charge</td><td class="text-right">${formatRupiah(data.serviceAmount)}</td></tr>` : ''}
        ${data.taxAmount > 0 ? `<tr><td>Pajak (PB1)</td><td class="text-right">${formatRupiah(data.taxAmount)}</td></tr>` : ''}
        ${data.discountAmount > 0 ? `<tr><td>Diskon / Promo</td><td class="text-right">-${formatRupiah(data.discountAmount)}</td></tr>` : ''}
        <tr class="bold" style="font-size: 14px;">
          <td style="padding-top: 4px;">TOTAL</td>
          <td class="text-right" style="padding-top: 4px;">${formatRupiah(data.totalAmount)}</td>
        </tr>
      </table>

      <div class="divider"></div>

      <table>
        <tr>
          <td>Metode Bayar</td>
          <td class="text-right bold">${data.paymentMethod}</td>
        </tr>
        <tr>
          <td>Bayar / Tunai</td>
          <td class="text-right">${formatRupiah(data.amountPaid)}</td>
        </tr>
        <tr>
          <td>Kembali</td>
          <td class="text-right">${formatRupiah(data.change)}</td>
        </tr>
      </table>

      ${data.earnedPoints ? `
        <div class="divider"></div>
        <div class="text-center" style="font-size: 11px;">
          🎉 Selamat! Anda mendapatkan <span class="bold">${data.earnedPoints} Poin</span> Loyalty!
        </div>
      ` : ''}

      <div class="divider"></div>
      <div class="text-center" style="margin-top: 10px; font-size: 11px;">
        ${data.footer || 'Terima kasih atas kunjungan Anda!'}
      </div>
      <div class="text-center" style="font-size: 9px; margin-top: 4px; color: #555;">Powered by RestoQu</div>
    </body>
    </html>
  `;
}

export function generateKitchenTicketHTML(order: any): string {
  const items = order.items || [];
  const itemsHTML = items.map((item: any) => `
    <tr style="border-bottom: 1px solid #ccc;">
      <td style="padding: 8px 0; font-size: 16px; font-weight: bold;">
        ${item.product?.name || item.name}
        ${item.modifiers && item.modifiers.length > 0 ? `<div style="font-size: 12px; font-weight: normal; color: #444;">+ ${item.modifiers.map((m: any) => m.modifier?.name || m).join(', ')}</div>` : ''}
        ${item.notes ? `<div style="font-size: 13px; font-weight: bold; color: #d97706;">CATATAN: ${item.notes}</div>` : ''}
      </td>
      <td style="padding: 8px 0; font-size: 20px; font-weight: bold; text-align: right; vertical-align: top;">
        x${item.quantity}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>KITCHEN TICKET ${order.orderNumber}</title>
      <style>
        @page { size: 80mm auto; margin: 0; }
        body {
          width: 72mm;
          margin: 0 auto;
          padding: 8px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          color: #000;
        }
        .text-center { text-align: center; }
        .bold { font-weight: bold; }
        .divider { border-top: 2px solid #000; margin: 8px 0; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      <div class="text-center bold" style="font-size: 20px; background: #000; color: #fff; padding: 4px;">TIKET DAPUR</div>
      <div class="divider"></div>
      
      <div style="display: flex; justify-content: space-between; font-size: 16px;" class="bold">
        <span>${order.orderNumber}</span>
        <span>${order.servicePoint?.displayName || order.servicePointName || 'Meja'}</span>
      </div>
      <div style="font-size: 12px; margin-top: 4px;">Waktu: ${new Date().toLocaleTimeString('id-ID')}</div>
      
      <div class="divider"></div>

      <table>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="divider"></div>
      <div class="text-center bold" style="margin-top: 8px;">--- DAPUR / KITCHEN ---</div>
    </body>
    </html>
  `;
}

export function printReceiptViaBrowser(receiptData: ReceiptData) {
  const html = generateReceiptHTML(receiptData);
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
}

export function printKitchenTicketViaBrowser(orderData: any) {
  const html = generateKitchenTicketHTML(orderData);
  const printWindow = window.open('', '_blank', 'width=400,height=600');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }
}
