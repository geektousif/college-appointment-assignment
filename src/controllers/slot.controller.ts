import { inject, injectable } from 'tsyringe';
import { checkSlotAvailabilityDto } from '../dto/slot.dto';
import { SlotService } from '../services/slot.service';
import { SuccessResponse } from '../utils/ApiResponse';
import asyncHandler from '../utils/asyncHandler';
import { DI_TOKEN_NAMES } from '../constants/container';

// TODO add error handling for response

@injectable()
export class SlotController {
    constructor(@inject(DI_TOKEN_NAMES.SLOT_SERVICE) private slotService: SlotService) {}

    createSlot = asyncHandler(async (req, res) => {
        const { startTime, endTime } = req.body;

        // LATER: req.user maybe undefined
        const professor = req.user?.id as string;

        const slot = await this.slotService.createSlot({ startTime, endTime, professor });

        return res.status(201).json(SuccessResponse(201, 'Slot created successfully', slot));
    });

    getMySlots = asyncHandler(async (req, res) => {
        const professorId = req.user?.id;
        console.log(professorId);

        const slots = await this.slotService.getAllSlots(professorId as string);

        return res.status(200).json(SuccessResponse(200, 'Slots fetched successfully', slots));
    });

    searchSlots = asyncHandler(async (req, res) => {
        const professorId = req.params.professorId;
        const { startTime, endTime } = req.body;

        const searchData: checkSlotAvailabilityDto = {
            professor: professorId,
            startTime,
            endTime,
        };

        // TODO Add to validation
        // if (!user || user.role !== 'professor') {
        //     throw new NotFoundError('Invalid Professor Id');
        // }
        const slots = await this.slotService.searchSlots(searchData);

        if (!slots.length) {
            return res.status(200).json(SuccessResponse(200, 'No slots found', slots));
        }

        return res.status(200).json(SuccessResponse(200, 'Slots fetched successfully', slots));
    });

    // TODO : Update Slot

    deleteSlot = asyncHandler(async (req, res) => {
        const professorId = req.user?.id as string;
        const slotId = req.params.slotId;

        await this.slotService.deleteSlot(slotId, professorId);

        return res.status(204).json(SuccessResponse(204, 'Slot deleted successfully'));
    });
}
