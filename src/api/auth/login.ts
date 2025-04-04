import { NextApiRequest, NextApiResponse } from "next";

export default async function handlerAuthLogin (req: NextApiRequest, res: NextApiResponse) {
   try {
    const { email, password } = await req.body;
    

   } catch (error) {
    console.error("Errore: ", error);
   }
}