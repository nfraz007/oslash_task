import { Op } from "sequelize";
import { Shortcut } from "../models/Shortcut";
import { User } from "../models/User";
import {
  GetAllByUserParams,
  ShortcutServiceInterface,
} from "../types/ShortcutType";
import { JwtEncode } from "../utils/JwtUtils";

export const ShortcutService: ShortcutServiceInterface = {
  async create(
    user: User,
    shortlink: string,
    url: string,
    description: string,
    tags: string = ""
  ): Promise<Shortcut> {
    if (!user) throw "user is required.";
    if (!shortlink) throw "shortlink is required.";
    if (!url) throw "url is required.";
    if (!description) throw "description is required";

    // check shortlinks for unique
    const userId = user.id;
    const shortcuts: Shortcut[] = await Shortcut.findAll({
      raw: true,
      where: {
        userId,
        shortlink,
      },
    });
    if (shortcuts.length) throw "sorry, shortlink should be unique.";

    const shortcut: Shortcut = await Shortcut.create({
      userId,
      shortlink,
      url,
      description,
      tags,
    });
    return shortcut.toJSON();
  },
  async getAllByUser(
    user: User,
    params: GetAllByUserParams = {}
  ): Promise<Shortcut[]> {
    if (!user) throw "user is required.";
    const userId = user.id;

    // optional params
    const sortBy: string =
      params.sortBy &&
      ["shortlink", "description", "createdAt"].includes(params.sortBy)
        ? params.sortBy
        : "shortlink";
    const sortType: string =
      params.sortType &&
      ["asc", "desc", "ASC", "DESC"].includes(params.sortType)
        ? params.sortType
        : "asc";
    const search: string = params.search ? params.search : "";

    let conditions: any = {
      userId,
    };
    if (search) {
      conditions = {
        ...conditions,
        [Op.or]: {
          shortlink: { [Op.like]: `%${search}%` },
          description: { [Op.like]: `%${search}%` },
          tags: { [Op.like]: `%${search}%` },
        },
      };
    }
    const shortcuts: Shortcut[] = await Shortcut.findAll({
      raw: true,
      where: conditions,
      order: [[sortBy, sortType]],
    });
    return shortcuts;
  },
  async update(user: User, id: string, data: any): Promise<void> {
    if (!user) throw "user is required.";
    const userId = user.id;

    const shortcuts: Shortcut[] = await Shortcut.findAll({
      raw: true,
      where: {
        userId,
        shortlink: data.shortlink,
      },
    });
    if (shortcuts.length && shortcuts[0]["id"] != id)
      throw "sorry, shortlink should be unique.";

    await Shortcut.update(data, {
      where: { id },
    });
  },
  async delete(user: User, id: string): Promise<void> {
    if (!user) throw "user is required.";
    const userId = user.id;

    await Shortcut.destroy({
      where: {
        id,
        userId,
      },
    });
  },
};
