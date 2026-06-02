/**
 * Copy HTML to clipboard — Word compatible.
 */
export const copyRichTextToClipboard = async (html: string): Promise<void> => {
  try {
    const blobHtml = new Blob([html], { type: 'text/html' });
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const blobText = new Blob([tempDiv.innerText], { type: 'text/plain' });
    await navigator.clipboard.write([
      new ClipboardItem({ 'text/html': blobHtml, 'text/plain': blobText })
    ]);
  } catch {
    // Fallback: execCommand
    const hiddenDiv = document.createElement('div');
    hiddenDiv.innerHTML = html;
    Object.assign(hiddenDiv.style, {
      position: 'absolute', left: '-9999px', top: '-9999px',
      border: 'none', padding: '0', margin: '0', background: 'transparent'
    });
    document.body.appendChild(hiddenDiv);
    const range = document.createRange();
    range.selectNodeContents(hiddenDiv);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    document.execCommand('copy');
    sel?.removeAllRanges();
    document.body.removeChild(hiddenDiv);
  }
};
