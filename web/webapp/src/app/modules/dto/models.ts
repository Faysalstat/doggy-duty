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
    frequency: number = 1;
    scheduledDaysOfWeek?: string;
    isFlatRate?: boolean;
    serviceName?: string;
    flatRateAmount?: number;
    
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
  description?: string;
  communityName?: string;
  status?: string;
}
export const TASK_CONFIG = [
  {
    toggleKey: 'isBagRollReplaced',
    toggleLabel: 'Replace Bag',
    numberKey: 'noOfBagRollReplaced',
    numberLabel: 'Number of Roll Replaced',
    priceKey: 'chargePerBagRoll',
    priceLabel: 'Price Per Rolls',
    totalKey: 'totalBagReplacementPrice'
  },
  {
    toggleKey: 'isBinReplaced',
    toggleLabel: 'Replace 10 Gal. Bin',
    numberKey: 'noOfBinReplacement',
    numberLabel: 'Number Bin Replaced',
    priceKey: 'chargePerBinReplacement',
    priceLabel: 'Price Per Bins',
    totalKey: 'totalBinReplacementPrice'
  },
  {
    toggleKey: 'isNewStationInstalled',
    toggleLabel: 'Install new Station',
    numberKey: 'noOfStationInstalled',
    numberLabel: 'Number of Station Installed',
    priceKey: 'chargePerNewStationInstallment',
    priceLabel: 'Price Per Station',
    totalKey: 'totalStationInstallationPrice'
  },
  {
    toggleKey: 'isHandSanitizerReplaced',
    toggleLabel: 'Replace Hand Sanitizer',
    numberKey: 'noOfHandSanitizerReplacement',
    numberLabel: 'Number of Sanitizer Replaced',
    priceKey: 'chargePerHandSanitizer',
    priceLabel: 'Price Per Sanitizer',
    totalKey: 'totalHandSanitizerReplacedPrice'
  },
  {
    toggleKey: 'isTrashBagReplaced',
    toggleLabel: 'Replace Trash Bag',
    numberKey: 'noOfTrashBagReplacement',
    numberLabel: 'Number of Trash Bag Replaced',
    priceKey: 'chargePerTrashBag',
    priceLabel: 'Price Per Trash Bag',
    totalKey: 'totalTrashBagReplacedPrice'
  }
];
