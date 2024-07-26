import { EntityManager, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AbstractRepository, User } from '@app/common';

@Injectable()
export class UsersRepository extends AbstractRepository<User> {
  protected readonly logger = new Logger(UsersRepository.name);

  constructor(
    @InjectRepository(User) usersRepository: Repository<User>,
    entityManager: EntityManager,
  ) {
    super(usersRepository, entityManager);
  }
}
