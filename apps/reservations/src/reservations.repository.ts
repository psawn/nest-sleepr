import { EntityManager, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository } from '@app/common';
import { Reservation } from './models/reservation.entity';

@Injectable()
export class ReservationsRepository extends AbstractRepository<Reservation> {
  protected readonly logger = new Logger(ReservationsRepository.name);

  constructor(
    @InjectRepository(Reservation)
    reservationRepository: Repository<Reservation>,
    entityManager: EntityManager,
  ) {
    super(reservationRepository, entityManager);
  }
}
