/**
 * Granular Role-Based Access Control (RBAC) Middleware
 * Enforces permission scopes per role (admin, faculty, student, exam_coordinator)
 */

const rolePermissions = {
  admin: ['read:all', 'write:timetable', 'write:substitutions', 'manage:users', 'export:all', 'publish:timetable'],
  faculty: ['read:all', 'write:substitutions', 'write:leaves', 'read:workload', 'export:personal'],
  student: ['read:timetable', 'read:notices', 'export:personal', 'checkin:attendance'],
  exam_coordinator: ['read:all', 'write:exams', 'export:all']
};

function checkPermission(requiredPermission) {
  return (req, res, next) => {
    const role = (req.user && req.user.role) || req.headers['x-user-role'] || 'student';
    const permissions = rolePermissions[role] || rolePermissions.student;

    if (permissions.includes('read:all') || permissions.includes(requiredPermission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: `Forbidden: Action requires permission [${requiredPermission}]. Role '${role}' insufficient.`
    });
  };
}

module.exports = { checkPermission, rolePermissions };
