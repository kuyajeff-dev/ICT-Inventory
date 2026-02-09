// modules/users.js
import { fetchUsers, updateUserStatus, addUser } from './api.js';
import { updatePagination } from './pagination.js';
import { openModal, closeModal } from './modal.js';
import { $ } from './dom.js';

export class UserManager {
  constructor() {
    this.editingEmployeeId = null;
    this.usersData = [];
    this.filteredData = [];
    this.currentPage = 1;
    this.PAGE_SIZE = 5;

    this.init();
  }
  isDuplicateUser(employeeId,fullname){
    return this.usersData.find(u =>
      u.employeeId.toLowerCase() == employeeId.toLowerCase() ||
      u.fullname.toLowerCase() == fullname.toLowerCase()
    );
  }

  async init() {
    await this.loadUsers();

    $('#searchInput').addEventListener('input', () => this.applyFilters());
    $('#statusFilter').addEventListener('change', () => this.applyFilters());
    $('#roleFilter').addEventListener('change', () => this.applyFilters());

    $('#prevBtn').addEventListener('click', () => this.prevPage());
    $('#nextBtn').addEventListener('click', () => this.nextPage());

    $('#saveBtn').addEventListener('click', () => this.saveUser());
    $('#updateBtn').addEventListener('click', () => this.updateStatus());

    $('#addUserBtn').addEventListener('click', () => openModal('add'));
    $('#closeModal').addEventListener('click', () => closeModal());
    $('#cancelBtn').addEventListener('click', () => closeModal());

    $('#usersTbody').addEventListener('click', (e) => {
      const id = e.target.dataset.edit;
      if (id) this.openEditModal(id);
    });
  }

  async loadUsers() {
    const tbody = $('#usersTbody');
    tbody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';

    try {
      const users = await fetchUsers();
      this.usersData = users;
      this.filteredData = users;
      this.renderUsers();
    } catch (err) {
      tbody.innerHTML = '<tr><td colspan="7">Error loading users</td></tr>';
    }
  }

  renderUsers() {
    const tbody = $('#usersTbody');
    tbody.innerHTML = '';

    const start = (this.currentPage - 1) * this.PAGE_SIZE;
    const pageData = this.filteredData.slice(start, start + this.PAGE_SIZE);

    if (!pageData.length) {
      tbody.innerHTML = '<tr><td colspan="7">No users found</td></tr>';
      return;
    }

    pageData.forEach(user => {
      const avatar = user.avatar ? user.avatar.replace(/\\/g, '/').replace(/^\/?uploads\/?/, '') : null;
      const avatarSrc = avatar ? `/uploads/${avatar}` : '/images/default-avatar.png';
      const status = user.status ? user.status.toLowerCase().trim() : 'inactive';

      tbody.insertAdjacentHTML('beforeend', `
        <tr>
          <td>${user.employeeId}</td>
          <td><img src="${avatarSrc}" style="width:36px;height:36px;border-radius:50%;object-fit:cover;"></td>
          <td>${user.fullname}</td>
          <td>${user.email}</td>
          <td>${user.location}</td>
          <td>${user.role}</td>
          <td><span class="badge ${status}">${status}</span></td>
          <td><button class="btn btn-secondary btn-sm" data-edit="${user.employeeId}">Edit</button></td>
        </tr>
      `);
    });

    updatePagination(this.filteredData, this.currentPage, this.PAGE_SIZE);
  }

  applyFilters() {
    const search = $('#searchInput').value.toLowerCase();
    const status = $('#statusFilter').value;
    const role = $('#roleFilter').value;
    const location = $('#locationFilter').value;

    this.filteredData = this.usersData.filter(u => {
      const matchesSearch =
        u.employeeId.toLowerCase().includes(search) ||
        u.fullname.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search);

      const matchesStatus = status ? u.status === status : true;
      const matchesRole = role ? u.role === role : true;
      const matchesLocation = location ? u.location === location : true;

      return matchesSearch && matchesStatus && matchesRole && matchesLocation;
    });

    this.currentPage = 1;
    this.renderUsers();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.renderUsers();
    }
  }

  nextPage() {
    const totalPages = Math.ceil(this.filteredData.length / this.PAGE_SIZE);
    if (this.currentPage < totalPages) {
      this.currentPage++;
      this.renderUsers();
    }
  }

  openEditModal(employeeId) {
    this.editingEmployeeId = employeeId;
    const user = this.usersData.find(u => u.employeeId === employeeId);

    $('#employeeId').value = user.employeeId;
    $('#fullname').value = user.fullname;
    $('#email').value = user.email;
    $('#role').value = user.role;
    $('#status').value = user.status;
    $('#location').value = user.location; // ✅ ADD THIS

    const avatar = user.avatar
      ? user.avatar.replace(/\\/g, '/').replace(/^\/?uploads\/?/, '')
      : null;

    $('#avatarPreview').src = avatar
      ? `/uploads/${avatar}`
      : '/images/default-avatar.png';

    $('#employeeId').readOnly = true;
    $('#fullname').readOnly = true;
    $('#email').readOnly = true;
    $('#location').disabled = true; // ✅ disable editing
    $('#position').readOnly = true;
    $('#role').disabled = true;
    $('#password').disabled = true;
    $('#avatarInput').disabled = true;

    openModal('edit');
  }

  async updateStatus() {
    const status = $('#status').value;

    const { isConfirmed } = await Swal.fire({
      title: 'Update Status?',
      text: `Change status to ${status}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, update',
      cancelButtonText: 'Cancel'
    });

    if (!isConfirmed) return;

    try {
      await updateUserStatus(this.editingEmployeeId, status);

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Status updated successfully.',
        timer: 1500,
        showConfirmButton: false
      });

      closeModal();
      this.loadUsers();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to update status'
      });
    }
  }

  async saveUser() {
    const fullname = $('#fullname').value.trim();
    const email = $('#email').value.trim();
    const password = $('#password').value.trim();
    const location = $('#location').value.trim();
    const role = $('#role').value;
    const position = $('#position').value.trim();
    const employeeId = $('#employeeId').value.trim();
    const status = $('#status').value;

    if (!employeeId || !fullname || !email || !password || !location) {
      return Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required fields.',
      });
    }

    // ✅ DUPLICATE CHECK
    const duplicate = this.isDuplicateUser(employeeId, fullname);

    if (duplicate) {
      return Swal.fire({
        icon: 'error',
        title: 'Duplicate Entry',
        text:
          duplicate.employeeId === employeeId
            ? 'Employee ID already exists.'
            : 'Employee name already exists.',
      });
    }

    const formData = new FormData();
    formData.append('employeeId', employeeId);
    formData.append('fullname', fullname);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('location', location);
    formData.append('role', role);
    formData.append('position', position);
    formData.append('status', status);

    if ($('#avatarInput').files.length > 0) {
      formData.append('avatar', $('#avatarInput').files[0]);
    }

    try {
      await addUser(formData);

      Swal.fire({
        icon: 'success',
        title: 'User Added',
        text: `${fullname} was added successfully.`,
        timer: 1800,
        showConfirmButton: false
      });

      closeModal();
      this.loadUsers();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message || 'Failed to add user'
      });
    }
  }
}
