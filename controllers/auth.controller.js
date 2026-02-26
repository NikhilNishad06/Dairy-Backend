const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

// Generate JWT token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// User registration
exports.register = async (req, res) => {
    try {
        const { email, password, full_name, phone, address, role } = req.body;

        // Sign up with Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    phone,
                    role: role || 'customer'
                }
            }
        });

        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        // Generate token
        const token = generateToken({
            id: authData.user.id,
            email: authData.user.email,
            role: role || 'customer'
        });

        res.status(201).json({
            message: 'Registration successful. Please verify your email.',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                full_name,
                role: role || 'customer'
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Sign in with Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Get user profile from users table
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single();

        if (profileError) {
            return res.status(500).json({ error: 'Error fetching user profile' });
        }

        // Generate token
        const token = generateToken({
            id: authData.user.id,
            email: authData.user.email,
            role: userProfile.role
        });

        res.json({
            message: 'Login successful',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                ...userProfile
            },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Admin login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if user is admin in users table
        const { data: userProfile, error: profileError } = await supabase
            .from('users')
            .select('role')
            .eq('id', authData.user.id)
            .single();

        if (profileError || userProfile.role !== 'admin') {
            await supabase.auth.signOut();
            return res.status(403).json({ error: 'Admin access only' });
        }

        const token = generateToken({
            id: authData.user.id,
            email: authData.user.email,
            role: 'admin'
        });

        res.json({
            message: 'Admin login successful',
            user: {
                id: authData.user.id,
                email: authData.user.email,
                role: 'admin'
            },
            token,
            isAdmin: true
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Logout
exports.logout = async (req, res) => {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};