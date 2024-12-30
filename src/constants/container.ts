export const DI_TOKEN_NAMES = {
    APPOINTMENT_MODEL: Symbol('AppointmentModel'),
    SLOT_MODEL: Symbol('SlotModel'),
    USER_MODEL: Symbol('UserModel'),

    APPOINTMENT_REPOSITORY: Symbol('AppointmentRepository'),
    SLOT_REPOSITORY: Symbol('SlotRepository'),
    USER_REPOSITORY: Symbol('UserRepository'),

    APPOINTMENT_SERVICE: Symbol('AppointmentService'),
    SLOT_SERVICE: Symbol('SlotService'),
    USER_SERVICE: Symbol('UserService'),

    APPOINTMENT_CONTROLLER: Symbol('AppointmentController'),
    SLOT_CONTROLLER: Symbol('SlotController'),
    USER_CONTROLLER: Symbol('UserController'),
} as const;
