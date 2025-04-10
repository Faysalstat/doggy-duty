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
    scheduledDaysOfWeek?: string;
}

export enum TaskStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
  }

export enum AppConfigNames {
  PRICE_PER_BAG_ROLL = 'PRICE_PER_BAG_ROLL',
  PRICE_PER_NEW_STATION_INSTALLMENT = 'PRICE_PER_NEW_STATION_INSTALLMENT',
  PRICE_PER_BIN_REPLACEMENT = 'PRICE_PER_BIN_REPLACEMENT',
  PRICE_PER_HAND_SANITIZER = 'PRICE_PER_HAND_SANITIZER',
}

export class EventData{
  id?: number;
  title?: string;
  scheduledDate?:string;
  scheduledTime?:string;
  description?: string;
  status?: string;
}
