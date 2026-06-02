/**
 * Generate and download a file (Word/Text)
 */
export const downloadFile = (html: string, format: 'doc' | 'txt') => {
  let content = '';
  let filename = '';
  let type = '';

  if (format === 'doc') {
    // Generate a simple HTML document that Word can read natively
    content = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Clean Text Export</title></head>
      <body>${html}</body>
      </html>
    `;
    filename = 'van-ban-sach.doc';
    type = 'application/msword;charset=utf-8';
  } else {
    // Convert HTML to plain text using a temporary div
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    content = tempDiv.innerText;
    filename = 'van-ban-sach.txt';
    type = 'text/plain;charset=utf-8';
  }

  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
