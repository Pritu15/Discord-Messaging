const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authModel = require('../models/auth.model');
const env = require('../config/env');

const SALT_ROUNDS = 10;

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

exports.registerUser = async ({ email, username, password, displayName, dateOfBirth }) => {
  if (!env.jwtSecret) {
    throw createHttpError(500, 'JWT configuration is missing');
  }

  const existingEmail = await authModel.findUserByEmail(email);
  if (existingEmail.rowCount > 0) {
    throw createHttpError(409, 'Email is already registered');
  }

  const existingUsername = await authModel.findUserByUsername(username);
  if (existingUsername.rowCount > 0) {
    throw createHttpError(409, 'Username is already taken');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  let createdUser;

  try {
    const result = await authModel.createUser({
      email,
      username,
      passwordHash,
      displayName,
      dateOfBirth,
    });

    createdUser = result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      if ((error.constraint || '').includes('users_email_key')) {
        throw createHttpError(409, 'Email is already registered');
      }

      if ((error.constraint || '').includes('users_username_key')) {
        throw createHttpError(409, 'Username is already taken');
      }

      throw createHttpError(409, 'User already exists');
    }

    throw error;
  }

  const token = jwt.sign(
    {
      sub: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

  return {
    token,
    user: {
      id: createdUser.id,
      email: createdUser.email,
      username: createdUser.username,
      displayName: createdUser.display_name,
      dateOfBirth: createdUser.date_of_birth,
      createdAt: createdUser.created_at,
    },
  };
};
