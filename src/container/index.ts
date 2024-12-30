import { container } from 'tsyringe';

import { Appointment } from '../models/appointment.model';
import { Slot } from '../models/slot.model';
import { User } from '../models/user.model';

import { AppointmentRepository } from '../repositories/appointment.repository';
import { SlotRepository } from '../repositories/slot.repository';
import { UserRepository } from '../repositories/user.repository';

import { AppointmentService } from '../services/appointment.service';
import { SlotService } from '../services/slot.service';
import { UserService } from '../services/user.service';

import { AppointmentController } from '../controllers/appointment.controller';
import { SlotController } from '../controllers/slot.controller';
import { UserController } from '../controllers/user.controller';

import { DI_TOKEN_NAMES } from '../constants/container';

export const registerDependencies = () => {
    container.clearInstances();

    container.register(DI_TOKEN_NAMES.APPOINTMENT_MODEL, { useValue: Appointment });
    container.register(DI_TOKEN_NAMES.SLOT_MODEL, { useValue: Slot });
    container.register(DI_TOKEN_NAMES.USER_MODEL, { useValue: User });

    container.register(DI_TOKEN_NAMES.APPOINTMENT_REPOSITORY, { useClass: AppointmentRepository });
    container.register(DI_TOKEN_NAMES.SLOT_REPOSITORY, { useClass: SlotRepository });
    container.register(DI_TOKEN_NAMES.USER_REPOSITORY, { useClass: UserRepository });

    container.register(DI_TOKEN_NAMES.APPOINTMENT_SERVICE, { useClass: AppointmentService });
    container.register(DI_TOKEN_NAMES.SLOT_SERVICE, { useClass: SlotService });
    container.register(DI_TOKEN_NAMES.USER_SERVICE, { useClass: UserService });

    container.register(DI_TOKEN_NAMES.APPOINTMENT_CONTROLLER, { useClass: AppointmentController });
    container.register(DI_TOKEN_NAMES.SLOT_CONTROLLER, { useClass: SlotController });
    container.register(DI_TOKEN_NAMES.USER_CONTROLLER, { useClass: UserController });

    console.log('Registering dependencies...');
    Object.entries(DI_TOKEN_NAMES).forEach(([key, value]) => {
        console.log(`Registering ${key}: ${value.toString()}`);
    });
};
