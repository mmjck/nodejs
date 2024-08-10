import { Field, ObjectType } from "type-graphql";

@ObjectType() 
export class  Customer {
    @Field()
    mame: string;
}