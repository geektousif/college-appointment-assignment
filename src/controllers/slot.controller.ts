import { slotService } from '../services/slot.service';
import { ApiResponse } from '../utils/ApiResponse';

import asyncHandler from '../utils/asyncHandler';

const createSlot = asyncHandler(async (req, res) => {
    const { startTime, endTime } = req.body;

    const professorId = Number(req.user?.id);

    const slot = await slotService.createSlot({ startTime, endTime, professorId });

    return res.status(201).json(ApiResponse(201, 'Slot created successfully', slot));
});

// TODO Get Slots based on Date
const getMySlots = asyncHandler(async (req, res) => {
    const professorId = Number(req.user?.id);

    const slots = await slotService.getSlotsByProfessor(professorId);

    return res.status(200).json(ApiResponse(200, 'Slots fetched successfully', slots));
});

const getSlotsByProfessor = asyncHandler(async (req, res) => {
    const professorId = Number(req.params.professorId);

    const slots = await slotService.getAvailableSlots(professorId);

    return res.status(200).json(ApiResponse(200, 'Slots fetched successfully', slots));
});

// TODO : Update Slot

const deleteSlot = asyncHandler(async (req, res) => {
    const professorId = Number(req.user?.id);
    const slotId = Number(req.params.slotId);

    await slotService.deleteSlot(slotId, professorId);

    return res.status(200).json(ApiResponse(200, 'Slot deleted successfully', null));
});

export const slotController = { createSlot, getMySlots, getSlotsByProfessor, deleteSlot };
