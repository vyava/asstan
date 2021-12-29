import { NextFunction, Request, Response } from 'express';
import '../models/distributor.model';
import { Distributor } from '../models/distributor.model';
import { User } from '../models/user.model';
import * as _ from 'lodash';

import * as httpStatus from 'http-status';
const APIError = require('../utils/APIError');

export async function isUserExist(email: string) {
  try {
    const user = await User.findOne({ 'email.address': email });
    return await user;
  } catch {
    return null;
  }
};

export async function me(req: Request, res: Response, next: NextFunction){
  try {
    let user = req.user;
    if(!user) throw new Error("User is not exist");

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    let user = req.user;
    if(!user) throw new Error("User is not exist");

    console.log(user);

    res.json(req.body);

  } catch (error) {
    next(error)
  }
}

export async function getUsersWithDist(req: Request, res: Response, next: NextFunction) {
  try {

    let users = await User.getUsers();
    // let users = await User.find({}).populate({
    //   path : 'distributor',
    //   select : 'name'
    // });

    if (!users.length && users.length == 9) res.json("Kullanıcı bulunamadı");

    res.json(users);

  } catch (error) {
    res.json("Hata")
  }
}

export async function getUsersAll(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find();
    console.log("başladı")
    if (_.isEmpty(users) || users.length == 0)
      throw new APIError({
        message: 'Kullanıcı bulunamadı',
        status: httpStatus.NOT_FOUND
      });
    res.json(users);
  } catch (err) {
    res.json(err)
  }
}

export async function setUsers(req, res, next) {
  try {
    const users = await User.find();

    users.map((user) => {
      user.distributor.map(async (dist) => {
        console.log(dist);
        let foundedDist = await Distributor.findOne({ _id: dist });
        // console.log(foundedDist);
        // foundedDist.users.push(user._id);

        // foundedDist.save();
      });
    });
    res.send(200);
  } catch (error) {
    res.json("hata", error)
  }
}

export async function getUsersEmailByDist(req: Request, res: Response, next: NextFunction) {
  try {
    let distName = req.query.name;
    let usersEmail = await User.aggregate([
      {
        $lookup: {
          from: 'dist',
          localField: 'distributor',
          foreignField: '_id',
          as: 'distributorler'
        }
      },
      {
        $unwind: '$distributorler'
      },
      {
        $project: {
          _id: 0,
          name: '$email.name',
          address: '$email.address',
          distName: '$distributorler.name',
          bolge: '$distributorler.altBolge',
          taskName: '$taskName',
          status: '$distributorler.status'
        }
      },
      {
        $match: {
          distName: distName,
          status: true
        }
      },
      {
        $group: {
          _id: '$taskName',
          users: {
            $addToSet: {
              name: '$name',
              address: '$address'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          task: '$_id',
          users: '$users'
        }
      }
    ]);
    if (!usersEmail)
      throw new APIError({
        message: 'Kullanıcı email listesi bulunamadı',
        status: httpStatus.NOT_FOUND
      });
    res.json(usersEmail);
  } catch (err) {
    next(err);
  }
}
