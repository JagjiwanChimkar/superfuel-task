import { getModelForClass, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";

export default class JsCodeSnippet {
  _id!: Types.ObjectId;

  @prop({ type: String, required: true })
  public name!: string;

  @prop({ type: String, required: true })
  public code!: string;
}

export const JsCodeSnippetModel = getModelForClass(JsCodeSnippet);
