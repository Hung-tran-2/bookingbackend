const { sequelize } = require('./config/database');
const { User } = require('./models');
const bcrypt = require('bcrypt');

const createAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected');

        const email = 'admin@example.com';
        const password = 'admin123'; // Mật khẩu mặc định
        const hashedPassword = await bcrypt.hash(password, 10);

        const [user, created] = await User.findOrCreate({
            where: { email },
            defaults: {
                full_name: 'Admin User',
                phone: '0909000000',
                password: hashedPassword,
                role: 'admin',
                is_verified: true  // Admin luôn được verify sẵn
            }
        });

        if (created) {
            console.log('✅ Admin user created successfully');
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        } else {
            console.log('⚠️ Admin user already exists');
            // Update password if needed
            user.password = hashedPassword;
            user.role = 'admin';
            user.is_verified = true;  // Đảm bảo admin luôn được verify
            await user.save();
            console.log('✅ Admin password reset to default');
        }

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await sequelize.close();
    }
};

createAdmin();
