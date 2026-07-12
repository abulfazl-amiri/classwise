import crypto from "node:crypto";

import * as tokenUtils from "../../utils/token.util.js";

import { parseToSec } from "../../utils/parser.util.js";

import AppError from "../../utils/error.util.js";

import redis from "../../config/redis.js";

//// utils
const generateSessionId = function () {
  return crypto.randomUUID();
};
const deleteCustomSessions = async function (userId, sessionKeys) {
  const userKey = `user-sessions:${userId.toString()}`;

  const sessions = await Promise.all(sessionKeys.map((key) => redis.hgetall(key)));
  const sessionIdKeys = sessions
    .filter((session) => session?.sessionId)
    .map((session) => `session-id:${session.sessionId}`);

  await redis.del(...sessionIdKeys, userKey, ...sessionKeys);
};

//// services

// only use it for signup and signin
const createSession = async function ({ userId, ip, userAgent }) {
  const accessToken = tokenUtils.signAccessToken(userId);
  const refreshToken = tokenUtils.generateRefreshToken();

  const sessionKey = `session:${tokenUtils.hashToken(refreshToken)}`;
  const sessionId = generateSessionId();

  const sessionExpireTimeInSec = parseToSec(process.env.REFRESH_TOKEN_EXPIRES_IN);

  await redis.hset(sessionKey, {
    sessionId: sessionId,
    userId: userId.toString(), // to convert ObjectId() -> string
    userAgent: userAgent,
    ip: ip,
  });
  await redis.expire(sessionKey, sessionExpireTimeInSec);

  // to controll all sessions of a user in single key-value
  const userKey = `user-sessions:${userId.toString()}`;
  await redis.sadd(userKey, sessionKey);

  // to enable getting and deleting by Id
  const sessionIdKey = `session-id:${sessionId}`;
  await redis.set(sessionIdKey, sessionKey, "EX", sessionExpireTimeInSec);

  return { accessToken, refreshToken };
};

const validateSession = async function (refreshToken) {
  const key = `session:${tokenUtils.hashToken(refreshToken)}`;
  const session = await redis.hgetall(key);
  if (!session?.sessionId || !session?.userId || Object.keys(session).length === 0) return;
  return session;
};

const deleteSession = async function (refreshToken) {
  const sessionkey = `session:${tokenUtils.hashToken(refreshToken)}`;

  const session = await redis.hgetall(sessionkey);
  if (!session?.userId || !session?.sessionId) return;

  const userKey = `user-sessions:${session.userId}`;
  const sessionIdKey = `session-id:${session.sessionId}`;

  await redis.srem(userKey, sessionkey);
  await redis.del(sessionIdKey, sessionkey);
};

const revokeAll = async function (userId) {
  const userKey = `user-sessions:${userId.toString()}`;
  const sessionKeys = await redis.smembers(userKey);

  await deleteCustomSessions(userId, sessionKeys);

  return sessionKeys.length;
};

const revokeAllExcept = async function (userId, sessionId) {
  const userKey = `user-sessions:${userId.toString()}`;
  const exceptKey = await redis.get(`session-id:${sessionId}`);

  const allSessionKeys = await redis.smembers(userKey);
  const sessionKeys = allSessionKeys.filter((sk) => sk !== exceptKey);

  await deleteCustomSessions(userId, sessionKeys);
  await redis.sadd(userKey, exceptKey); // re-add the kept session to the set

  return sessionKeys.length;
};

// services
const getAll = async function (userId) {
  const userKey = `user-sessions:${userId.toString()}`;
  const sessionKeys = await redis.smembers(userKey);
  if (sessionKeys.length === 0) return [];

  const rawSessions = await Promise.all(sessionKeys.map((key) => redis.hgetall(key)));

  // to clean up stale refrences in user-sessions []
  const staleKeys = sessionKeys.filter(
    (_, i) => !rawSessions[i]?.userId || !rawSessions[i]?.sessionId,
  );
  if (staleKeys.length !== 0) await redis.srem(userKey, ...staleKeys);

  const sessions = rawSessions
    .filter((session) => session?.userId)
    .map(({ userId, ...rest }) => rest);
  return sessions;
};

const revokeAllSessions = async function (userId, refreshToken) {
  const sessionKey = `session:${tokenUtils.hashToken(refreshToken)}`;
  const sessionId = await redis.hget(sessionKey, "sessionId");

  return await revokeAllExcept(userId, sessionId);
};

const getById = async function (sessionId) {
  const sessionKey = await redis.get(`session-id:${sessionId}`);
  const session = await redis.hgetall(sessionKey);

  if (!session?.sessionId || !session?.userId) throw new AppError("Session not found", 404);

  const { userId, ...rest } = session;
  return rest;
};

const deleteById = async function (sessionId) {
  const sessionIdKey = `session-id:${sessionId}`;

  const sessionKey = await redis.get(sessionIdKey);
  const session = await redis.hgetall(sessionKey);
  if (!session?.sessionId || !session?.userId) throw new AppError("Session not found", 404);

  const userKey = `user-sessions:${session.userId}`;

  await redis.srem(userKey, sessionKey);
  await redis.del(sessionIdKey, sessionKey);
};

export {
  createSession,
  validateSession,
  deleteSession,
  revokeAll,
  revokeAllSessions,
  getAll,
  getById,
  deleteById,
};
