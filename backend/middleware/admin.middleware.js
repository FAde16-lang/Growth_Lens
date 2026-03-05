module.exports = function (req, res, next) {
    // In a real app, req.user is set by auth middleware
    // We mock the check here. 
    // For demo, let's assume if email contains 'admin', they are admin.

    // Ensure auth middleware ran first
    if (!req.user) {
        return res.status(401).json({ msg: 'Authorization denied' });
    }

    // Mock admin check
    // In real app: if (req.user.role !== 'admin') ...
    // Here we will just let it pass for the demo user "admin@example.com" or similar logic if we had it,
    // but effectively we'll just log it and pass for this scaffolding.
    console.log("Admin middleware check for user:", req.user.id);

    // To properly simulate, let's restrict to a specific fake ID or request property
    // For now, we allow access to show the dashboard.
    next();
};
