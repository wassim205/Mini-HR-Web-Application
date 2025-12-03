export const getToken = () => localStorage.getItem('token');
export const getUserRole = () => localStorage.getItem('userRole');
export const getUserId = () => localStorage.getItem('userId');

export const isAuthenticated = () => !!getToken();
export const isAdmin = () => getUserRole() === 'admin';
export const isEmployee = () => getUserRole() === 'employee';

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  window.location.href = '/login';
};

export const redirectToDashboard = () => {
  const role = getUserRole();
  return role === 'admin' ? '/admin/dashboard' : '/employee/dashboard';
};