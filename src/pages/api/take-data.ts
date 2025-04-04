import { BmrType, ObjProps } from "@/@types/bmr-type";
import fs from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";

const filePath = path.join(process.cwd(), "src", "data", "data-bmr.json");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Imposta gli header comuni
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "no-store");

    if (req.method === "GET") {
      // console.log(filePath);

      const resFile = await fs.readFile(filePath, "utf-8");
      if (!resFile || resFile === "") {
        return res.status(405).json({ message: "Empty file" });
      }

      const data: BmrType = JSON.parse(resFile);
      data.data.method = req.method || "GET";
      console.log("Contenuto di data:", JSON.stringify(data.data, null, 2));

      return res.status(200).json({
        data: data.data
      });
    } else if (req.method === "PUT") {
      try {
        const newData: ObjProps = req.body;
        // req.body è già un oggetto in Next.js,
        // quindi passare req.body
        // a JSON.parse genera un errore perché JSON.parse
        //  si aspetta una stringa, non un oggetto.

        if (!newData || Object.keys(newData).length === 0) {
          return res.status(404).json({
            message: "Attenzione! Nessun dato ritornato",
          });
        }

        const resFile = await fs.readFile(filePath, "utf-8");
        // leggi il file che contiene i dati

        if (resFile) {
          const data: BmrType = JSON.parse(resFile);
          data.data.BMR.push(newData);
          data.data.method = req.method || "PUT";
          console.log("I dati restituiti dalla API sono: ", data);
          return res.status(304).json({
            data: data.data.BMR,
            method: data.data.method,
          });
        } else {
          return res.status(405).json({
            message: "Non ci sono dati!",
          });
        }
      } catch (error) {
        console.error("Messaggio di errore: ", error);
      }
    }
  } catch (error) {
    res.status(500).json({ message: `Qualcosa è andato storto ${error}` });
  }
}
