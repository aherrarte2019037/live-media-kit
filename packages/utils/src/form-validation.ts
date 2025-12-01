import z from "zod";

export const HexColorSchema = z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid Hex Code");
