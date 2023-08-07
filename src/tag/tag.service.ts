//все запросы к бд пишем в сервисе
//в контроллере методы сервиса
import { Injectable } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { Repository } from 'typeorm'; //паттерн для работы с конкретной таблицей
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>, //tagRepository - orm wrapper
  ) {}
  async findAll(): Promise<TagEntity[]> {
    return await this.tagRepository.find(); //возвращаем все записи из таблицы
  }
}
