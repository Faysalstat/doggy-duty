INSERT INTO `communityServiceSchedules`(`id`, `frequency`, `startingDate`, `lastServedDate`, `lastInvoiceGenerated`, `scheduledDaysOfWeek`, `noOfPetStation`, `noOfGarbageBin`, `chargePerPetStation`, `chargePerGarbageBin`, `createdAt`, `updatedAt`, `communityId`) VALUES 
(1, 7, '2025-03-31', '2025-03-31', '2025-03-31', '', 10, 1, 25, 25, '2025-03-14 22:00:22', '2025-04-07 23:00:02', 1),
(2, 7, '2025-03-31', '2025-03-31', '2025-03-31', '', 10, 3, 25, 25, '2025-03-15 14:21:00', '2025-04-07 22:59:45', 2),
(4, 7, '2025-03-31', '2025-04-7', '2025-03-31', '', 3, 0, 35, 0, '2025-04-05 12:50:26', '2025-04-07 22:59:15', 4);
INSERT INTO `job_order`(`id`, `date`, `createdAt`, `updatedAt`) VALUES 
(1, '2025-03-31', '2025-04-05 13:17:00', '2025-04-05 13:17:00'), 
(2, '2025-04-07', '2025-04-07 10:06:00', '2025-04-07 10:06:00');

INSERT INTO `task`(`id`, `status`, `scheduledDate`, `isBagRollReplaced`, `isBinReplaced`, `isNewStationInstalled`, `isHandSanitizerReplaced`, `noOfPetStation`, `noOfGarbageBin`, `noOfBagRollReplaced`, `noOfBinReplacement`, `noOfHandSanitizerReplacement`, `noOfStationInstalled`, `chargePerPetStation`, `chargePerGarbageBin`, `chargePerBagRoll`, `chargePerBinReplacement`, `chargePerNewStationInstallment`, `chargePerHandSanitizer`, `createdAt`, `updatedAt`, `jobOrderId`, `communityId`) VALUES 
(1, 'completed', '2025-03-31', 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 35, 0, 8.5, 150, 349, 2.5, '2025-04-05 13:17:00', '2025-04-05 13:18:16', 1, 4),
(2, 'completed', '2025-03-31', 1, 0, 0, 0, 10, 3, 3, 0, 0, 0, 25, 25, 8.5, 150, 349, 2.5, '2025-04-05 13:17:01', '2025-04-05 13:18:31', 1, 2),
(3, 'completed', '2025-03-31', 1, 0, 0, 0, 10, 1, 3, 0, 0, 0, 25, 25, 8.5, 150, 349, 2.5, '2025-04-05 13:17:01', '2025-04-05 13:18:41', 1, 1),
(4, 'completed', '2025-04-07', 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 35, 0, 8.5, 150, 349, 2.5, '2025-04-07 10:06:00', '2025-04-07 22:59:15', 2, 4),
(5, 'completed', '2025-04-07', 0, 0, 0, 0, 10, 3, 0, 0, 0, 0, 25, 25, 8.5, 150, 349, 2.5, '2025-04-07 10:06:00', '2025-04-07 22:59:45', 2, 2),
(6, 'completed', '2025-04-07', 1, 0, 0, 0, 10, 1, 1, 0, 0, 0, 25, 25, 8.5, 150, 349, 2.5, '2025-04-07 10:06:00', '2025-04-07 23:00:02', 2, 1);

INSERT INTO `billing`(`id`, `totalAmount`, `taskCompletionDate`, `status`, `invoiceGenerated`, `createdAt`, `updatedAt`, `communityId`, `taskId`) VALUES 
(1, 105, '2025-03-31', 'pending', 0, '2025-04-05 13:18:16', '2025-04-05 13:18:16', 4, 1),
(2, 350.5, '2025-03-31', 'pending', 0, '2025-04-05 13:18:31', '2025-04-05 13:18:31', 2, 2),
(3, 300.5, '2025-03-31', 'pending', 0, '2025-04-05 13:18:41', '2025-04-05 13:18:41', 1, 3),
(4, 2133, '2025-04-07', 'pending', 0, '2025-04-07 22:59:15', '2025-04-07 22:59:15', 4, 4),
(5, 325, '2025-04-07', 'pending', 0, '2025-04-07 22:59:45', '2025-04-07 22:59:45', 2, 5),
(6, 283.5, '2025-04-07', 'pending', 0, '2025-04-07 23:00:02', '2025-04-07 23:00:02', 1, 6);
