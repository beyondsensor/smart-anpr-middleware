import z from "zod";

export const vehicleEnterRequestSchema = z.object ( { 
    anpr: z.string(), 
    image: z.string()
}) 
export type VehicleEnterRequest = z.infer < typeof vehicleEnterRequestSchema>; 

export const simulateVehicleRequestSchema = z.object ( { 
    anpr: z.string(), 
    image: z.string(), 
    timeInScene: z.number().min(0).max(60 * 60 * 24 * 1000).default(60000),
    intervalPerTick: z.number().default(1000) 
})
export type SimulateVehicleRequest = z.infer < typeof simulateVehicleRequestSchema>; 
