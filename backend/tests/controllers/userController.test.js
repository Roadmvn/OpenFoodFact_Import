const { User } = require('../../models');
const logger = require('../../utils/logger');
const authController = require('../../controllers/userController'); 

// Mock des dépendances
jest.mock('../../models');
jest.mock('../../utils/logger');
jest.mock('../../controllers/orderController', () => ({
  createOrder: jest.fn(),
  getUserOrders: jest.fn(),
  // ... mock other methods as needed
}));
const orderController = require('../../controllers/orderController');

describe('Auth Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {},
            user: {},
            ip: '127.0.0.1',
            get: jest.fn().mockReturnValue('test-user-agent')
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
        req.body = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123'
        };

        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue({
            id: 1,
            ...req.body,
            role: 'user',
            generateToken: jest.fn().mockReturnValue('fake-token')
        });

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            user: expect.any(Object),
            token: 'fake-token'
        }));
        });
        
        it('should handle registration error', async () => {
            req.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123'
            };

            User.findOne.mockRejectedValue(new Error('Database error'));

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
        });

        it('should return 400 if email is already registered', async () => {
        req.body = { email: 'existing@example.com' };
        User.findOne.mockResolvedValue({ id: 1 });

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email already registered' });
        });
    });

    describe('login', () => {
        it('should login user successfully', async () => {
        req.body = {
            email: 'user@example.com',
            password: 'password123'
        };

        const mockUser = {
            id: 1,
            email: 'user@example.com',
            validatePassword: jest.fn().mockResolvedValue(true),
            generateToken: jest.fn().mockReturnValue('fake-token')
        };

        User.findOne.mockResolvedValue(mockUser);

        await authController.login(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            user: expect.any(Object),
            token: 'fake-token'
        }));
        });

        it('should return 401 for invalid credentials', async () => {
        req.body = {
            email: 'user@example.com',
            password: 'wrongpassword'
        };

        const mockUser = {
            validatePassword: jest.fn().mockResolvedValue(false)
        };

        User.findOne.mockResolvedValue(mockUser);

        await authController.login(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
        });
        
        it('should handle login error', async () => {
            req.body = {
                email: 'user@example.com',
                password: 'password123'
            };

            User.findOne.mockRejectedValue(new Error('Database error'));

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error during login' });
        });
    });

    describe('logout', () => {
        it('should logout user successfully', async () => {
        req.user = { id: 1, email: 'user@example.com' };

        await authController.logout(req, res);

        expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
        });
    });

    describe('getProfile', () => {
        it('should return user profile', async () => {
        req.user = { id: 1 };
        const mockUser = {
            id: 1,
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            role: 'user'
        };

        User.findByPk.mockResolvedValue(mockUser);

        await authController.getProfile(req, res);

        expect(res.json).toHaveBeenCalledWith(mockUser);
        });

        it('should return 404 if user not found', async () => {
        req.user = { id: 999 };
        User.findByPk.mockResolvedValue(null);

        await authController.getProfile(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
        });

        it('should handle getProfile error', async () => {
            req.user = { id: 1 };
            User.findByPk.mockRejectedValue(new Error('Database error'));

            await authController.getProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error fetching profile' });
        });
    });

    describe('updateProfile', () => {
        it('should update user profile successfully', async () => {
            req.user = { id: 1 };
            req.body = { firstName: 'Jane', lastName: 'Doe' };
            const mockUser = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                role: 'user',
                update: jest.fn().mockResolvedValue({
                    id: 1,
                    firstName: 'Jane',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    role: 'user'
                })
            };

            User.findByPk.mockResolvedValueOnce(mockUser).mockResolvedValueOnce({
                id: 1,
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'john@example.com',
                role: 'user'
            });

            await authController.updateProfile(req, res);

            expect(mockUser.update).toHaveBeenCalledWith(req.body);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                firstName: 'Jane',
                lastName: 'Doe'
            }));
        });

        it('should handle updateProfile error', async () => {
            req.user = { id: 1 };
            req.body = { firstName: 'Jane', lastName: 'Doe' };
            User.findByPk.mockRejectedValue(new Error('Database error'));

            await authController.updateProfile(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
        });
    });


    describe('getAllUsers', () => {
        it('should return all users for admin', async () => {
        req.user = { id: 1, role: 'admin' };
        const mockUsers = [
            { id: 1, firstName: 'Admin', lastName: 'User', email: 'admin@example.com', role: 'admin' },
            { id: 2, firstName: 'Regular', lastName: 'User', email: 'user@example.com', role: 'user' }
        ];

        User.findAll.mockResolvedValue(mockUsers);

        await authController.getAllUsers(req, res);

        expect(res.json).toHaveBeenCalledWith(mockUsers);
        });

        it('should return 403 for non-admin users', async () => {
        req.user = { id: 2, role: 'user' };

        await authController.getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ message: 'Access denied' });
        });
        it('should handle getAllUsers error', async () => {
            req.user = { id: 1, role: 'admin' };
            User.findAll.mockRejectedValue(new Error('Database error'));

            await authController.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Error retrieving users' });
        });
    });
});
