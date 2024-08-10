import { Arg, FieldResolver, Query, Resolver, Root } from "type-graphql";
import { CreateAppointmentInput } from "../dto/input/create-appointment-input";
import { Appointment } from "../dto/models/appointment-model";
import { Customer } from "../dto/models/customer-model";

@Resolver(() => Appointment)
export class AppointmentsResolver {

    @Query(() => [Appointment])
    async appointments() {
        return [
            {
                startsAt: new Date(),
                endsAt: new Date()
            }
        ]
    }

    @Query(() => Appointment)
    async createAppointment(@Arg("data") data: CreateAppointmentInput) {
        const appointment: Appointment = {
            startsAt: data.startsAt,
            endsAt: data.endsAt
        }

        return appointment;
    }

    @FieldResolver(() => Customer)
    async customer(@Root() appointment: Appointment) {
        console.log(appointment);

        return {
            name: "Jhon doe"
        }
    }
} 