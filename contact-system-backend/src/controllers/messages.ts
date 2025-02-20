import { RequestHandler } from "express";

import {
  fetchAllMessages,
  fetchMessageById,
  createMessage,
  updateReadStatus,
  deleteMsg,
  fetchUnreadMessages,
  fetchAllReports,
} from "../services/messages";
import { checkValidationError } from "../utils/validation";
import { broadcast } from "../app";
import { MessageType } from "../types";

export const addMessage: RequestHandler = async (req, res, next) => {
  try {
    checkValidationError(req);
    const { name, message, gender_id, country_id } = req.body;

    const newMessage: MessageType = await createMessage({
      name,
      message,
      gender_id,
      country_id,
    });

    broadcast({ type: "NEW_MESSAGE", content: newMessage });

    return res.status(201).json({ message: newMessage });
  } catch (error) {
    next(error);
  }
};

export const fetchUnread: RequestHandler = async (req, res, next) => {
  try {
    const messages: MessageType[] = await fetchUnreadMessages();

    return res.status(200).json({ messages });
  } catch (error) {
    next(error);
  }
};

export const fetchReports: RequestHandler = async (req, res, next) => {
  try {
    const reports = await fetchAllReports();

    return res.status(200).json(reports);
  } catch (error) {
    next(error);
  }
};

export const fetchAll: RequestHandler = async (req, res, next) => {
  try {
    checkValidationError(req);
    const { page, limit, sort } = req.query;

    const skip = (+page - 1) * +limit;
    const data = await fetchAllMessages({
      skip,
      limit,
      sort,
    });

    const messages = Array.isArray(data.messages) ? data.messages : [];

    return res.status(200).json({ messages, count: data.count });
  } catch (error) {
    next(error);
  }
};

export const readMessage: RequestHandler = async (req, res, next) => {
  try {
    checkValidationError(req);
    const id = parseInt(req.params.id);

    await updateReadStatus(id);

    return res.status(200).json({ result: true });
  } catch (error) {
    next(error);
  }
};

export const deleteMessage: RequestHandler = async (req, res, next) => {
  try {
    checkValidationError(req);
    const id = parseInt(req.params.id);

    await deleteMsg(id);

    return res.status(200).json({ result: true });
  } catch (error) {
    next(error);
  }
};

export const fetchById: RequestHandler = async (req, res, next) => {
  try {
    checkValidationError(req);
    const id = parseInt(req.params.id);

    const message: MessageType = await fetchMessageById(id);

    return res.status(200).json({ message });
  } catch (error) {
    next(error);
  }
};
