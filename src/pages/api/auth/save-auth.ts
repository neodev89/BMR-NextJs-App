import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import pool from "@/lib/db";
import { FieldPacket, QueryResult } from "mysql2";
import { ObjProps } from "@/@types/bmr-type";
import bcrypt from "bcryptjs";

interface loginProps {
  email: string;
  password: string;
}

export default async function handlerAuthLogin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const filePath = new URL("../../../data/accounts.json", import.meta.url);
  try {
    const { email, password }: loginProps = await req.body;

    if (req.method === "POST") {
      if (email && password) {
        const contents = await fs.readFile(filePath, { encoding: "utf-8" });
        const data: Array<ObjProps> = JSON.parse(contents);
        if (data.length > 0) {
          const filterDataPassword = await Promise.all(
            data.map(async (el) => {
              const isPasswordCorrect = await bcrypt.compare(
                password,
                el.password
              );
              return isPasswordCorrect ? el : null;
            })
          );

          const filterElementPassword = filterDataPassword.filter(
            (el) => el !== null
          );

          if (
            filterElementPassword[0].utente &&
            filterElementPassword[0].password
          ) {
            return res.status(200).json({
              success: true,
              message: "I dati sono corretti!",
            });
          } else {
            return res.status(404).json({
              access: false,
              message: "L'utente non è registrato!",
            });
          }
        } else {
          return res.status(404).json({
            success: false,
            message: "I dati passati erano inesistenti",
          });
        }
      } else {
        console.error("il file è vuoto");
        return res.status(400).json({
          success: false,
          message: "Il file è vuoto, nessun dato da elaborare!",
        });
      }
    } else if (req.method === "PUT") {
      // Query per inserire i email e password nel db
      const [result]: [QueryResult, FieldPacket[]] = await pool.query(
        "INSERT INTO nextjs-table (email, password) VALUES (?, ?)",
        [email, password]
      );

      return res
        .status(201)
        .json({ success: true, message: "I dati sono stati salvati", result });
    } else {
      return res
        .status(500)
        .json({ success: false, message: "I dati non sono passati" });
    }
  } catch (error) {
    console.error("Errore: ", error);
  }
}
