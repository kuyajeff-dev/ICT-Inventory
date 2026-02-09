// modules/pagination.js
export function updatePagination(filteredData, currentPage, PAGE_SIZE) {
  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;

  document.getElementById('prevBtn').disabled = currentPage === 1;
  document.getElementById('nextBtn').disabled = currentPage === totalPages;
}
