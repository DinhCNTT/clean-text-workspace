import * as cheerio from 'cheerio';
import { APP_CONSTANTS } from '../constants/app.constant.js';

const { HTML_CLEANER } = APP_CONSTANTS;

/**
 * Dọn dẹp HTML/Text ở Backend sử dụng Cheerio
 */
const cleanHtmlUtils = (htmlString, options = {}) => {
  if (!htmlString) return '';

  // load snippet, không tự động thêm thẻ html/body/head
  const $ = cheerio.load(htmlString, null, false);

  // 1. Loại bỏ liên kết
  if (options.removeLinks) {
    $('a').each((_, el) => {
      $(el).replaceWith($(el).contents());
    });
  }

  // 2. Chuyển đổi headings (h1-h6) thành paragraph
  const headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  headings.forEach(tag => {
    $(tag).each((_, el) => {
      $(el).replaceWith(`<p>${$(el).html()}</p>`);
    });
  });

  // 3. Loại bỏ thẻ định dạng nếu chỉ lấy Plain Text
  if (options.plainTextOnly) {
    const tags = ['b', 'strong', 'i', 'em', 'u', 'mark', 'span', 'font'];
    tags.forEach(tag => {
      $(tag).each((_, el) => {
        $(el).replaceWith($(el).contents());
      });
    });
  }

  // 4. Chuyển đổi danh sách (ul, ol, li) thành các paragraph rời
  $('li').each((_, el) => {
    const $el = $(el);
    // Tránh lồng các thẻ block bên trong thẻ p mới bằng cách unwrap chúng
    $el.find('p, div, h1, h2, h3, h4, h5, h6').each((_, child) => {
      $(child).replaceWith($(child).html() || '');
    });
    $el.replaceWith(`<p>${$el.html().trim()}</p>`);
  });

  $('ul, ol').each((_, el) => {
    $(el).replaceWith($(el).html() || '');
  });

  // 5. Chuyển đổi div thành p
  $('div').each((_, el) => {
    const style = $(el).attr('style') || '';
    $(el).replaceWith(`<p style="${style}">${$(el).html()}</p>`);
  });

  // 6. Xóa các thuộc tính không cần thiết (id, class, custom attributes)
  $('*').each((_, el) => {
    const attrs = Object.keys(el.attribs);
    attrs.forEach(attr => {
      if (attr !== 'style') {
        $(el).removeAttr(attr);
      }
    });

    if (options.plainTextOnly) {
      $(el).removeAttr('style');
    } else {
      const style = $(el).attr('style');
      if (style) {
        const safeStyles = style.split(';')
          .map(s => s.trim())
          .filter(Boolean)
          .filter(decl => {
            const prop = decl.split(':')[0].trim().toLowerCase();
            return HTML_CLEANER.SAFE_STYLE_PROPS.has(prop);
          });
        if (safeStyles.length > 0) {
          $(el).attr('style', safeStyles.join('; '));
        } else {
          $(el).removeAttr('style');
        }
      }
    }
  });

  // 7. Loại bỏ các phần tử rỗng
  const preserve = new Set(['br', 'hr', 'img', 'td', 'th']);
  let foundEmpty = true;
  while (foundEmpty) {
    foundEmpty = false;
    $('*').each((_, el) => {
      const tag = el.tagName.toLowerCase();
      if (!preserve.has(tag) && $(el).html().trim() === '') {
        $(el).remove();
        foundEmpty = true;
      }
    });
  }

  // 8. Định dạng lại khoảng trắng thừa trong text
  let output = $.html();
  output = output
    .replace(/^[\s\u00A0]*[·◦▪]+[\s\u00A0]*$/gm, '')
    .replace(/[ \t\u00A0]{2,}/g, ' ');

  return output;
};

export { cleanHtmlUtils };
