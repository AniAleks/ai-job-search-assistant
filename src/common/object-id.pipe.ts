import { BadRequestException, type PipeTransform } from "@nestjs/common";
import { isValidObjectId } from "mongoose";

export class ObjectIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(`"${value}" is not a valid id`);
    }
    return value;
  }
}
