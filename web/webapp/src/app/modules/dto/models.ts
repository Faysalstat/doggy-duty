export class JobServiceDTO {
    id?: number;
    serviceName?: string;
}
export class CommunityDTO {
    id?: number;
    communityName?: string;
    communityAddress?: string;
    latitude?: number;
    longitude?: number;
    camOfcommunity?: string;
    gateCode?: string;
    phone?: string;
    email?: string;
    lockBoxCode?: string;
    specialRequest?: string;
    noOfPetStation?: number;
    noOfGarbageBin?: number;
    chargePerPetStation?: number;
    chargePerGarbageBin?: number;
    frequency?: string;
    startingDate?: Date;
    lastServedDate?: Date;
    scheduledDate?: Date;
}

export enum TaskStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
  }
