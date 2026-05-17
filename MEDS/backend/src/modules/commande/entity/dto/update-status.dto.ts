import { OrderStatus }
from "../../../../shared/enums/order-status.enum";

export class UpdateStatusDto {

  statut!: OrderStatus;
}