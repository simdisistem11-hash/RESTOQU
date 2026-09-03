export function exportToCSV(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printReportPDF(title: string, subtitle: string, headers: string[], rows: (string | number)[][]) {
  const headersHTML = headers.map(h => `<th style="border: 1px solid #cbd5e1; padding: 8px 12px; background: #f1f5f9; text-align: left; font-size: 12px;">${h}</th>`).join('');
  const rowsHTML = rows.map(row => `
    <tr>
      ${row.map(cell => `<td style="border: 1px solid #e2e8f0; padding: 8px 12px; font-size: 12px;">${cell}</td>`).join('')}
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @page { size: A4 portrait; margin: 15mm; }
        body { font-family: Arial, sans-serif; color: #1e293b; margin: 0; padding: 10px; }
        h1 { font-size: 20px; margin: 0 0 4px 0; color: #1d2925; }
        p { font-size: 12px; color: #64748b; margin: 0 0 16px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        .footer { margin-top: 24px; font-size: 10px; color: #94a3b8; text-align: right; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p>${subtitle} • Dicetak pada ${new Date().toLocaleString('id-ID')}</p>
      <table>
        <thead>
          <tr>${headersHTML}</tr>
        </thead>
        <tbody>
          ${rowsHTML}
        </tbody>
      </table>
      <div class="footer">RestoQu Restaurant Management System</div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}
