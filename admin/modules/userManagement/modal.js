// modules/modal.js
import { $ } from './dom.js';

export function resetModal() {
  $('#employeeId').value = '';
  $('#fullname').value = '';
  $('#email').value = '';
  $('#password').value = '';
  $('#location').value = '';
  $('#position').value = '';
  $('#role').value = 'user';
  $('#status').value = 'active';
  $('#avatarPreview').src = '/images/default-avatar.png';
  $('#avatarInput').value = '';
}

export function openModal(mode = 'add') {
  const modal = $('#addUserModal');
  modal.style.display = 'flex';

  if (mode === 'add') {
    $('#saveBtn').style.display = 'block';
    $('#updateBtn').style.display = 'none';
    resetModal();
  } else {
    $('#saveBtn').style.display = 'none';
    $('#updateBtn').style.display = 'block';
  }
}

export function closeModal() {
  $('#addUserModal').style.display = 'none';
  resetModal();
}
