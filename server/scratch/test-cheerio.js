import { cleanHtmlUtils } from '../common/helpers/htmlCleaner.util.js';

const sample = `
<ul>
  <li>Presentation Layer (Tầng hiển thị/Điều hướng): Tiếp nhận...</li>
  <li>Business Logic Layer (Tầng xử lý nghiệp vụ): Nơi tập trung...</li>
  <li>Data Access Layer (Tầng truy cập dữ liệu): Phụ trách...</li>
</ul>
`;

console.log("Cleaned HTML:");
console.log(cleanHtmlUtils(sample));
