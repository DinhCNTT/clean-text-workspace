/**
 * Utility functions for cleaning up messy HTML/text.
 */

const SAFE_STYLE_PROPS = new Set(['color', 'font-weight', 'font-style', 'text-decoration']);
const BLOCK_TAGS = new Set(['P','DIV','SECTION','ARTICLE','HEADER','FOOTER','ASIDE','NAV','MAIN','BLOCKQUOTE','UL','OL','LI']);

export interface CleanOptions {
  removeLinks?: boolean;
  plainTextOnly?: boolean;
}

const flattenLiContent = (li: Element, doc: Document): string => {
  const clone = li.cloneNode(true) as HTMLElement;

  const processBlocks = (el: HTMLElement) => {
    const blocks = Array.from(el.querySelectorAll(
      Array.from(BLOCK_TAGS).map(t => t.toLowerCase()).join(',')
    )).reverse();

    for (const block of blocks) {
      const span = doc.createElement('span');
      span.innerHTML = block.innerHTML;
      
      let next = block.nextSibling;
      while (next && next.nodeType === Node.TEXT_NODE && !next.textContent?.trim()) {
        next = next.nextSibling;
      }
      if (next && next.nodeName !== 'BR') {
        span.appendChild(doc.createElement('br'));
      }
      
      block.parentNode?.replaceChild(span, block);
    }
  };

  processBlocks(clone);
  return clone.innerHTML.trim();
};

const convertListsToParagraphs = (doc: Document) => {
  const lists = Array.from(doc.body.querySelectorAll('ul, ol')).reverse();
  for (const list of lists) {
    if (!doc.body.contains(list)) continue;

    const items = Array.from(list.querySelectorAll(':scope > li'));
    const fragment = doc.createDocumentFragment();

    for (const li of items) {
      const p = doc.createElement('p');
      p.innerHTML = flattenLiContent(li, doc);
      fragment.appendChild(p);
    }
    list.parentNode?.replaceChild(fragment, list);
  }
};

const convertDivsToParagraphs = (doc: Document) => {
  let divs = Array.from(doc.body.querySelectorAll('div'));
  while (divs.length > 0) {
    for (const div of divs) {
      if (!div.querySelector('div')) {
        const p = doc.createElement('p');
        const style = div.getAttribute('style');
        if (style) p.setAttribute('style', style);
        p.innerHTML = div.innerHTML;
        div.parentNode?.replaceChild(p, div);
      }
    }
    divs = Array.from(doc.body.querySelectorAll('div'));
  }
};

const sanitizeAllElements = (doc: Document, options?: CleanOptions) => {
  doc.body.querySelectorAll('*').forEach(el => {
    const htmlEl = el as HTMLElement;
    ['class', 'id', 'data-highlight', 'data-sourcepos', 'dir'].forEach(attr =>
      htmlEl.removeAttribute(attr)
    );
    
    if (options?.plainTextOnly) {
      htmlEl.removeAttribute('style');
    } else {
      const style = htmlEl.getAttribute('style');
      if (style) {
        const safe = style.split(';')
          .map(s => s.trim()).filter(Boolean)
          .filter(decl => SAFE_STYLE_PROPS.has(decl.split(':')[0].trim().toLowerCase()));
        if (safe.length > 0) htmlEl.setAttribute('style', safe.join('; '));
        else htmlEl.removeAttribute('style');
      }
    }
  });
};

const unwrapLinks = (doc: Document) => {
  const links = Array.from(doc.body.querySelectorAll('a'));
  links.forEach(a => {
    const fragment = doc.createDocumentFragment();
    while (a.firstChild) {
      fragment.appendChild(a.firstChild);
    }
    a.parentNode?.replaceChild(fragment, a);
  });
};

const stripFormattingTags = (doc: Document) => {
  const tags = ['b', 'strong', 'i', 'em', 'u', 'mark', 'span', 'font'];
  tags.forEach(tag => {
    const elements = Array.from(doc.body.querySelectorAll(tag));
    elements.forEach(el => {
      const fragment = doc.createDocumentFragment();
      while (el.firstChild) {
        fragment.appendChild(el.firstChild);
      }
      el.parentNode?.replaceChild(fragment, el);
    });
  });
};

const convertHeadingsToParagraphs = (doc: Document) => {
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  headings.forEach(tag => {
    let elements = Array.from(doc.body.querySelectorAll(tag));
    while (elements.length > 0) {
      for (const el of elements) {
        const hasBlock = Array.from(el.querySelectorAll('*')).some(c => BLOCK_TAGS.has(c.tagName.toUpperCase()));
        
        if (hasBlock) {
          const fragment = doc.createDocumentFragment();
          while (el.firstChild) {
            fragment.appendChild(el.firstChild);
          }
          el.parentNode?.replaceChild(fragment, el);
        } else {
          const p = doc.createElement('p');
          p.innerHTML = el.innerHTML;
          el.parentNode?.replaceChild(p, el);
        }
      }
      elements = Array.from(doc.body.querySelectorAll(tag));
    }
  });
};

const cleanTextNodes = (node: Node) => {
  if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
    node.nodeValue = node.nodeValue
      .replace(/^[\s\u00A0]*[·◦▪]+[\s\u00A0]*$/gm, '')
      .replace(/[ \t\u00A0]{2,}/g, ' ');
  } else {
    node.childNodes.forEach(cleanTextNodes);
  }
};

const removeEmptyElements = (doc: Document) => {
  const preserve = new Set(['BR', 'HR', 'IMG', 'TD', 'TH']);
  let found = true;
  while (found) {
    found = false;
    doc.body.querySelectorAll('*').forEach(el => {
      if (!preserve.has(el.tagName) && el.innerHTML.trim() === '') {
        el.remove();
        found = true;
      }
    });
  }
};

export const cleanHtmlUtils = (htmlString: string, options?: CleanOptions): string => {
  if (!htmlString) return '';

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  if (options?.removeLinks) unwrapLinks(doc);
  convertHeadingsToParagraphs(doc);
  if (options?.plainTextOnly) stripFormattingTags(doc);
  
  convertListsToParagraphs(doc);
  convertDivsToParagraphs(doc);
  sanitizeAllElements(doc, options);
  cleanTextNodes(doc.body);
  removeEmptyElements(doc);

  return doc.body.innerHTML;
};
