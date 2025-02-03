const User = require('../../models/User'); // Adjust the path as necessary
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mocking bcrypt and jwt
jest.mock('bcryptjs', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword'),
  compare: jest.fn().mockResolvedValue(true),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mockedToken'),
}));

describe('User Model', () => {
  let user;

  beforeEach(() => {
    user = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });
  });

  it('should create a user', () => {
    expect(user).toHaveProperty('id');
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.role).toBe('user');
    expect(user.isActive).toBe(true);
  });

//   it('should hash password before create', async () => {
//     // Simulate the hook directly on the user instance
//     await User.hooks.beforeCreate(user);
    
//     // Check that the password was hashed
//     expect(user.password).toBe('hashedPassword');
//   });

//   it('should hash password before update if changed', async () => {
//     user.password = 'newpassword';
    
//     // Simulate that the password has changed
//     user.changed = jest.fn().mockReturnValue(true);
    
//     await User.hooks.beforeUpdate(user);
    
//     // Check that the password was hashed again
//     expect(user.password).toBe('hashedPassword');
//   });

//   it('should not hash password before update if not changed', async () => {
//     user.changed = jest.fn().mockReturnValue(false);
    
//     // Simulate calling the hook without changing the password
//     await User.hooks.beforeUpdate(user);
    
//     // Ensure the password remains unchanged in this case
//     expect(user.password).toBe('hashedPassword'); // Ensure it remains the same
//   });

  it('should generate a token', () => {
    const token = user.generateToken();
    
    expect(token).toBe('mockedToken');
  });

  it('should validate password', async () => {
    const isValid = await user.validatePassword('password123');
    
    expect(isValid).toBe(true);
  });
});
