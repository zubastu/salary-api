import type { Request, Response } from "express";
import CoefficientModel from "../models/coeffitientModel";

export const getCoefficient = (_: Request, res: Response) => {
  CoefficientModel.findOne({
    where: {
      id: 0,
    },
  })
    .then((coefficient) => {
      if (coefficient) {
        const {
          pricePerHour,
          valueOfGainGoodDay,
          valueOfGainGoodNight,
          valueOfGainVeryGoodDay,
          valueOfGainVeryGoodNight,
          coefficientOfGainGood,
          coefficientOfGainVeryGood,
          id,
        } = coefficient;
        res.status(200).json({
          pricePerHour,
          valueOfGainGoodDay,
          valueOfGainGoodNight,
          valueOfGainVeryGoodDay,
          valueOfGainVeryGoodNight,
          coefficientOfGainGood: Number(coefficientOfGainGood),
          coefficientOfGainVeryGood: Number(coefficientOfGainVeryGood),
          id,
        });
      }
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};

export const setCoefficient = (req: Request, res: Response) => {
  CoefficientModel.update(
    { ...req.body },
    {
      where: {
        id: 0,
      },
      returning: true,
    },
  )
    .then((coefficient) => {
      const {
        pricePerHour,
        valueOfGainGoodDay,
        valueOfGainGoodNight,
        valueOfGainVeryGoodDay,
        valueOfGainVeryGoodNight,
        coefficientOfGainGood,
        coefficientOfGainVeryGood,
        id,
      } = coefficient[1][0];
      res.status(200).json({
        pricePerHour,
        valueOfGainGoodDay,
        valueOfGainGoodNight,
        valueOfGainVeryGoodDay,
        valueOfGainVeryGoodNight,
        coefficientOfGainGood: Number(coefficientOfGainGood),
        coefficientOfGainVeryGood: Number(coefficientOfGainVeryGood),
        id,
      });
    })
    .catch(() => {
      res.status(400).json({ message: "Bad request" });
    });
};
